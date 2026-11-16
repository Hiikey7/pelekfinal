Deployment to HostPinnacle (cPanel)
=================================

Prerequisites
- PHP 8.2 or newer with `pdo_mysql`, OpenSSL, `mbstring`, `fileinfo`, and `xml` enabled
- Composer and Node (or build assets locally)
- MySQL database credentials

Steps
1. Back up the live MySQL database from cPanel's **phpMyAdmin → Export** before deploying. Keep the backup outside the web root.
2. Upload the updated project files without replacing `.env`, `storage/`, or user-uploaded files. Set the document root to the project's `public/` folder.
3. Install PHP dependencies via Composer (on the server or locally and upload `vendor/`):

   ```sh
   composer install --no-dev --optimize-autoloader
   php artisan migrate --force
   ```

4. Build frontend assets (on server or locally) with Vite:

   ```sh
   npm install
   npm run build
   ```

   Ensure the generated assets are available under `public/` and that `@vite()` is configured in Blade templates.

5. Configure environment variables in cPanel (or edit `.env`): keep the existing production `APP_KEY`, set `DB_*` values for the live MySQL database, configure the SMTP password, and set `MAIL_*`. The booking notification recipient can be set later from Admin → Settings.

6. Ensure `public/.htaccess` is present (this repo includes one) and that the domain uses HTTPS (AutoSSL). `public/.htaccess` also includes an HSTS header.

7. Enable a writable `storage/` and `bootstrap/cache/` via `chmod` or cPanel file manager.

8. In cPanel's **MultiPHP Manager**, select the newest patched PHP version available for the domain. This project and its installed dependencies have been checked on PHP 8.5.12. If HostPinnacle does not offer PHP 8.5 for your account, use the newest patched PHP 8.4 or 8.3 version available. PHP 8.2 remains the minimum supported version, but its upstream security support ends on December 31, 2026.
9. Run `php artisan migrate --force` against the existing live database. Laravel applies only pending migrations; the booking migration adds columns and does not delete or recreate existing booking/property data. Do not run `migrate:fresh` or import the starter schema over the live database.

Notes
- The app uses Blade templates, Tailwind CSS, Livewire 3 for reactive interactions, Lucide icons, and DomPDF for PDF receipts. Building assets with `npm run build` will produce production-ready CSS/JS.
- If you prefer building assets locally, upload the `public/build` (or Vite's output) and `vendor/` directory.
