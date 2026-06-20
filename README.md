# LP's Style Book

Personal wardrobe intelligence platform. Track owned clothing, improve purchase decisions, and learn style preferences.

## Tech Stack

Next.js 14 · TypeScript · Tailwind CSS · Supabase · Vercel

## Running Locally

1. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials.
2. Run `npm install`
3. Run `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Seeding the Database

After setting up the schema in Supabase:
```bash
npx tsx supabase/seed.ts
```
