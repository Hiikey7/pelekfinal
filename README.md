# Pelek Home Hub

This project is a Laravel-based application using Blade templates and Livewire for frontend interactions; it still uses MySQL and Cloudinary for storage.

## Stack

- Backend: Laravel 12 (PHP 8.2)
- Database: MySQL
- Frontend templates: Blade
- Styling: Tailwind CSS (Vite)
- Responsive interactions: Livewire 3 (and optional AJAX endpoints in `api/`)
- Icons: Lucide (npm)
- PDF receipts: DomPDF (`barryvdh/laravel-dompdf`)
- PWA: `manifest.webmanifest` + `sw.js` in `public/`
- Dependency management: Composer (PHP) and npm/Vite (frontend)
- Version control: Git (GitHub)
- Hosting target: HostPinnacle cPanel (PHP 8.2, Apache)
- SSL: AutoSSL / HTTPS (use cPanel to enable)

## Environment

Copy [`.env.example`](.env.example) into `.env` and set database credentials and secrets. The repo includes both Laravel-style `DB_*` env keys and `MYSQL_*` entries used by the lightweight `api/` scripts. Ensure both are set on production.

## Database

- MySQL schema source: [`mysql/schema.sql`](mysql/schema.sql)
- Runtime database connection helper: [`api/bootstrap.php`](api/bootstrap.php)
- Admin auth endpoint: [`api/auth.php`](api/auth.php)
- Generic CRUD endpoint: [`api/db.php`](api/db.php)

For a fresh MySQL database, create the database, run [`mysql/schema.sql`](mysql/schema.sql), then set the `MYSQL_*` environment variables in your PHP hosting environment.

## Local Development

Run the frontend as usual:

```sh
npm install
npm run dev
```

Run the PHP API from the project root with PHP's built-in server, or serve it through Apache/Nginx:

```sh
php -S localhost:8000
```

When using Vite and the PHP server separately, set:

```sh
VITE_API_BASE_URL="http://localhost:8000"
VITE_API_EXTENSION=".php"
```

## Commands

```sh
npm run build
npm test
```

## Notes

- The frontend UI/components were left in place; only the backend/database target changed.
- Uploaded images still use Cloudinary.
- Rotate any previously committed database credentials before deploying.
