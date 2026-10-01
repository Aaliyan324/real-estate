# Deploying to Hostinger (MySQL / MariaDB)

Target architecture:

```
Next.js → Prisma → MySQL / MariaDB → Hostinger
```

MySQL/MariaDB is this project's **default** schema (`prisma/schema.prisma`).
Read [DATABASE.md](DATABASE.md) for the provider rules.

---

## Step 1 — Create the MySQL database & user (hPanel)

1. Hostinger **hPanel → Websites → Databases → MySQL databases**.
2. **Create a new database**, e.g. `u123456_pakhaven`.
3. Create a **database user** with a strong password and grant it privileges on
   that database.
4. Note the **database host**. On Hostinger shared/VPS hosting this is usually
   `localhost` **from the app server itself**, but on some plans it is a specific
   MySQL host. **Confirm the exact host in hPanel — do not assume `localhost` in
   production.**

---

## Step 2 — Build the connection string

```env
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@DB_HOST:3306/DB_NAME"
```

- Use the real values from hPanel. Only use `localhost` when Hostinger confirms
  the app and MySQL share the same host.
- If the password contains special characters (`@ : / ? # &` …), **URL-encode**
  them (e.g. `@` → `%40`).

Other required variables:

```env
AUTH_SECRET="<strong secret, 32+ chars>"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="<key or empty>"
# BLOB_READ_WRITE_TOKEN is intentionally unset — Hostinger uses local disk storage
```

---

## Step 3 — Local development (optional)

For a local MySQL/MariaDB only:

```env
DATABASE_URL="mysql://root:password@localhost:3306/real_estate_db"
```

This is a **local-dev example only**. Production Hostinger uses the hPanel host,
username, and database name.

Generate the client and push the schema (no data loss — `db push` is additive):

```bash
npm install
npm run prisma:generate   # mysql client (default schema)
npm run db:push           # creates/updates tables, preserves existing rows
```

> ⚠️ Never run `prisma migrate reset` or reseed a populated production DB.

---

## Step 4 — Build the app

```bash
npm run build
npm run start            # serves on PORT (default 3000)
```

---

## Step 5 — Deploy

**VPS / Node hosting (recommended for Next.js):**

1. Upload the project (via Git or FTP) to the server.
2. `npm ci` (runs `postinstall` → `prisma generate`).
3. Set the environment variables (`.env` on the server, or the panel's env UI).
4. `npm run build`.
5. Run under a process manager (`pm2 start "npm run start" --name pakhaven`) and
   point the Hostinger web server / reverse proxy (Apache/Nginx) at the Node
   port.

**Shared hosting (PHP-style):** does **not** run a persistent Node server
reliably. Use a Hostinger **VPS** or **Node.js** plan for Next.js.

---

## Step 6 — Domain & SSL

- In hPanel, point your domain to the deployment and enable **SSL**.
- Set `NEXT_PUBLIC_SITE_URL` to the exact public origin (e.g.
  `https://pakhaven.pk`) so `sitemap.xml` / `robots.txt` and share links are
  correct.

---

## Step 7 — Image uploads

On Hostinger the filesystem is **persistent**, so `lib/storage` uses the **local
driver** automatically (leave `BLOB_READ_WRITE_TOKEN` unset). Uploaded property
images are written to `public/uploads/properties` and served statically. Ensure
that directory is writable by the web server user.

---

## Step 8 — Verify

Test `/`, `/properties`, `/properties/[slug]`, `/agents`, `/admin`, login,
search (case-insensitive), the property gallery, inquiries, and visit
scheduling.

---

## Troubleshooting

- **`P1012 … URL must start with mysql://`** — you generated/used the wrong
  schema for the URL. With a `mysql://` URL use `npm run prisma:generate`.
- **`Can't reach database server`** — wrong host/port or firewall; confirm the
  hPanel host and that the DB user is allowed to connect from the app host.
- **`Authentication failed`** — re-check username/password and URL-encode
  special characters.
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more.
