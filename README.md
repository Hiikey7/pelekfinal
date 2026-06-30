# Pelek Home Hub

This project uses `Supabase Postgres` as its database, `Cloudinary` for image storage/optimization, and a small serverless API layer in [`api/`](api) for auth, CRUD, uploads, and function requests.

## Stack

- `Vite + React + TypeScript`
- `Vercel` for frontend and API routes
- `Supabase Postgres` for the database
- `Cloudinary` for uploaded images
- A backend frontend client wrapper in [`src/integrations/backend/client.ts`](src/integrations/backend/client.ts) that talks to your own API instead of external backend services

## Environment

Copy [`.env.example`](.env.example) into `.env` and set:

- `SUPABASE_DATABASE_URL` to your new Supabase Postgres connection string. The app also accepts `DATABASE_URL` as a fallback.
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `PROPERTY_BLOG_ADMIN_EMAIL` optional limited dashboard user for properties/blogs
- `PROPERTY_BLOG_ADMIN_PASSWORD` optional limited dashboard user password
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER` optional, defaults to `pelek-home-hub`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `VITE_API_BASE_URL` to `""` for local development

## Database

- Schema source: [`supabase/schema.sql`](supabase/schema.sql)
- Runtime database connection: [`api/db.ts`](api/db.ts)
- Admin auth endpoint: [`api/auth.ts`](api/auth.ts)

For a fresh Supabase database, run [`supabase/schema.sql`](supabase/schema.sql) in Supabase SQL Editor, then update `SUPABASE_DATABASE_URL` in your local and hosting environment variables.

## Commands

```bash
npm install
npm run dev
npm run build
npm test
```

## Notes

- The frontend still uses a backend client interface for compatibility, but the active runtime is Supabase Postgres and Cloudinary.
- Rotate any previously committed database credentials before deploying.
