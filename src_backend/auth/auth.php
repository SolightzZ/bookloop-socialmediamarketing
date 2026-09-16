<?php

require_once __DIR__ . '/../config/config.php';

define('USERS_FILE', DATA_PATH . '/users.json');
define('TOKENS_FILE', DATA_PATH . '/tokens.json');
define('TOKEN_EXPIRY_DAYS', 7);

// ─── JSON File Operations ──────────────────────────────────────

function loadJson(string $filePath): array
{
    if (!file_exists($filePath)) {
        return [];
    }

    $fp = fopen($filePath, 'r');
    if ($fp === false) {
        return [];
    }

    flock($fp, LOCK_SH);
    $content = stream_get_contents($fp);
    fclose($fp);

    if (empty(trim($content))) {
        return [];
    }

    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

function saveJson(string $filePath, array $data): bool
{
    $dir = dirname($filePath);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $fp = fopen($filePath, 'w');
    if ($fp === false) {
        return false;
    }

    flock($fp, LOCK_EX);
    fwrite($fp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    fclose($fp);

    return true;
}

// ─── Token Management ─────────────────────────────────────────

function generateToken(string $userId): string
{
    $token = 'bl_' . $userId . '_' . time();
    $tokens = loadJson(TOKENS_FILE);

    $tokens[] = [
        'token' => $token,
        'userId' => $userId,
        'createdAt' => date('c'),
        'expiresAt' => date('c', time() + TOKEN_EXPIRY_DAYS * 86400),
    ];

    saveJson(TOKENS_FILE, $tokens);
    return $token;
}

function validateToken(string $token): ?string
{
    $tokens = loadJson(TOKENS_FILE);

    foreach ($tokens as $entry) {
        if ($entry['token'] === $token) {
            if (strtotime($entry['expiresAt']) < time()) {
                return null;
            }
            return $entry['userId'];
        }
    }

    return null;
}

function removeToken(string $token): void
{
    $tokens = loadJson(TOKENS_FILE);
    $tokens = array_filter($tokens, fn($t) => $t['token'] !== $token);
    saveJson(TOKENS_FILE, array_values($tokens));
}

// ─── User Operations ──────────────────────────────────────────

function loadUsers(): array
{
    return loadJson(USERS_FILE);
}

function saveUsers(array $users): bool
{
    return saveJson(USERS_FILE, $users);
}

function findUserByEmail(string $email): ?array
{
    $users = loadUsers();
    $clean = strtolower(trim($email));

    foreach ($users as $user) {
        if (strtolower($user['email']) === $clean) {
            return $user;
        }
    }

    return null;
}

function findUserById(string $id): ?array
{
    $users = loadUsers();

    foreach ($users as $user) {
        if ($user['id'] === $id) {
            return $user;
        }
    }

    return null;
}

function createUser(string $name, string $email, string $password): array
{
    $userId = 'usr_' . bin2hex(random_bytes(4));
    $now = date('c');

    $user = [
        'id' => $userId,
        'name' => trim($name),
        'email' => strtolower(trim($email)),
        'password' => $password,
        'avatar' => 'https://api.dicebear.com/7.x/initials/svg?seed=' . urlencode(trim($name)) . '&backgroundColor=0f2942,1565c0',
        'phone' => '',
        'bio' => 'สมาชิกรักการอ่านแห่ง BookLoop',
        'address' => (object) [],
        'createdAt' => $now,
        'updatedAt' => $now,
    ];

    $users = loadUsers();
    $users[] = $user;
    saveUsers($users);

    return $user;
}

function updateUser(string $userId, array $updates): ?array
{
    $users = loadUsers();

    foreach ($users as &$user) {
        if ($user['id'] === $userId) {
            foreach ($updates as $key => $value) {
                if ($key !== 'id' && $key !== 'email') {
                    $user[$key] = $value;
                }
            }
            $user['updatedAt'] = date('c');
            saveUsers($users);
            return $user;
        }
    }

    return null;
}

// ─── CORS & Response ─────────────────────────────────────────

function corsHeaders(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json; charset=utf-8");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

function jsonResponse(array $data, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

function getRequestData(): array
{
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

    if (strpos($contentType, 'application/json') !== false) {
        return json_decode(file_get_contents('php://input'), true) ?? [];
    }

    return $_POST;
}

function getBearerToken(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (preg_match('/Bearer\s+(.+)$/i', $header, $matches)) {
        return trim($matches[1]);
    }

    return null;
}
