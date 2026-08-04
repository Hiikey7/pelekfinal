Deployment to HostPinnacle (cPanel)
=================================

Prerequisites
- PHP 8.2 with `pdo_mysql` and OpenSSL enabled
- Composer and Node (or build assets locally)
- MySQL database credentials

Steps
1. Upload the project files to your account. Set the document root to the project's `public/` folder.
2. Install PHP dependencies via Composer (on the server or locally and upload `vendor/`):

   ```sh
   composer install --no-dev --optimize-autoloader
   php artisan key:generate
   php artisan migrate --force
   ```

3. Build frontend assets (on server or locally) with Vite:

   ```sh
   npm install
   npm run build
   ```

   Ensure the generated assets are available under `public/` and that `@vite()` is configured in Blade templates.

4. Configure environment variables in cPanel (or edit `.env`): set `DB_*` values for MySQL and mirror them into `MYSQL_*` if the lightweight `api/` scripts are used.

5. Ensure `public/.htaccess` is present (this repo includes one) and that the domain uses HTTPS (AutoSSL). `public/.htaccess` also includes an HSTS header.

6. Enable a writable `storage/` and `bootstrap/cache/` via `chmod` or cPanel file manager.

7. Verify PHP version is set to 8.2 in cPanel's PHP Selector.

Notes
- The app uses Blade templates, Tailwind CSS, Livewire 3 for reactive interactions, Lucide icons, and DomPDF for PDF receipts. Building assets with `npm run build` will produce production-ready CSS/JS.
- If you prefer building assets locally, upload the `public/build` (or Vite's output) and `vendor/` directory.
