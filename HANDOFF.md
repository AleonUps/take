# EDUCIS — Complete Architecture & Handoff

## Overview

EDUCIS is an AI-powered education platform with 3 connected tools forming a seamless pipeline:

**0RACLE → RAWI → SPARK**

- **0RACLE**: Deep adaptive conversation (15+ exchanges) that discovers who you are — your dream career, learning style, country, language, strengths, and gaps. Generates a structured personal identity report and full curriculum path.
- **RAWI**: Builds your full localized curriculum. When accessed from 0RACLE, auto-generates structured course content with chapters, lessons, real local examples, YouTube videos, and free course links. Each lesson is culturally rooted in your country using real names, places, currency, and examples. Progress tracked in localStorage.
- **SPARK**: Point your camera at anything and learn across all subjects. When 0RACLE has run, SPARK knows your curriculum and career goal — lessons connect to your personal path.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start (full-stack React SSR) |
| Runtime/Deploy | Cloudflare Workers (via Lovable platform) |
| Routing | TanStack Router v1 (file-based) |
| Data/Fetching | TanStack Query v5 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + tw-animate-css |
| UI Components | shadcn/ui (new-york style) + custom |
| Icons | Lucide React |
| Validation | Zod (input + output on all server functions) |
| AI Model | Google Gemini Flash via Lovable AI Gateway |
| Video API | YouTube Data API v3 |
| Storage | Browser localStorage (no backend DB) |
| Fonts | Inter (sans) + Playfair Display (serif) |

## File Structure

```
src/
├── routes/
│   ├── __root.tsx          # Root layout (nav, footer, QueryClientProvider)
│   ├── index.tsx           # Landing page with pipeline flow diagram
│   ├── oracle.tsx          # 0RACLE: 3-stage (conversation → report → handoff)
│   ├── rawi.tsx            # RAWI: manual mode + oracle curriculum mode
│   ├── spark.tsx           # SPARK: image analysis + curriculum context
│   ├── library.tsx         # Saved lessons list
│   ├── library.$id.tsx     # Individual saved lesson
│   ├── explore.tsx         # Curated examples gallery
│   └── about.tsx           # About page
├── components/
│   ├── site-chrome.tsx     # SiteNav + SiteFooter
│   ├── count-up.tsx        # Animated number counter
│   ├── voice-input.tsx     # Web Speech API voice input
│   ├── spark-result-view.tsx
│   ├── rawi-result-view.tsx
│   ├── youtube-videos.tsx  # YouTube video cards
│   ├── free-courses.tsx    # Free course links (Khan, MIT, Coursera, etc.)
│   ├── curriculum-progress.tsx # Curriculum progress tracker
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── ai-gateway.server.ts   # Lovable AI Gateway helper
│   ├── oracle.functions.ts    # 0RACLE conversation server function
│   ├── oracle-profile.functions.ts # 0RACLE profile generation
│   ├── rawi.functions.ts      # RAWI single-concept server function
│   ├── spark.functions.ts     # SPARK image analysis server function
│   ├── curriculum.functions.ts # Curriculum lesson generation
│   ├── youtube.server.ts      # YouTube Data API v3 server function
│   ├── curriculum.ts          # Curriculum store (localStorage) + hooks
│   ├── library.ts             # Library store (localStorage) + hooks
│   ├── educis.ts              # Static data: languages, grades, countries, subjects
│   ├── error-capture.ts       # Global error listeners
│   ├── error-page.ts          # Standalone error HTML
│   └── utils.ts               # cn() utility
├── router.tsx
├── routeTree.gen.ts
├── start.ts
├── server.ts
└── styles.css
```

## Routes

| Path | Purpose |
|---|---|
| `/` | Pipeline flow diagram, CTAs |
| `/oracle` | 3-stage: conversation → identity report → handoff |
| `/rawi` | Manual concept input OR oracle curriculum mode |
| `/spark` | Image upload + curriculum context |
| `/library` | Saved lessons |
| `/library/$id` | Re-view saved lesson |
| `/explore` | Curated examples |
| `/about` | Team and mission |

## 0RACLE Flow

1. **Conversation** (min 15 exchanges): AI discovers career, learning style, country, language, strengths, gaps. Progress bar visible. AI signals `[PROFILE_READY]` when done.
2. **Identity Report**: Structured profile with typewriter animation, career card, strengths/gaps, full curriculum path (6-10 subjects with ordered topics).
3. **Handoff**: "Build My Full Curriculum" encodes profile as URL params → redirects to `/rawi?fromOracle=true&career=...&subjects=...&countryCode=...&lang=...&grade=...&style=...`

## RAWI Curriculum Mode

When `fromOracle=true` in URL params:
- Manual input hidden, oracle banner shown
- Subject tabs for each curriculum subject
- Clicking subject triggers curriculum generation
- Each lesson: explanation, local example, practice Q&A
- YouTube videos fetched per lesson topic
- Free course links: Khan Academy, MIT OCW, Coursera Free, YouTube, freeCodeCamp
- Progress tracked in localStorage

## SPARK Curriculum Integration

- Reads curriculum from localStorage on load
- Shows career context banner if curriculum exists
- Pre-selects focus subjects from curriculum
- Lessons connect to user's career path

## API Integrations

### Lovable AI Gateway
- URL: `https://ai.gateway.lovable.dev/v1/chat/completions`
- Auth: `LOVABLE_API_KEY` env var (required)
- Model: `google/gemini-3-flash-preview`
- Both input and output Zod validation on all functions

### YouTube Data API v3
- Server function: `searchYouTube` in `youtube.server.ts`
- Env var: `YOUTUBE_API_KEY` (optional, graceful fallback)
- Returns: video ID, title, thumbnail, duration, channel, URL

## localStorage Keys

| Key | Content |
|---|---|
| `educis_library` | Array of saved SparkEntry / RawiEntry |
| `educis_curriculum` | CurriculumEntry with career, subjects, topics, progress |
| `educis_oracle_profile` | OracleProfile from last 0RACLE session |

## Design System

- **Dark-only theme** with CSS variables
- **Three accents**: oracle (cyan #06b6d4), spark (purple #7c3aed), rawi (gold #c9a84c)
- **Glass morphism**: `.glass`, `.glass-strong`
- **Gradient borders**: `.border-gradient-brand`, `.border-gradient-oracle`
- **Mesh backgrounds**: `.mesh-oracle`, `.mesh-spark`, `.mesh-rawi`
- **Buttons**: `.btn-oracle`, `.btn-spark`, `.btn-rawi` with glow shadows
- **Animations**: fade-up, fade-in, float, pulse-glow, scan, shimmer
- **RTL support**: Arabic and Urdu

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `LOVABLE_API_KEY` | Yes | Lovable AI Gateway key |
| `YOUTUBE_API_KEY` | No | YouTube Data API v3 key |

## Prompt for Continuing This Project

"This is EDUCIS — an AI education platform with a 3-tool pipeline (0RACLE → RAWI → SPARK). Built with TanStack Start on Cloudflare Workers, Tailwind v4, shadcn/ui, and Google Gemini Flash via Lovable AI Gateway. 0RACLE conducts deep adaptive conversations to build personal identity reports and curriculum paths. RAWI generates culturally localized curriculum lessons with YouTube videos and free course links. SPARK analyzes photos and connects lessons to the user's curriculum. All data is in localStorage. YouTube Data API v3 provides real video recommendations. The design system uses three accent colors (oracle cyan, spark purple, rawi gold) with glass morphism and glow effects on a dark theme. When making changes: (1) validate all AI outputs with Zod, (2) update routeTree.gen.ts when adding routes, (3) use createServerFn for server functions, (4) follow existing component patterns."
