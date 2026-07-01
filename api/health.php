<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

try {
    $db = pdo();
    $db->query('SELECT 1');
    json_response([
        'ok' => true,
        'database' => 'mysql',
        'php' => PHP_VERSION,
    ]);
} catch (Throwable $error) {
    json_response([
        'ok' => false,
        'database' => 'mysql',
        'error' => $error->getMessage(),
    ], 500);
}
