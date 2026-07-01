<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

try {
    require_post();
    $body = read_json_body();
    $name = trim((string)($body['name'] ?? ''));
    $email = trim((string)($body['email'] ?? ''));
    $phone = trim((string)($body['phone'] ?? ''));
    $subject = trim((string)($body['subject'] ?? ''));
    $message = trim((string)($body['message'] ?? ''));

    if ($name === '' || $email === '' || $subject === '' || $message === '') {
        json_response(['error' => ['message' => 'Name, email, subject, and message are required']], 400);
    }

    $statement = pdo()->prepare(
        'INSERT INTO contact_messages (id, full_name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)'
    );
    $id = bin2hex(random_bytes(16));
    $statement->execute([$id, $name, $email, $phone, $subject, $message]);

    json_response(['success' => true, 'id' => $id]);
} catch (Throwable $error) {
    json_response(['error' => ['message' => $error->getMessage()]], 400);
}
