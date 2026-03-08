# Friends Without Benefits — World Cup 2026 Fantasy Draft

A modern, dark-themed fantasy draft tracker for the 2026 FIFA World Cup. Built with Next.js, Tailwind CSS, and Framer Motion.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Click Deploy — no additional configuration needed
4. Every push to `main` will auto-deploy

## How to Manage Data

All data lives in the `/data` directory as JSON files. Edit them directly — points are computed at render time.

### Adding Managers (`/data/managers.json`)

Add a new object to the array:

```json
{
  "id": "chris",
  "name": "Chris",
  "photo": "/images/managers/chris.jpg",
  "teams": ["Argentina", "Japan", "Ghana", "Costa Rica", "Bahrain", "Indonesia"]
}
```

- `id`: URL-safe identifier (lowercase, no spaces)
- `name`: Display name
- `photo`: Path to headshot image in `/public/images/managers/`
- `teams`: Array of team names (must match names in `teams.json` exactly)

Then drop the headshot photo into `/public/images/managers/` named `{id}.jpg` (or `.png`).

### Adding Match Results (`/data/matches.json`)

Add a new object for each completed match:

```json
{
  "id": 13,
  "date": "2026-06-15",
  "stage": "Group Stage",
  "team1": "Argentina",
  "team2": "Chile",
  "goals1": 2,
  "goals2": 1,
  "outcome": "team1",
  "advancement1": "",
  "advancement2": ""
}
```

**Fields:**
- `id`: Unique number (increment from last match)
- `date`: Match date in `YYYY-MM-DD` format
- `stage`: One of `"Group Stage"`, `"Round of 32"`, `"Round of 16"`, `"Quarterfinals"`, `"Semifinals"`, `"Final"`
- `team1` / `team2`: Team names (must match `teams.json`)
- `goals1` / `goals2`: Goals scored (including extra time, excluding penalty shootout)
- `outcome`: `"team1"`, `"team2"`, or `"draw"` — for knockout matches decided by penalties, the winner of the shootout gets `"team1"` or `"team2"`, while both teams still get draw points from the 90-minute result
- `advancement1` / `advancement2`: Leave as `""` for group stage. For knockout rounds, set the advancing team's field to the round they advanced to (e.g., `"Quarterfinals"`). Set to `"Champion"` for the tournament winner.

### Teams Reference (`/data/teams.json`)

Pre-populated with all 48 qualified nations. Each team has:
- `name`: Full country name
- `code`: ISO country code for flag rendering
- `group`: Group letter (A-L)

## Scoring System

**Per-match (every match):**
- Win: 2 pts
- Draw: 1 pt each
- 3+ goals scored: 1 bonus pt

**Advancement bonuses:**
- Round of 32: 5 pts
- Round of 16: 7 pts
- Quarterfinals: 10 pts
- Semifinals: 15 pts
- Final: 20 pts
- Champion: 25 pts

**Tiebreakers:** Most advancement points → most wins

## Project Structure

```
/app                  → Next.js App Router pages
/components           → UI components (Leaderboard, MatchCard, Navbar, etc.)
/data                 → JSON data files (edit these!)
/lib                  → Scoring engine and data utilities
/public/images        → Manager photos and static assets
```

## Tech Stack

- **Next.js 15** (App Router)
- **Tailwind CSS** (dark theme)
- **Framer Motion** (animations)
- **TypeScript**
- **Flag CDN** (flagcdn.com)
