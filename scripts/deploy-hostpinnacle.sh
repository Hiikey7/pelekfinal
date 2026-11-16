#!/bin/bash
# Deploys the Laravel app to HostPinnacle (cPanel) without touching .env,
# uploaded files (storage/app), logs, sessions, .htaccess, or existing data.
set -e
DOCROOT="${DOCROOT:-$HOME/pelekproperties.co.ke}"
SRC="$HOME/pelek-new"
BRANCH="${BRANCH:-supabase-database}"
REPO=https://github.com/Hiikey7/pelekfinal.git

command -v rsync >/dev/null || { echo "rsync missing - stop and tell Claude"; exit 1; }

# 1. Fresh copy of the code
rm -rf "$SRC"
git clone --depth 1 -b "$BRANCH" "$REPO" "$SRC"

# 2. Work out where Laravel lives
if [ -f "$DOCROOT/artisan" ]; then
  LROOT="$DOCROOT"; LAYOUT=A
else
  REL=$(grep -o "__DIR__\s*\.\s*'[^']*bootstrap/app.php'" "$DOCROOT/index.php" | sed -E "s/.*'(.*)bootstrap\/app.php'/\1/")
  [ -n "$REL" ] || { echo "Could not find Laravel root from index.php - stop and tell Claude"; exit 1; }
  LROOT=$(cd "$DOCROOT$REL" && pwd); LAYOUT=B
fi
[ -f "$LROOT/artisan" ] || { echo "No artisan in $LROOT - stop and tell Claude"; exit 1; }
[ -f "$LROOT/.env" ]    || { echo "No .env in $LROOT - stop and tell Claude"; exit 1; }
echo "Layout $LAYOUT  |  Laravel root: $LROOT  |  Web root: $DOCROOT"

# 3. Pick a PHP CLI >= 8.2
PHP=""
for p in php /opt/cpanel/ea-php85/root/usr/bin/php /opt/cpanel/ea-php84/root/usr/bin/php /opt/cpanel/ea-php83/root/usr/bin/php /opt/cpanel/ea-php82/root/usr/bin/php; do
  if command -v "$p" >/dev/null 2>&1 && "$p" -r 'exit(version_compare(PHP_VERSION,"8.2","<")?1:0);' 2>/dev/null; then PHP="$p"; break; fi
done
[ -n "$PHP" ] || { echo "No PHP 8.2+ CLI found - stop and tell Claude"; exit 1; }
echo "Using $($PHP -v | head -1)"

cd "$LROOT"
$PHP artisan down || true

# 4. Copy Laravel code only (never .env, uploads, logs, sessions)
for d in app bootstrap config database resources routes vendor; do
  rsync -a --exclude='cache/*.php' "$SRC/$d/" "$LROOT/$d/"
done
cp "$SRC/artisan" "$SRC/composer.json" "$SRC/composer.lock" "$LROOT/"
mkdir -p "$LROOT/storage/certs" && cp "$SRC/storage/certs/cacert.pem" "$LROOT/storage/certs/"
if [ -d "$LROOT/api" ]; then rsync -a "$SRC/api/" "$LROOT/api/"; fi

# 5. Public files (keep the server's own .htaccess; in layout B keep its custom index.php)
if [ "$LAYOUT" = A ]; then
  rsync -a --exclude='.htaccess' "$SRC/public/" "$LROOT/public/"
else
  rsync -a --exclude='.htaccess' --exclude='index.php' --exclude='storage' "$SRC/public/" "$DOCROOT/"
fi
rm -f "$LROOT/public/hot" "$DOCROOT/hot"

# 6. Database: adds missing columns only, then refresh caches
$PHP artisan migrate --force
$PHP artisan optimize:clear
$PHP artisan config:cache
$PHP artisan route:cache
$PHP artisan view:cache
$PHP artisan up
echo "DONE - deployed $(cd "$SRC" && git log --oneline -1)"
