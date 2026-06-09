# Pelek Home Hub

This project uses `Neon Postgres` as its database, `Cloudinary` for image storage/optimization, and a small serverless API layer in [`api/`](C:\Users\Hiikey\Desktop\pelek-home-hub\api) for auth, CRUD, uploads, and function requests.

## Stack

- `Vite + React + TypeScript`
- `Vercel` for frontend and API routes
- `Neon Postgres` for the database
- `Cloudinary` for uploaded images
- A legacy backend frontend client wrapper in [`src/integrations/backend/client.ts`](C:\Users\Hiikey\Desktop\pelek-home-hub\src\integrations\backend\client.ts) that talks to your own API instead of external backend services

## Environment

Copy [`.env.example`](C:\Users\Hiikey\Desktop\pelek-home-hub\.env.example) into `.env` and set:

- `DATABASE_URL` to your Neon connection string
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER` optional, defaults to `pelek-home-hub`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `VITE_API_BASE_URL` to `""` for local development

## Database

- Schema source: [`neon/schema.sql`](C:\Users\Hiikey\Desktop\pelek-home-hub\neon\schema.sql)
- Runtime database connection: [`api/db.ts`](C:\Users\Hiikey\Desktop\pelek-home-hub\api\db.ts)
- Admin auth endpoint: [`api/auth.ts`](C:\Users\Hiikey\Desktop\pelek-home-hub\api\auth.ts)

If you are replacing an older data source, import the data into Neon, then update `DATABASE_URL` in your local and hosting environment variables.

## Commands

```bash
npm install
npm run dev
npm run build
npm test
```

## Notes

- The frontend still uses a backend client interface for compatibility, but the active runtime is Neon Postgres and Cloudinary.
- Rotate any previously committed database credentials before deploying.
