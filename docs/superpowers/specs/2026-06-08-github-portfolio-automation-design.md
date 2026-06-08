# GitHub Portfolio Automation — Design Spec

**Date:** 2026-06-08  
**Status:** Approved  

## Goal

Any project pushed to GitHub with the topic `portfolio` automatically appears in the portfolio. No manual edits to the portfolio codebase required.

## Architecture

```
Project repo (any)
  ├── portfolio.json          ← curated metadata
  └── .github/workflows/
      └── portfolio-sync.yml  ← triggers Netlify rebuild on push

Push to main →
  GitHub Action → POST to Netlify build hook →
  Netlify rebuilds → Astro fetches GitHub API →
  reads portfolio.json from each tagged repo →
  generates project cards → site live in ~2 min
```

## Components

### 1. `portfolio.json` schema (each project repo)

Placed at the root of every repo tagged with topic `portfolio`.

```json
{
  "title": { "es": "...", "en": "..." },
  "description": { "es": "...", "en": "..." },
  "image": "https://raw.githubusercontent.com/MiguelVieirar16/<repo>/main/docs/preview.png",
  "tags": ["Next.js", "NestJS", "Flutter"],
  "links": {
    "github": "https://github.com/MiguelVieirar16/<repo>",
    "preview": "https://..."
  },
  "featured": true,
  "order": 1
}
```

- `github` link is optional — omit for private repos where you don't want to expose the URL
- `image` must be an absolute URL (raw GitHub or hosted CDN). Recommended: `docs/preview.png` in the repo itself
- `featured: true` pins the project at the top
- `order` controls sort sequence among featured and non-featured projects separately
- Both `es` and `en` are required for i18n support

### 2. GitHub Action (each project repo)

`.github/workflows/portfolio-sync.yml`:

```yaml
name: Sync to portfolio

on:
  push:
    branches: [main]

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Netlify build
        run: curl -s -X POST "${{ secrets.NETLIFY_BUILD_HOOK }}"
```

`NETLIFY_BUILD_HOOK` is stored as a repository secret (or organization secret shared across repos).

### 3. Astro data fetching (portfolio repo)

`Projects.astro` replaces the static `PROJECTS` array with a build-time fetch:

1. Call GitHub API: `GET /user/repos` filtered by topic `portfolio` (authenticated, includes private)
2. For each repo: fetch `portfolio.json` from raw content URL
3. Sort: `featured` first, then by `order` ascending
4. Map to existing card component interface (title, description, image, tags, links)

Environment variable required: `GITHUB_TOKEN` — a fine-grained PAT with `Contents: read` and `Metadata: read` on all portfolio repos.

Tag support: `tags` in `portfolio.json` are strings. `Projects.astro` maps known strings to existing icon components (Next.js, NestJS, Flutter, PostgreSQL, Tailwind, Python, etc.). Unknown tags render as plain text badges.

### 4. GitHub Token setup

1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Name: `netlify-portfolio-read`
3. Repository access: Only selected repositories → all repos with topic `portfolio`
4. Permissions: `Contents: Read-only`, `Metadata: Read-only`
5. Copy the generated token
6. Netlify → Site → Site configuration → Environment variables → add `GITHUB_TOKEN`

### 5. Netlify Build Hook

1. Netlify → Site → Site configuration → Build & deploy → Build hooks → Add build hook
2. Name: `github-portfolio-sync`, branch: `master`
3. Copy the generated URL
4. Add as `NETLIFY_BUILD_HOOK` secret in each project repo (GitHub → repo → Settings → Secrets)

### 6. GitHub topic tagging

For each project to include:
- GitHub → repo → About (gear icon) → Topics → add `portfolio`
- Works with private repos as long as the token has access

## Project priority order

Based on PM personal brand strategy — products first, analysis second:

| order | Project | featured | Repo |
|-------|---------|----------|------|
| 1 | Futbea | true | MiguelVieirar16/futbea (private) |
| 2 | scan_prices | true | MiguelVieirar16/scan_prices |
| 3 | GrowthOS | true | MiguelVieirar16/GrowthOS |
| 4 | klaro-crm | false | informacionklaro/klaro-crm |
| 5 | Churn analysis | false | (existing Power BI projects) |
| 6 | Other data projects | false | — |

## What doesn't change

- Site remains fully static on Netlify
- Deploy of portfolio itself: `git push origin master`
- ES/EN i18n toggle — fed from `title`/`description` in `portfolio.json`
- Existing card UI component — only the data source changes

## Error handling

- If a repo has the `portfolio` topic but no `portfolio.json`: skip it silently, log a warning during build
- If `portfolio.json` is malformed: skip that repo, build continues
- If GitHub API is unreachable at build time: Netlify build fails and retries — no partial deploys

## Out of scope

- Real-time updates without rebuild
- Automatic image generation from screenshots
- CMS or admin UI for editing project metadata
