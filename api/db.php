<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

$tableColumns = [
    'amenities' => ['created_at', 'id', 'name'],
    'blogs' => ['author', 'category', 'content', 'created_at', 'date', 'excerpt', 'id', 'image', 'read_time', 'show_on_homepage', 'title', 'updated_at'],
    'contact_messages' => ['created_at', 'email', 'full_name', 'id', 'message', 'phone', 'read', 'subject'],
    'expenses' => ['amount', 'category', 'created_at', 'description', 'id', 'title', 'updated_at'],
    'faqs' => ['answer', 'created_at', 'id', 'question', 'sort_order', 'updated_at'],
    'offers' => ['active', 'created_at', 'cta_link', 'cta_text', 'description', 'id', 'image', 'offer_type', 'promo_code', 'title', 'updated_at'],
    'orders' => ['created_at', 'id', 'notes', 'num_days', 'payment_method', 'phone', 'price_per_night', 'property_id', 'property_title', 'status', 'total_amount', 'updated_at', 'visitor_name'],
    'properties' => ['amenities', 'bathrooms', 'bedrooms', 'category', 'created_at', 'description', 'featured', 'google_map_link', 'guests', 'id', 'image', 'images', 'lat', 'lng', 'location', 'price', 'price_label', 'rating', 'reviews_count', 'social_media_type', 'social_media_url', 'title', 'type', 'updated_at', 'whatsapp'],
    'reviews' => ['avatar', 'comment', 'created_at', 'date', 'id', 'name', 'rating'],
    'site_settings' => ['id', 'key', 'updated_at', 'value'],
    'user_roles' => ['id', 'role', 'user_id'],
];

$publicReadTables = ['amenities', 'blogs', 'faqs', 'offers', 'properties', 'reviews', 'site_settings'];
$writeRolesByTable = ['blogs' => 'blogs', 'properties' => 'properties'];
$jsonColumns = ['properties' => ['amenities', 'images']];
$booleanColumns = [
    'blogs' => ['show_on_homepage'],
    'contact_messages' => ['read'],
    'offers' => ['active'],
    'properties' => ['featured'],
];

function assert_table(string $table, array $tableColumns): void
{
    if (!array_key_exists($table, $tableColumns)) {
        throw new RuntimeException("Table \"{$table}\" is not allowed");
    }
}

function assert_column(string $table, string $column, array $tableColumns): void
{
    if (!in_array($column, $tableColumns[$table], true)) {
        throw new RuntimeException("Column \"{$column}\" is not allowed for {$table}");
    }
}

function normalize_columns(string $table, string $columns, array $tableColumns): string
{
    if (trim($columns) === '*') {
        return '*';
    }

    $selected = array_values(array_filter(array_map('trim', explode(',', $columns))));
    foreach ($selected as $column) {
        assert_column($table, $column, $tableColumns);
    }

    return implode(', ', array_map(fn($column) => "`{$column}`", $selected));
}

function add_filters(string $table, array $filters, array &$params, array $tableColumns): string
{
    if (!$filters) {
        return '';
    }

    $clauses = [];
    foreach ($filters as $filter) {
        $column = (string)($filter['column'] ?? '');
        $operator = (string)($filter['operator'] ?? '');
        assert_column($table, $column, $tableColumns);

        if ($operator === 'eq') {
            $clauses[] = "`{$column}` = ?";
            $params[] = $filter['value'] ?? null;
        } elseif ($operator === 'neq') {
            $clauses[] = "`{$column}` <> ?";
            $params[] = $filter['value'] ?? null;
        } elseif ($operator === 'in') {
            $values = is_array($filter['value'] ?? null) ? $filter['value'] : [];
            if (!$values) {
                $clauses[] = '1 = 0';
            } else {
                $clauses[] = "`{$column}` IN (" . implode(', ', array_fill(0, count($values), '?')) . ')';
                array_push($params, ...$values);
            }
        } else {
            throw new RuntimeException("Unsupported filter operator: {$operator}");
        }
    }

    return ' WHERE ' . implode(' AND ', $clauses);
}

function normalize_value(string $table, string $column, mixed $value, array $jsonColumns, array $booleanColumns): mixed
{
    if (in_array($column, $jsonColumns[$table] ?? [], true)) {
        return is_string($value) ? $value : json_encode($value ?: [], JSON_UNESCAPED_SLASHES);
    }

    if (in_array($column, $booleanColumns[$table] ?? [], true)) {
        return $value ? 1 : 0;
    }

    return $value;
}

function clean_payload(string $table, array $payload, array $tableColumns, array $jsonColumns, array $booleanColumns): array
{
    $clean = [];
    foreach ($payload as $column => $value) {
        assert_column($table, (string)$column, $tableColumns);
        $clean[$column] = normalize_value($table, (string)$column, $value, $jsonColumns, $booleanColumns);
    }

    return $clean;
}

function decode_rows(string $table, array $rows, array $jsonColumns, array $booleanColumns): array
{
    foreach ($rows as &$row) {
        foreach ($jsonColumns[$table] ?? [] as $column) {
            $decoded = json_decode((string)($row[$column] ?? '[]'), true);
            $row[$column] = is_array($decoded) ? $decoded : [];
        }
        foreach ($booleanColumns[$table] ?? [] as $column) {
            if (array_key_exists($column, $row)) {
                $row[$column] = (bool)$row[$column];
            }
        }
    }

    return $rows;
}

function can_access(string $table, string $action, array $publicReadTables, array $writeRolesByTable): bool
{
    $session = current_session();
    if (has_role($session, 'admin')) {
        return true;
    }
    if ($action === 'select' && in_array($table, $publicReadTables, true)) {
        return true;
    }

    $requiredRole = $writeRolesByTable[$table] ?? null;
    return $action !== 'select' && $requiredRole && has_role($session, $requiredRole);
}

try {
    require_post();
    $body = read_json_body();
    $table = (string)($body['table'] ?? '');
    $action = (string)($body['action'] ?? '');

    assert_table($table, $tableColumns);
    if (!in_array($action, ['select', 'insert', 'update', 'delete'], true)) {
        throw new RuntimeException('Unsupported action');
    }
    if (!can_access($table, $action, $publicReadTables, $writeRolesByTable)) {
        json_response(['error' => ['message' => 'Unauthorized']], 401);
    }

    $db = pdo();
    $filters = is_array($body['filters'] ?? null) ? $body['filters'] : [];
    $params = [];
    $where = add_filters($table, $filters, $params, $tableColumns);

    if ($action === 'select') {
        if (($body['count'] ?? null) === 'exact' && !empty($body['head'])) {
            $statement = $db->prepare("SELECT COUNT(*) AS count FROM `{$table}`{$where}");
            $statement->execute($params);
            json_response(['data' => null, 'error' => null, 'count' => (int)$statement->fetchColumn()]);
        }

        $selected = normalize_columns($table, (string)($body['columns'] ?? '*'), $tableColumns);
        $sql = "SELECT {$selected} FROM `{$table}`{$where}";

        if (is_array($body['order'] ?? null)) {
            $orderColumn = (string)($body['order']['column'] ?? '');
            assert_column($table, $orderColumn, $tableColumns);
            $direction = (($body['order']['ascending'] ?? true) === false) ? 'DESC' : 'ASC';
            $sql .= " ORDER BY `{$orderColumn}` {$direction}";
        }

        if (!empty($body['limit'])) {
            $sql .= ' LIMIT ?';
            $params[] = (int)$body['limit'];
        }

        $statement = $db->prepare($sql);
        $statement->execute($params);
        $rows = decode_rows($table, $statement->fetchAll(), $jsonColumns, $booleanColumns);

        if (!empty($body['single']) || !empty($body['maybeSingle'])) {
            json_response([
                'data' => $rows[0] ?? null,
                'error' => !empty($body['single']) && count($rows) !== 1 ? ['message' => 'Row not found'] : null,
            ]);
        }

        json_response(['data' => $rows, 'error' => null]);
    }

    if ($action === 'insert') {
        $rowsToInsert = array_is_list($body['payload'] ?? []) ? $body['payload'] : [($body['payload'] ?? [])];
        $inserted = [];

        foreach ($rowsToInsert as $row) {
            $clean = clean_payload($table, is_array($row) ? $row : [], $tableColumns, $jsonColumns, $booleanColumns);
            if (!array_key_exists('id', $clean)) {
                $clean['id'] = bin2hex(random_bytes(16));
            }
            if (!$clean) {
                throw new RuntimeException('Insert payload is empty');
            }

            $columns = array_keys($clean);
            $sql = "INSERT INTO `{$table}` (`" . implode('`, `', $columns) . '`) VALUES (' . implode(', ', array_fill(0, count($columns), '?')) . ')';
            $statement = $db->prepare($sql);
            $statement->execute(array_values($clean));

            $select = $db->prepare("SELECT * FROM `{$table}` WHERE `id` = ?");
            $select->execute([$clean['id']]);
            $inserted = array_merge($inserted, decode_rows($table, $select->fetchAll(), $jsonColumns, $booleanColumns));
        }

        json_response(['data' => $inserted, 'error' => null]);
    }

    if ($action === 'update') {
        $clean = clean_payload($table, is_array($body['payload'] ?? null) ? $body['payload'] : [], $tableColumns, $jsonColumns, $booleanColumns);
        if (!$clean) {
            throw new RuntimeException('Update payload is empty');
        }
        if ($where === '') {
            throw new RuntimeException('Update requires at least one filter');
        }

        $columns = array_keys($clean);
        $setClause = implode(', ', array_map(fn($column) => "`{$column}` = ?", $columns));
        $updateParams = array_merge(array_values($clean), $params);
        $statement = $db->prepare("UPDATE `{$table}` SET {$setClause}{$where}");
        $statement->execute($updateParams);

        $select = $db->prepare("SELECT * FROM `{$table}`{$where}");
        $select->execute($params);
        json_response(['data' => decode_rows($table, $select->fetchAll(), $jsonColumns, $booleanColumns), 'error' => null]);
    }

    if ($action === 'delete') {
        if ($where === '') {
            throw new RuntimeException('Delete requires at least one filter');
        }

        $select = $db->prepare("SELECT * FROM `{$table}`{$where}");
        $select->execute($params);
        $deleted = decode_rows($table, $select->fetchAll(), $jsonColumns, $booleanColumns);

        $statement = $db->prepare("DELETE FROM `{$table}`{$where}");
        $statement->execute($params);
        json_response(['data' => $deleted, 'error' => null]);
    }
} catch (Throwable $error) {
    json_response(['data' => null, 'error' => ['message' => $error->getMessage()]], 400);
}
