<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function required_role_for_bucket(?string $bucket): ?string
{
    return match ($bucket) {
        'property-images' => 'properties',
        'blog-images' => 'blogs',
        default => null,
    };
}

function can_upload(?string $bucket): bool
{
    $session = current_session();
    if (has_role($session, 'admin')) {
        return true;
    }

    $requiredRole = required_role_for_bucket($bucket);
    return $requiredRole !== null && has_role($session, $requiredRole);
}

try {
    require_post();
    $body = read_json_body();
    $bucket = isset($body['bucket']) ? (string)$body['bucket'] : null;
    $path = (string)($body['path'] ?? '');
    $file = (string)($body['file'] ?? '');

    if (!can_upload($bucket)) {
        json_response(['error' => ['message' => 'Unauthorized']], 401);
    }

    $cloudName = env_value('CLOUDINARY_CLOUD_NAME');
    $apiKey = env_value('CLOUDINARY_API_KEY');
    $apiSecret = env_value('CLOUDINARY_API_SECRET');
    if ($cloudName === '' || $apiKey === '' || $apiSecret === '') {
        json_response(['error' => ['message' => 'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.']], 500);
    }
    if ($file === '' || $path === '') {
        json_response(['error' => ['message' => 'Upload path and file are required']], 400);
    }

    $timestamp = (string)time();
    $baseFolder = env_value('CLOUDINARY_FOLDER', 'pelek-home-hub');
    $safeBucket = preg_replace('/[^a-z0-9-_]/i', '-', $bucket ?: 'uploads');
    $folder = "{$baseFolder}/{$safeBucket}";
    $publicId = preg_replace('/\.[^.]+$/', '', $path);
    $publicId = preg_replace('/[^a-z0-9-_\/.]/i', '-', $publicId);
    $transformation = 'f_auto,q_auto:good,c_limit,w_1800,h_1800';
    $signature = sha1("folder={$folder}&public_id={$publicId}&timestamp={$timestamp}&transformation={$transformation}{$apiSecret}");

    $post = [
        'file' => $file,
        'api_key' => $apiKey,
        'timestamp' => $timestamp,
        'signature' => $signature,
        'folder' => $folder,
        'public_id' => $publicId,
        'transformation' => $transformation,
    ];

    $curl = curl_init("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload");
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $post,
        CURLOPT_RETURNTRANSFER => true,
    ]);
    $response = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $curlError = curl_error($curl);
    curl_close($curl);

    if ($response === false) {
        throw new RuntimeException($curlError ?: 'Cloudinary upload failed');
    }

    $result = json_decode($response, true);
    if ($status < 200 || $status >= 300) {
        throw new RuntimeException($result['error']['message'] ?? 'Cloudinary upload failed');
    }

    json_response([
        'path' => $path,
        'publicUrl' => $result['secure_url'] ?? '',
        'width' => $result['width'] ?? null,
        'height' => $result['height'] ?? null,
        'bytes' => $result['bytes'] ?? null,
        'format' => $result['format'] ?? null,
    ]);
} catch (Throwable $error) {
    json_response(['error' => ['message' => $error->getMessage()]], 400);
}
