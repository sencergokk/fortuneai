# FortuneAI - AI-Powered Fortune Telling App

FortuneAI is an AI-powered fortune telling application that offers daily horoscope readings, tarot cards, coffee cup readings, and dream interpretations.

## Features

- **Daily Horoscope**: Personalized daily readings for all zodiac signs
- **Tarot Cards**: AI-interpreted readings in different tarot spreads
- **Turkish Coffee Cup Reading**: Describe shapes in your cup and get personalized interpretation
- **Dream Interpretation**: Share your dreams and receive meaningful psychological and symbolic analyses
- **Membership System**: User accounts and monthly renewable credit system

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase
- **AI Integration**: OpenAI GPT-4
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account with a project
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fortuneai.git
   cd fortuneai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables file and fill in your API keys:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase and OpenAI API keys:
   ```
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

   # OpenAI Configuration
   OPENAI_API_KEY=your-openai-api-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to see the application

## Supabase Setup

You need to create the following tables in your Supabase project:

### 1. user_credits Table
```sql
create table public.user_credits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  credits integer not null default 15,
  last_refresh timestamp with time zone default now() not null,
  created_at timestamp with time zone default now() not null
);

-- Security policy
alter table public.user_credits enable row level security;
create policy "Users can only view their own records"
  on public.user_credits for select
  to authenticated
  using (auth.uid() = user_id);
```

### 2. credit_usage Table
```sql
create table public.credit_usage (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  usage_type text not null,
  usage_date timestamp with time zone default now() not null
);

-- Security policy
alter table public.credit_usage enable row level security;
create policy "Users can only view their own usage history"
  on public.credit_usage for select
  to authenticated
  using (auth.uid() = user_id);
```

## Project Structure

- `src/app`: Next.js App Router pages and API routes
- `src/components`: UI components, including shadcn/ui components
- `src/lib`: Utility functions and API clients
- `src/types`: TypeScript type definitions
- `src/context`: React context providers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.io/)
- [OpenAI](https://openai.com/)
