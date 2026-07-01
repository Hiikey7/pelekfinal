<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

try {
    require_post();

    $users = [];
    if (env_value('ADMIN_EMAIL') !== '' && env_value('ADMIN_PASSWORD') !== '') {
        $users[] = [
            'id' => 'admin',
            'email' => env_value('ADMIN_EMAIL'),
            'password' => env_value('ADMIN_PASSWORD'),
            'roles' => ['admin', 'properties', 'blogs'],
        ];
    }

    if (env_value('PROPERTY_BLOG_ADMIN_EMAIL') !== '' && env_value('PROPERTY_BLOG_ADMIN_PASSWORD') !== '') {
        $users[] = [
            'id' => 'property-blog-admin',
            'email' => env_value('PROPERTY_BLOG_ADMIN_EMAIL'),
            'password' => env_value('PROPERTY_BLOG_ADMIN_PASSWORD'),
            'roles' => ['properties', 'blogs'],
        ];
    }

    if (!$users || env_value('ADMIN_SESSION_SECRET') === '') {
        json_response(['error' => ['message' => 'Admin auth is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET.']], 500);
    }

    $body = read_json_body();
    $user = null;
    foreach ($users as $candidate) {
        if (($body['email'] ?? '') === $candidate['email'] && ($body['password'] ?? '') === $candidate['password']) {
            $user = $candidate;
            break;
        }
    }

    if (!$user) {
        json_response(['error' => ['message' => 'Invalid email or password']], 401);
    }

    $accessToken = create_session_token([
        'id' => $user['id'],
        'email' => $user['email'],
        'roles' => $user['roles'],
    ]);

    json_response([
        'access_token' => $accessToken,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'app_metadata' => [
                'role' => in_array('admin', $user['roles'], true) ? 'admin' : 'limited_admin',
                'roles' => $user['roles'],
            ],
        ],
    ]);
} catch (Throwable $error) {
    json_response(['error' => ['message' => $error->getMessage()]], 500);
}
