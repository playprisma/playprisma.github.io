# Prisma website

A static site with no build step. Supabase handles accounts directly from the browser.

```
index.html      Home (hero, features, screenshots, download)
signup.html     Create account
login.html      Log in
forgot.html     Send password-reset email
reset.html      Set new password (opened from the reset email)
account.html    Email, sync status, change password, export data, log out, delete account
download.html   Latest GitHub release + Prisma-Setup.exe
privacy.html    GDPR privacy policy
terms.html      Terms of use
config.js       ← the only file you need to edit
supabase/setup.sql
```

## 1. Fill in `config.js`
- `SUPABASE_ANON_KEY`: the **anon / public** key (Supabase → Project Settings → API). Never use `service_role`.
- `GITHUB_REPO`: e.g. `yourname/Prisma`. The release asset must be named exactly `Prisma-Setup.exe`.
- `OWNER_NAME`, `CONTACT_EMAIL`: shown in the privacy policy and terms (GDPR requires a named controller and contact).
- In `privacy.html`, replace `[e.g. Netlify / Vercel …]` with your host.

Screenshots: drop `1.png`, `2.png`, `3.png` (16:10) into `assets/screenshots/`.

## 2. Run the SQL
Supabase → SQL Editor → paste `supabase/setup.sql` → Run. It adds `delete_user()`, which the "Delete account" button needs, and confirms RLS policies.

## 3. Deploy
Any static host works. Easiest: **Cloudflare Pages** or **Netlify**: drag the folder in, then connect your domain.
To test locally: `python -m http.server 8000` in this folder → http://localhost:8000

## 4. Supabase Auth settings (Authentication → URL Configuration)
- **Site URL**: `https://yourdomain.com`
- **Redirect URLs** (add all):
  - `https://yourdomain.com/**`
  - `http://localhost:8000/**` (for testing)
  - anything the desktop app uses for its own links, if any

## 5. Turn email confirmation back on + Resend
1. Resend → add & verify your domain (DNS records: SPF, DKIM) → create an API key.
2. Supabase → Authentication → **Emails → SMTP Settings** → enable custom SMTP:
   - Host `smtp.resend.com`, Port `465`, Username `resend`, Password = Resend API key
   - Sender email `no-reply@yourdomain.com`, Sender name `Prisma`
3. Authentication → **Providers → Email** (Sign In / Providers): turn **Confirm email** ON. Set minimum password length to 8.
4. Authentication → **Rate Limits**: raise "emails per hour" (e.g. 100) now that custom SMTP is on.
5. Optional: Authentication → **Email Templates**: brand the "Confirm signup" and "Reset password" emails (keep `{{ .ConfirmationURL }}`).

## 6. App side (Prisma desktop)
Once confirmation is on, sign-in from the app fails with *"Email not confirmed"* until the user clicks the link. Show a friendly message and a link to `https://yourdomain.com/login.html` (it has a "Resend confirmation" button).

## GDPR notes
- No analytics or tracking cookies, so no cookie banner is needed. Add analytics later and you'll need consent.
- Users can export their data and delete their account themselves (Account page).
- Check that your Supabase project's region is EU (Project Settings → General). If it isn't, the privacy policy's transfer wording already covers it, but EU hosting is cleaner.
- Sign Supabase's and Resend's DPAs (both available in their dashboards / legal pages).
- For full independence from jsDelivr, download `supabase.min.js` into `assets/` and change the `<script src>` in each page.
