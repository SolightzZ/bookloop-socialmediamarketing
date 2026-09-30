# AGENTS.md — src_backend

## Commands

- `composer install` / `composer dump-autoload` — PSR-4 `Services\` → `Services/` (`composer.json:10`). Binary is `composer` phar in this dir, not global.
- `php -S localhost:8000 -t src_backend` — run backend so frontend `VITE_API_BASE_URL=http://localhost:8000/api` works. No npm scripts here.
- No lint/test runner. Email preview only: open `email/orderConfirmEmail.test.php` in browser.

## Stack

PHP >=8.0 + PHPMailer 6.8 (`vendor/` gitignored). File-backed storage, no DB.

## Structure

- `config/config.php` — **must be required first**; loads `.env` (cached in `sys_get_temp_dir()/bookloop_env_<hash>.php`, invalidated by mtime), defines constants + `BASE_PATH/DATA_PATH/EMAIL_PATH`, and auto-requires `Services/RequestLogger.php`.
- `Services/Http.php` — `corsHeaders()`, `jsonResponse()`, `getRequestData()`, `getBearerToken()`. All have `function_exists` guards; safe to include after `auth/auth.php` which already pulls `config.php` + `Http.php`.
- `auth/auth.php` — `loadJson`/`saveJson` (flock), `hashPassword`/`verifyPassword` (`password_hash`), `generateToken`/`validateToken`/`removeToken`, `createUser`/`findUserBy*`/`updateUser`/`deleteUser`. Tokens `bl_<40 hex>` in `data/tokens.json`, 7-day expiry (`TOKEN_EXPIRY_DAYS:8`).
- `Services/RateLimiter.php` — `rateLimitCheck(key, max, window)` + `clientRateLimitKey(scope)` (IP-scoped). **Requires `auth/auth.php` first** (uses `loadJson`/`saveJson`). State in `data/ratelimit.json` (gitignored, prunes >max(window,3600)).
- `Services/Logger.php` / `Services/RequestLogger.php` — two separate logs. `Services/Subscribers.php` / `Services/emailService.php` — newsletter + SMTP.
- `api/` — 13 endpoints: `auth_login|register|me|update_profile|delete_account|logout`, `subscribe|subscribe_newsletter|newsletter_status`, `track`, `log|logs|request_log`. See `api/*.php:1` for method + auth requirements.
- `email/` — **frozen for submission, do not edit**. Templates use `cid:welcome_image` (test files use `../images/` path instead).

## Config (.env)

Copy `.env.example` → `.env`. Never commit `.env` (gitignored).

```
SMTP_HOST / PORT / USERNAME / PASSWORD / ENCRYPTION
MAIL_TIMEOUT=15          # must be < PHP max_execution_time or timeout becomes uncatchable fatal — see config.php:33
MAIL_FROM_ADDRESS / NAME
ALLOWED_ORIGIN=          # comma-separated allow-list, supports `*`; corsHeaders() in Http.php:18 logs WARNING if origin not allowed
SUBSCRIBERS_FILE / ACTIVITIES_FILE / LOG_FILE / REQUEST_LOG_FILE
```

## HTTP helpers

- Always call `corsHeaders()` before any output. It sends `Access-Control-Allow-Origin` only if origin in allow-list (or `*`), adds `Vary: Origin`, and exits on `OPTIONS`.
- `jsonResponse()` clears stray output buffers (`ob_end_clean`) before `json_encode(JSON_UNESCAPED_UNICODE)` + `exit()` — prevents `Unexpected token '<'` from PHP warnings leaking as HTML.
- `getRequestData()` handles both `application/json` and `form-data`.

## Auth & Storage

- Users/tokens are JSON arrays in `data/users.json` / `data/tokens.json` with `flock` via `loadJson`/`saveJson` (`auth.php:12`). Use those helpers, not raw `file_put_contents`.
- `generateToken` prunes expired tokens on each new token; `validateToken` does *not* prune.
- `auth_login.php:12` rate-limits `login:20/600s` per IP; `auth_register.php:13` limits `register:10/3600s`. Return `429` with Thai message.
- `auth_login.php:32` upgrades legacy plaintext passwords to `password_hash` on successful plain compare.

## Logging

- `Logger` (app log) → `data/<LOG_FILE>` (`error.log`). Singleton `Logger::getInstance()->log(level,msg,ctx)`; `isValidLevel`/`validLevels` reused by `api/logs.php` and `api/request_log.php`. Format: `[Y-m-d H:i:s] [LEVEL] msg {ctx}`.
- `RequestLogger` (access log) → `data/<REQUEST_LOG_FILE>` (`request.log`). **Auto-bootstrapped** by `config.php:64`; no manual `require` needed. Buffers in `RequestLogger::$buffer` and flushes once via `register_shutdown_function` (`RequestLogger.php:19`) — reduces `LOCK_EX` to 1/request. Also registers fatal-error + exception handlers that write JSON `500` response.
- `GET /api/logs.php` / `GET /api/request_log.php` require `Bearer` token (`validateToken`) — `401` without it, because logs contain IP/UA/PII. `DELETE` clears logs. Query: `?level=ERROR&limit=100&search=kw` (cap `500`).

## Email

- `Services/emailService.php` — `sendWelcomeEmailService`, `sendConfirmationEmailService`, `sendOrderConfirmationService`. All set `Timeout = MAIL_TIMEOUT`, `CharSet=UTF-8`, `isHTML(true)`.
- `auth_register.php:52,66` and `subscribe*` send **non-blocking** via `register_shutdown_function` so SMTP does not delay HTTP response. Don't make them blocking.
- `email/orderConfirmEmail.php` expects vars `$name,$orderId,$items,$total,$shippingAddress,$paymentMethod,$shippingMethod` and `echo`s HTML; `emailService` wraps it with `ob_start`/`include`.

## Subscribers / Track

- Newsletter file is `EMAIL_PATH/SUBSCRIBERS_FILE` (`email/subscribers.txt`), not `data/`. Use `isEmailSubscribed`/`appendSubscriber`/`removeEmail` from `Services/Subscribers.php` (case-insensitive on column before `|`).
- `api/track.php` appends JSON lines to `data/<ACTIVITIES_FILE>` and, for `purchase`/`add_to_cart` events, sends email via `email/orderEmails.php` — catch `Throwable` so tracking never fails on mail error.

## Conventions

- Thai messages, English identifiers. `function_exists` guards on all shared helpers to allow double-include via `auth.php`.
- Email HTML: `/* ... */` comments only, table layout, `cid:welcome_image` for `images/welcome.png` / `newsletterConfirmation.png`.

## Gotchas

- `.env` missing → `config.php:21` throws `Exception`. `vendor/` missing → `emailService.php:6` fails — run `composer install`.
- `data/` JSON files and `ratelimit.json` are gitignored — they won't exist on fresh clone; helpers handle missing files gracefully (`loadJson` returns `[]`).
- Don't edit `email/` (frozen). Don't add manual `require Services/RequestLogger.php` — `config.php` already does it and double-registering shutdown handlers is wasteful.
