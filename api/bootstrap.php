<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function load_dotenv_file(): void
{
    $path = dirname(__DIR__) . '/.env';
    if (!is_file($path)) {
        return;
    }

    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = array_map('trim', explode('=', $line, 2));
        $value = trim($value, "\"'");
        if ($key !== '' && getenv($key) === false) {
            putenv("{$key}={$value}");
            $_ENV[$key] = $value;
        }
    }
}

load_dotenv_file();

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function env_value(string $key, string $default = ''): string
{
    $value = getenv($key);
    return $value === false ? $default : $value;
}

function pdo(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = env_value('MYSQL_HOST', '127.0.0.1');
    $port = env_value('MYSQL_PORT', '3306');
    $database = env_value('MYSQL_DATABASE');
    $user = env_value('MYSQL_USER');
    $password = env_value('MYSQL_PASSWORD');

    if ($database === '' || $user === '') {
        throw new RuntimeException('MySQL is not configured. Set MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER, and MYSQL_PASSWORD.');
    }

    $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function base64url_encode_php(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function base64url_decode_php(string $value): string
{
    $padding = strlen($value) % 4;
    if ($padding > 0) {
        $value .= str_repeat('=', 4 - $padding);
    }

    $decoded = base64_decode(strtr($value, '-_', '+/'), true);
    return $decoded === false ? '' : $decoded;
}

function create_session_token(array $session): string
{
    $secret = env_value('ADMIN_SESSION_SECRET');
    if ($secret === '') {
        throw new RuntimeException('ADMIN_SESSION_SECRET is not configured');
    }

    $payload = base64url_encode_php(json_encode($session, JSON_UNESCAPED_SLASHES));
    $signature = base64url_encode_php(hash_hmac('sha256', $payload, $secret, true));
    return "v1.{$payload}.{$signature}";
}

function verify_session_token(string $token): ?array
{
    $secret = env_value('ADMIN_SESSION_SECRET');
    if ($secret === '' || $token === '') {
        return null;
    }

    if (hash_equals($secret, $token)) {
        return [
            'id' => 'admin',
            'email' => env_value('ADMIN_EMAIL', 'admin'),
            'roles' => ['admin', 'properties', 'blogs'],
        ];
    }

    $parts = explode('.', $token);
    if (count($parts) !== 3 || $parts[0] !== 'v1') {
        return null;
    }

    [$version, $payload, $signature] = $parts;
    $expected = base64url_encode_php(hash_hmac('sha256', $payload, $secret, true));
    if (!hash_equals($expected, $signature)) {
        return null;
    }

    $decoded = json_decode(base64url_decode_php($payload), true);
    if (!is_array($decoded) || empty($decoded['id']) || empty($decoded['email']) || !is_array($decoded['roles'] ?? null)) {
        return null;
    }

    $decoded['roles'] = array_values(array_intersect($decoded['roles'], ['admin', 'properties', 'blogs']));
    return $decoded;
}

function current_session(): ?array
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if ($header === '' && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }

    return str_starts_with($header, 'Bearer ')
        ? verify_session_token(substr($header, 7))
        : null;
}

function has_role(?array $session, string $role): bool
{
    if (!$session || !is_array($session['roles'] ?? null)) {
        return false;
    }

    return in_array('admin', $session['roles'], true) || in_array($role, $session['roles'], true);
}

function require_post(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        json_response(['error' => ['message' => 'Method not allowed']], 405);
    }
}
