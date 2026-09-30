<?php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../Services/Http.php';

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

    // 'c' = สร้างไฟล์ถ้ายังไม่มี แต่ไม่ truncate ก่อนได้ lock (กันข้อมูลหายเมื่อ request ชนกัน)
    $fp = fopen($filePath, 'c');
    if ($fp === false) {
        return false;
    }

    flock($fp, LOCK_EX);
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    return true;
}

// ─── Password Hashing ─────────────────────────────────────────

function hashPassword(string $password): string
{
    return password_hash($password, PASSWORD_DEFAULT);
}

function verifyPassword(string $password, string $hash): bool
{
    return password_verify($password, $hash);
}

// ─── Token Management ─────────────────────────────────────────

function generateToken(string $userId): string
{
    // ใช้ค่าสุ่มที่ทายไม่ได้ (40 hex chars) แทน userId+timestamp ที่เดาได้
    $token = 'bl_' . bin2hex(random_bytes(20));
    $tokens = loadJson(TOKENS_FILE);

    // clean token หมดอายุตอนนี้เลย (ไม่ต้องทำทุก request แบบ validateToken เดิม)
    $tokens = array_values(array_filter($tokens, fn($t) => strtotime($t['expiresAt'] ?? '') >= time()));

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
    $now = time();

    foreach ($tokens as $entry) {
        if ($entry['token'] === $token) {
            // หมดอายุ = คืน null, ไม่ลบออก (ปล่อยให้ generateToken clean ตอนสร้าง token ใหม่)
            return strtotime($entry['expiresAt']) >= $now ? $entry['userId'] : null;
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
        'password' => hashPassword($password),
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

function deleteUser(string $userId): bool
{
    $users = loadUsers();
    $filtered = array_values(array_filter($users, fn($u) => $u['id'] !== $userId));

    if (count($filtered) === count($users)) {
        return false;
    }

    saveUsers($filtered);

    // ลบ tokens ทั้งหมดของ user
    $tokens = loadJson(TOKENS_FILE);
    $tokens = array_values(array_filter($tokens, fn($t) => $t['userId'] !== $userId));
    saveJson(TOKENS_FILE, $tokens);

    return true;
}
