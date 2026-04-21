# Admin Panel + Client Dashboard — Setup Checklist

## 1. Run the database schema

Connect to your Neon database and run `db/schema.sql`:

```bash
psql $DATABASE_URL -f db/schema.sql
```

## 2. Configure Neon Auth

1. Go to **Neon Console → your project → Branch → Auth**
2. Enable Auth on the branch
3. Under **Configuration**, copy the **Base URL** (looks like `https://your-project.auth.neon.tech`)
4. Generate a cookie secret: `openssl rand -base64 32`
5. Add to `.env.local`:
   ```
   NEON_AUTH_BASE_URL=https://your-project.auth.neon.tech
   NEON_AUTH_COOKIE_SECRET=<generated-secret>
   OWNER_EMAIL=your@email.com
   ```

## 3. Configure Vercel Blob (PDF storage)

1. In your **Vercel project dashboard**, go to **Storage → Create Database → Blob**
2. Copy the `BLOB_READ_WRITE_TOKEN` from the store settings
3. Add to `.env.local`:
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
   ```

## 4. First sign-in (owner)

1. Visit `/auth/sign-in`
2. Enter the email you set as `OWNER_EMAIL`
3. Enter the OTP sent to your email
4. You'll be redirected — on first login your owner profile row is provisioned automatically
5. Navigate to `/admin` — you should now have access

## 5. Invite a client

1. Go to `/admin/clients`
2. Fill in name, email, and shop domain — click **Add & invite**
3. Tell the client to go to `/auth/sign-in` and enter their email
4. On first sign-in they'll be linked to their client record automatically (the `client_invites` table maps their email to the correct client)
5. They'll be redirected to `/dashboard`

## 6. Configure Resend (email)

1. Create an account at **resend.com** and add your domain (e.g. `duhamedia.com`)
2. Verify the domain — add the DNS records Resend gives you
3. Create an API key under **API Keys**
4. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_...
   RESEND_FROM=Duha Media <hello@duhamedia.com>
   NEXT_PUBLIC_SITE_URL=https://duhamedia.com
   ```
5. While testing, use your own email as `RESEND_FROM` and send to your inbox first

**What gets sent automatically:**

| Event | Recipient | Email |
|---|---|---|
| Contact form submitted | Owner | Full enquiry details |
| Audit request submitted | Owner | Store URL, name, contact |
| Audit request submitted | User | Confirmation / next steps |
| Founding client application | Owner | Full application |
| PDF brief download | Owner | Lead notification |
| Client invited | Client | Portal access link |

## 7. Upload PDF reports

PDF reports are stored in Vercel Blob. The admin uploads via `/admin/clients/[id]`. Clients click **Download PDF** in `/dashboard/reports` — the server action verifies ownership before returning the blob URL.

## Routes summary

| URL | Who | Purpose |
|---|---|---|
| `/auth/sign-in` | Everyone | Email OTP sign-in |
| `/admin` | Owner only | Stats overview |
| `/admin/blog` | Owner only | Manage blog posts |
| `/admin/inbox` | Owner only | Contact submissions |
| `/admin/clients` | Owner only | Invite + manage clients |
| `/admin/clients/[id]` | Owner only | Client detail, experiments, metrics, reports |
| `/dashboard` | Clients only | CVR chart + KPIs |
| `/dashboard/experiments` | Clients only | Experiment history |
| `/dashboard/reports` | Clients only | Download PDF reports |
| `/insights/blog` | Public | Blog listing (live posts from DB) |
| `/insights/blog/[slug]` | Public | Individual blog post |
