# Nuqta نقطہ

Student-led publication on politics, culture, current affairs and the world around us.

- **Current Affairs**: daily news with a calendar and region filter
- **Articles**: opinion pieces, each led by its *nuqta*, submitted by members and approved by editors
- **The Floor**: discussion forum (article threads, a weekly question, an open wall)
- **Newsroom**: editors-only page for approvals, posting, weekly questions and moderation

The site is plain HTML/CSS/JS, hosted free on **GitHub Pages**. Data and accounts live in **Supabase** (free tier).

---

## Setup (about 15 minutes)

### 1. Create the database
1. Go to <https://supabase.com>, sign in (GitHub sign-in works) and click **New project**.
   - Name: `nuqta`. Pick a strong database password and save it in a password manager. You won't need it for the site.
   - Region: the one closest to your readers (for Pakistan, *Mumbai* or *Singapore*).
2. When the project is ready, open **SQL Editor → New query**, paste the whole of [`schema.sql`](schema.sql) and click **Run**. You should see "Success. No rows returned".
3. *(Optional)* Run [`seed.sql`](seed.sql) the same way to add sample stories, articles and weekly questions. They show a "Sample" tag, and you can remove them all later from **Newsroom → Manage**.

### 2. Connect the site to it
1. In Supabase, open **Project Settings → API** (or the **Connect** button).
2. Copy the **Project URL** and the **anon / publishable** key into [`config.js`](config.js).
   - These two values are meant to be public. The security rules in `schema.sql` decide what anyone can do with them.
   - **Never** copy the `service_role` / secret key into this repository or send it to anyone.

### 3. Put it on GitHub Pages
1. Create a new repository on GitHub, for example `nuqta`. It can be public.
2. Upload every file in this folder (keep the `supabase` folder and the empty `.nojekyll` file).
3. In the repository, go to **Settings → Pages → Build and deployment**. Set Source to *Deploy from a branch*, Branch to `main` and folder `/ (root)`, then **Save**.
4. After a minute your site is live at `https://YOUR-USERNAME.github.io/nuqta/`.

### 4. Tell Supabase where the site lives
In Supabase, open **Authentication → URL Configuration**:
- **Site URL**: `https://YOUR-USERNAME.github.io/nuqta/`
- **Redirect URLs**: add the same address.

This makes the "confirm your email" and "reset password" links go back to your site.

### 5. Make yourself the owner and add your editors
1. On your live site, click **Sign in → Create an account**, confirm the email, and sign in.
2. In Supabase **SQL Editor**, run (with your own email):
   ```sql
   update public.profiles set role = 'owner'
   where id = (select id from auth.users where email = 'you@example.com');
   ```
3. Reload the site. You'll see **Newsroom** in the menu. Ask your two other admins to create accounts, then make them editors from **Newsroom → Team**.

---

## Who can do what

| | Read | Post, reply, dot, report, vote | Submit articles | Newsroom (approve, post news, moderate) | Make editors, suspend accounts |
|---|---|---|---|---|---|
| Visitor | ✓ | | | | |
| Member (anyone who signs up) | ✓ | ✓ | ✓ (reviewed) | | |
| Editor | ✓ | ✓ | ✓ | ✓ | |
| Owner | ✓ | ✓ | ✓ | ✓ | ✓ |

These rules are enforced by the database, not just the page.

## Moderation
- Posts, replies and article submissions with blocked words are refused by the database. The starter list covers common English and Roman Urdu abuse, including tricks like `sh1t`. Editors manage the list in **Newsroom → Moderation**.
- More than 2 links in one post is refused. Members are limited to 20 posts an hour and 5 articles waiting in review.
- A post reported by 3 different members is hidden automatically until an editor removes it or keeps it.
- "Post anonymously" hides the author's name from readers. Editors can still see who posted it in the moderation queue.

## Email limits
Supabase's built-in email sender is only meant for testing and sends just a few emails an hour. Before you invite lots of people, connect a free email service under **Authentication → Emails → SMTP Settings** (for example Resend or Brevo). Otherwise confirmation emails will stop arriving.

## Files
- `index.html`: page shell
- `styles.css`, `extra.css`: design
- `app.js`: all pages and logic
- `config.js`: your Supabase URL and public key
- `schema.sql`: tables, security rules, moderation
- `seed.sql`: optional sample content
