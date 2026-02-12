# AnonBoard

Create anonymous message boards. Share the link. Get honest feedback.

## Features

- **Create boards** — sign up with email/password and create themed boards
- **Anonymous posting** — visitors post anonymously with randomly generated names (e.g., "Brave Penguin")
- **Voting** — upvote/downvote posts with optimistic UI updates
- **Moderation** — board owners and post authors can delete posts
- **No sign-up for visitors** — anonymous auth happens automatically in the background

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router, Server Components, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** [Supabase](https://supabase.com) (PostgreSQL + Row Level Security)
- **Auth:** Supabase Auth (email/password + anonymous sign-in)
- **Deployment:** Vercel

## Getting Started

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/leddie24/anonboard.git
cd anonboard
npm install
```

2. Create a [Supabase](https://supabase.com) project and add your credentials to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Set up the database — run the migration in the Supabase SQL Editor:

```bash
# Copy and paste the contents of this file into the SQL Editor and click "Run":
supabase/migrations/001_initial_schema.sql
```

This creates the `boards`, `posts`, and `votes` tables with Row Level Security policies.

4. Enable auth providers in your Supabase dashboard:
   - Go to **Authentication → Providers**
   - Enable **Email** (for board creators)
   - Enable **Anonymous Sign-In** (for visitors)

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.
