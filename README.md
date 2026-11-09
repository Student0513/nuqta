# Nuqta نقطہ

Student-led publication on politics, culture, current affairs and the world around us.
Live at **https://nuqta.today** (domain from Namecheap, pointed at GitHub Pages; the `CNAME` file keeps the custom domain)

- **Current Affairs**: daily news with a calendar and region filter
- **Articles**: opinion pieces, each led by its *nuqta*, submitted by members and approved by editors
- **The Floor**: discussion forum (article threads, a weekly question, an open wall)
- **Your dashboard**: each member's posts, likes, tags and article drafts
- **Newsroom**: editors' page for approvals, posting and weekly questions; moderation and the team are owner-only
- **About**: what Nuqta is, a user guide, and a support contact

The site is plain HTML/CSS/JS, hosted free on **GitHub Pages**. Data and accounts live in **Supabase** (free tier).

---

## Rebuilding from scratch

### 1. Create the database
1. Go to <https://supabase.com>, sign in and click **New project**. For Pakistan, choose the *Mumbai* or *Singapore* region.
2. Open **SQL Editor → New query** and run these files in order, pasting each one and clicking **Run**:
   1. [`schema.sql`](schema.sql): tables, security rules and moderation
   2. [`migration-002.sql`](migration-002.sql): drafts, post editing, owner-only moderation
   3. [`migration-003.sql`](migration-003.sql): faster language filter
   4. [`migration-004.sql`](migration-004.sql): pinned top story; editors can edit and remove weekly questions
   5. `migration-005.sql`: the protected owners. It lists the owners' email addresses, so it's kept on the founders' computer and is not uploaded to this public repository.

   Each should say "Success. No rows returned".

### 2. Connect the site to it
1. In Supabase, open **Project Settings → API Keys → Legacy**.
2. Copy the **Project URL** and the **anon / public** key into [`config.js`](config.js).
   - These two values are meant to be public. The database's security rules decide what anyone can do with them.
   - **Never** put the `service_role` / secret key in this repository or send it to anyone.

### 3. Put it on GitHub Pages
1. Upload every file in this folder (including the empty `.nojekyll` file) to a GitHub repository.
2. Go to **Settings → Pages**. Set Source to *Deploy from a branch*, Branch to `main` and folder `/ (root)`, then **Save**.

### 4. Tell Supabase where the site lives
In Supabase, open **Authentication → URL Configuration** and set both the **Site URL** and a **Redirect URL** to the site's address, so confirmation and password-reset emails link back to it.

### 5. Make yourself the owner
Create an account on the live site, confirm the email, then run in the SQL Editor (with your own email):
```sql
update public.profiles set role = 'owner'
where id = (select id from auth.users where email = 'you@example.com');
```
Reload the site and use **Newsroom → Team** to make up to three people editors.

---

## Who can do what

| | Read | Post, reply, dot, report, vote | Submit articles | Approve, post news, weekly questions | Moderation, edit/delete content, team |
|---|---|---|---|---|---|
| Visitor | ✓ | | | | |
| Member (anyone who signs up) | ✓ | ✓ | ✓ (reviewed) | | |
| Editor | ✓ | ✓ | ✓ | ✓ | |
| Owner | ✓ | ✓ | ✓ | ✓ | ✓ |

These rules are enforced by the database, not just the page.

## Moderation
- Posts, replies and article submissions with blocked words are refused by the database. The starter list covers common English and Roman Urdu abuse, including tricks like `sh1t`. The owner manages the list in **Newsroom → Moderation**.
- More than 2 links in one post is refused. Members are limited to 20 posts an hour and 5 articles waiting in review.
- A post reported by 3 different members is hidden automatically until the owner removes it or keeps it.
- "Post anonymously" hides the author's name from readers. The owner can still see who posted it in the moderation queue.

## Email
Supabase's built-in email sender only allows a few emails an hour. For launch, connect a sender under **Authentication → Emails → SMTP Settings** (a Gmail account with an app password works: host `smtp.gmail.com`, port `465`), then raise the email rate limit under **Authentication → Rate Limits**.

## Files
- `index.html`: page shell
- `styles.css`, `extra.css`: design
- `app.js`: all pages and logic
- `config.js`: your Supabase URL and public key
- `schema.sql`, `migration-002.sql`, `migration-003.sql`, `migration-004.sql`: database setup, run in that order
