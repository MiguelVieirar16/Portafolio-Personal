# GitHub Portfolio Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Any repo tagged with GitHub topic `portfolio` and containing a `portfolio.json` file automatically appears in the portfolio on the next Netlify build, triggered by a GitHub Action on push.

**Architecture:** Astro fetches the GitHub API at build time to get all repos tagged `portfolio`, reads `portfolio.json` from each, and generates project cards. Dynamic GitHub projects appear first (featured), followed by static Power BI data analysis projects. A GitHub Action in each project repo triggers a Netlify build webhook on push to main. The site remains fully static.

**Tech Stack:** Astro 4, TypeScript, GitHub API v3 (Contents + User Repos endpoints), GitHub Actions, Netlify Build Hooks

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/types/portfolio.ts` | Create | TypeScript interfaces for Project and raw portfolio.json schema |
| `src/lib/github.ts` | Create | Fetch repos by topic, fetch and parse portfolio.json from each |
| `src/components/LangToggle.astro` | Modify | Add `data-i18n-es`/`data-i18n-en` support for dynamic content |
| `src/components/Projects.astro` | Modify | Replace static PROJECTS array with dynamic fetch + static fallback |
| `.env.example` | Create | Document required GITHUB_TOKEN env var |
| `Futbea/portfolio.json` | Create | Project metadata for portfolio integration |
| `scan_prices/portfolio.json` | Create | Project metadata for portfolio integration |
| `GrowthOS/portfolio.json` | Create | Project metadata for portfolio integration |
| `(each project)/.github/workflows/portfolio-sync.yml` | Create | Trigger Netlify rebuild on push to main |

---

### Task 1: TypeScript types

**Files:**
- Create: `src/types/portfolio.ts`

- [ ] **Step 1: Create the types file**

```typescript
// src/types/portfolio.ts
export interface Project {
  titleEs: string
  titleEn: string
  descEs: string
  descEn: string
  image: string
  tags: string[]
  github?: string
  preview?: string
  dataset?: string
  featured: boolean
  order: number
}

export interface RawPortfolioJson {
  title: { es: string; en: string }
  description: { es: string; en: string }
  image: string
  tags: string[]
  links?: { github?: string; preview?: string }
  featured?: boolean
  order?: number
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio' && npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git -C '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio' add src/types/portfolio.ts
git -C '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio' commit -m "feat: add TypeScript types for portfolio automation"
```

---

### Task 2: GitHub API utility

**Files:**
- Create: `src/lib/github.ts`

Fetches all repos where the authenticated user has access and topic `portfolio` is set. For each repo, fetches `portfolio.json` via the Contents API (works for private repos). Uses `Promise.allSettled` so one missing file doesn't break the whole build.

- [ ] **Step 1: Create the utility**

```typescript
// src/lib/github.ts
import type { Project, RawPortfolioJson } from '../types/portfolio'

const GITHUB_API = 'https://api.github.com'

interface GitHubRepo {
  name: string
  full_name: string
  topics: string[]
  html_url: string
  private: boolean
  default_branch: string
}

interface GitHubContentsResponse {
  content: string
}

function fetchWithAuth(url: string): Promise<Response> {
  const token = import.meta.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN env var is not set')
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
}

async function fetchPortfolioJson(repo: GitHubRepo): Promise<Project> {
  const url = `${GITHUB_API}/repos/${repo.full_name}/contents/portfolio.json`
  const res = await fetchWithAuth(url)
  if (!res.ok) throw new Error(`No portfolio.json in ${repo.name}: ${res.status}`)

  const data: GitHubContentsResponse = await res.json()
  const raw: RawPortfolioJson = JSON.parse(
    Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8')
  )

  return {
    titleEs: raw.title.es,
    titleEn: raw.title.en,
    descEs: raw.description.es,
    descEn: raw.description.en,
    image: raw.image,
    tags: raw.tags ?? [],
    github: raw.links?.github,
    preview: raw.links?.preview,
    featured: raw.featured ?? false,
    order: raw.order ?? 99,
  }
}

export async function getPortfolioProjects(): Promise<Project[]> {
  const res = await fetchWithAuth(`${GITHUB_API}/user/repos?per_page=100&type=all`)
  if (!res.ok) throw new Error(`GitHub API error fetching repos: ${res.status}`)

  const repos: GitHubRepo[] = await res.json()
  const portfolioRepos = repos.filter(r => r.topics.includes('portfolio'))

  const results = await Promise.allSettled(
    portfolioRepos.map(repo => fetchPortfolioJson(repo))
  )

  results
    .filter(r => r.status === 'rejected')
    .forEach(r => console.warn('[portfolio] skipped repo:', (r as PromiseRejectedResult).reason))

  return results
    .filter((r): r is PromiseFulfilledResult<Project> => r.status === 'fulfilled')
    .map(r => r.value)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return a.order - b.order
    })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio' && npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git -C '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio' add src/lib/github.ts
git -C '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio' commit -m "feat: GitHub API utility for fetching portfolio projects at build time"
```

---

### Task 3: Update LangToggle for dynamic translations

**Files:**
- Modify: `src/components/LangToggle.astro`

Dynamic GitHub projects can't be pre-registered in `ui.ts`. They carry their translations directly as `data-i18n-es` and `data-i18n-en` HTML attributes. The toggle script needs to handle these alongside the existing `data-i18n` keys.

- [ ] **Step 1: Add dynamic attribute handling to applyLang**

Replace the entire `<script>` block in `src/components/LangToggle.astro` with:

```astro
<script>
  import { ui, defaultLang } from '../i18n/ui.ts'
  import type { Lang } from '../i18n/ui.ts'

  function getLang(): Lang {
    const stored = localStorage.getItem('lang')
    return stored === 'en' ? 'en' : defaultLang
  }

  function applyLang(lang: Lang) {
    const translations = ui[lang]

    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n') as keyof typeof translations
      if (key in translations) el.textContent = translations[key]
    })

    document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html') as keyof typeof translations
      if (key in translations) el.innerHTML = translations[key]
    })

    document.querySelectorAll<HTMLElement>('[data-i18n-es]').forEach(el => {
      const es = el.getAttribute('data-i18n-es') ?? ''
      const en = el.getAttribute('data-i18n-en') ?? es
      el.textContent = lang === 'en' ? en : es
    })

    document.title = translations['meta.title']
    const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (metaDesc) metaDesc.content = translations['meta.description']

    document.documentElement.setAttribute('lang', lang)
    localStorage.setItem('lang', lang)

    const btn = document.getElementById('lang-toggle-btn')
    if (btn) btn.textContent = lang.toUpperCase()
  }

  function init() {
    const lang = getLang()
    applyLang(lang)

    const btn = document.getElementById('lang-toggle-btn')
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = '1'
      btn.addEventListener('click', () => {
        applyLang(getLang() === 'es' ? 'en' : 'es')
      })
    }
  }

  document.addEventListener('astro:page-load', init)
</script>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio' && npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git -C '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio' add src/components/LangToggle.astro
git -C '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio' commit -m "feat: support data-i18n-es/en attributes for dynamic project translations"
```

---

### Task 4: Rewrite Projects.astro with dynamic + static projects

**Files:**
- Modify: `src/components/Projects.astro`

Replace the hardcoded PROJECTS array with a dynamic GitHub fetch. Static Power BI projects remain as a fallback array that always renders after the dynamic ones. All projects use `data-i18n-es`/`data-i18n-en` for translation. Tags map to existing icon components via `TAG_ICONS`; unknown tags render as plain badges.

- [ ] **Step 1: Replace the entire file content**

```astro
---
import GitHub from "./icons/GitHub.astro"
import NextJS from "./icons/NextJS.astro"
import Tailwind from "./icons/Tailwind.astro"
import Link from "./icons/Link.astro"
import Dataset from "./icons/Dataset.astro"
import LinkButton from "./LinkButton.astro"
import MySQL from "./icons/MySQL.astro"
import PostgreSQL from "./icons/PostgreSQL.astro"
import Python from "./icons/Python.astro"
import Java from "./icons/Java.astro"
import Excel from "./icons/Excel.astro"
import PowerBI from "./icons/PowerBI.astro"
import Firebase from "./icons/Firebase.astro"
import { getPortfolioProjects } from '../lib/github'
import type { Project } from '../types/portfolio'

const TAG_ICONS: Record<string, { class: string; icon: any }> = {
  'Next.js':      { class: 'bg-black text-white',         icon: NextJS },
  'Tailwind CSS': { class: 'bg-[#003159] text-white',     icon: Tailwind },
  'MySQL':        { class: 'bg-[#084353] text-white',     icon: MySQL },
  'PostgreSQL':   { class: 'bg-[#336791] text-white',     icon: PostgreSQL },
  'Power BI':     { class: 'bg-[#9C7F34] text-white',     icon: PowerBI },
  'Python':       { class: 'bg-[#003159] text-white',     icon: Python },
  'Java':         { class: 'bg-[#663D00] text-white',     icon: Java },
  'Firebase':     { class: 'bg-[#9C4323] text-white',     icon: Firebase },
}

const STATIC_PROJECTS: Project[] = [
  {
    titleEs: 'Análisis de tasa de abandono de clientes',
    titleEn: 'Customer Churn Rate Analysis',
    descEs: '¿Por qué se van los clientes? Este análisis desglosa el churn por ubicación, edad, género y plan contratado para identificar los segmentos con mayor riesgo y los factores que lo explican.',
    descEn: 'Why do customers leave? This analysis breaks down churn by location, age, gender and plan to identify the highest-risk segments and the factors that explain it.',
    image: '/projects/BI_CHURN.webp',
    tags: ['Power BI', 'PostgreSQL', 'Excel'],
    preview: 'https://app.powerbi.com/view?r=eyJrIjoiNWMxYmZkZjctMTdmZi00NmViLWFjZTEtNmU4NjI4Zjc1NDExIiwidCI6ImUxOGVhZDk1LWZkY2ItNDE2MC05ZjY0LTg5ZDNhNWYxNWEyNCJ9',
    dataset: 'https://drive.google.com/drive/folders/1WuzyeDklXYDkunIapGo3EViuUaDGla3n?usp=sharing',
    featured: false,
    order: 10,
  },
  {
    titleEs: 'Análisis de satisfacción de empleados — Atlas Labs',
    titleEn: 'Employee Satisfaction Analysis — Atlas Labs',
    descEs: '¿Qué retiene al talento? Un análisis de RRHH que cruza salarios, diversidad, satisfacción laboral y desgaste para entender qué factores impactan la retención en una empresa de tecnología.',
    descEn: 'What retains talent? An HR analysis crossing salaries, diversity, job satisfaction and burnout to understand what drives retention at a tech company.',
    image: '/projects/BI_RRHH.webp',
    tags: ['Power BI', 'PostgreSQL', 'Excel'],
    preview: 'https://app.powerbi.com/view?r=eyJrIjoiNzQ2YmI3OTAtNDE4NS00ZDUxLTg1MzUtNGViNWI2Yjk0MTMxIiwidCI6ImUxOGVhZDk1LWZkY2ItNDE2MC05ZjY0LTg5ZDNhNWYxNWEyNCJ9',
    dataset: 'https://drive.google.com/drive/folders/1lOqMWMxMCr7iXypOELSjb1P1oYtfv6X4?usp=sharing',
    featured: false,
    order: 11,
  },
  {
    titleEs: 'Perspectivas del mercado laboral en ciencia de datos',
    titleEn: 'Data Science Job Market Insights',
    descEs: '¿Vale la pena entrar al campo de datos? Este análisis mapea la demanda real de perfiles, los salarios según experiencia y rol, y las habilidades que el mercado exige para quien quiera entrar o crecer en ciencia de datos.',
    descEn: 'Is it worth entering the data field? This analysis maps real demand for profiles, salaries by experience and role, and the skills the market requires to enter or grow in data science.',
    image: '/projects/BI_JOBS.webp',
    tags: ['Power BI', 'MySQL', 'Excel'],
    preview: 'https://app.powerbi.com/view?r=eyJrIjoiNGVkYmEwMWEtY2M0Mi00YWI1LWIxZmEtYzAxMjJmZmFmN2Q1IiwidCI6ImUxOGVhZDk1LWZkY2ItNDE2MC05ZjY0LTg5ZDNhNWYxNWEyNCJ9',
    dataset: 'https://drive.google.com/drive/folders/1WoxQWfkLPk9wymdTMXjMUtxDLsTy3UXq?usp=sharing',
    featured: false,
    order: 12,
  },
  {
    titleEs: 'Análisis de polaridad de comentarios de un restaurante',
    titleEn: 'Restaurant Review Sentiment Analysis',
    descEs: '¿Qué piensan realmente los clientes? Usando un modelo de NLP preentrenado, analicé los comentarios de un restaurante para medir el sentimiento — positivo, neutro o negativo — y entender qué aspectos generan cada reacción.',
    descEn: 'What do customers really think? Using a pre-trained NLP model, I analyzed restaurant reviews to measure sentiment — positive, neutral or negative — and understand what aspects drive each reaction.',
    image: '/projects/BI_EMOCIONES.webp',
    tags: ['Power BI', 'Python'],
    github: 'https://github.com/MiguelVieirar16/Analisis_emociones',
    preview: 'https://app.powerbi.com/view?r=eyJrIjoiNDM3MmM4ZmMtYWVkMC00NGQxLWEwYTktMDU1ZmJlYjgzNzM1IiwidCI6ImUxOGVhZDk1LWZkY2ItNDE2MC05ZjY0LTg5ZDNhNWYxNWEyNCJ9',
    dataset: 'https://drive.google.com/drive/folders/1cj_oyLfZnQv-GnI33V02d8jYf5MDf_Gd?usp=sharing',
    featured: false,
    order: 13,
  },
  {
    titleEs: 'Ondas en modulación AM',
    titleEn: 'AM Modulation Waveforms',
    descEs: 'Aplicación de escritorio para simular y visualizar modulación AM. Permite seleccionar tipo de onda portadora, frecuencia y amplitud, y comparar la señal original con la modulación resultante en tiempo real.',
    descEn: 'Desktop app to simulate and visualize AM modulation. Select carrier wave type, frequency and amplitude, and compare the original signal with the resulting modulation in real time.',
    image: '/projects/generador.webp',
    tags: ['Python'],
    github: 'https://github.com/MiguelVieirar16/modulacionam',
    featured: false,
    order: 14,
  },
  {
    titleEs: 'Medición Nutricional Antropométrica',
    titleEn: 'Anthropometric Nutritional Assessment',
    descEs: 'App Android para registrar y calcular parámetros nutricionales — IMC, circunferencia de brazo, semanas de gestación — en pacientes de todas las edades. Conectada a Firebase para almacenamiento y seguimiento en tiempo real.',
    descEn: 'Android app to record and calculate nutritional parameters — BMI, arm circumference, weeks of gestation — for patients of all ages. Connected to Firebase for real-time storage and tracking.',
    image: '/projects/androidapp.webp',
    tags: ['Java', 'Firebase'],
    github: 'https://github.com/MiguelVieirar16/MedicionAntropometricaapp.git',
    featured: false,
    order: 15,
  },
]

let dynamicProjects: Project[] = []
try {
  dynamicProjects = await getPortfolioProjects()
} catch (e) {
  console.warn('[portfolio] GitHub fetch failed, using static projects only:', e)
}

const allProjects = [...dynamicProjects, ...STATIC_PROJECTS]
---

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {
    allProjects.map((project) => {
      return (
        <article class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
          <div class="h-40 overflow-hidden">
            <img
              class="w-full h-full object-cover object-top"
              loading="lazy"
              src={project.image}
              alt={project.titleEs}
            />
          </div>
          <div class="p-4 flex flex-col flex-1">
            <h3
              class="text-base font-bold text-slate-900 mb-2 leading-snug"
              data-i18n-es={project.titleEs}
              data-i18n-en={project.titleEn}
            >
              {project.titleEs}
            </h3>
            <p
              class="text-sm text-slate-600 line-clamp-3 mb-3"
              data-i18n-es={project.descEs}
              data-i18n-en={project.descEn}
            >
              {project.descEs}
            </p>
            <ul class="flex flex-wrap gap-x-2 gap-y-1 mb-4">
              {project.tags.map((tagName) => {
                const tagDef = TAG_ICONS[tagName]
                const TagIcon = tagDef?.icon
                return (
                  <li>
                    <span class={`flex gap-x-1 items-center rounded-full text-xs py-1 px-2 border ${tagDef ? tagDef.class + ' border-transparent' : 'bg-slate-700 text-white border-slate-600'}`}>
                      {TagIcon && <TagIcon class="size-3" />}
                      {tagName}
                    </span>
                  </li>
                )
              })}
            </ul>
            <footer class="flex items-center gap-x-3 mt-auto">
              {project.github && (
                <LinkButton href={project.github}>
                  <GitHub class="size-4" />
                  Code
                </LinkButton>
              )}
              {project.preview && (
                <LinkButton href={project.preview}>
                  <Link class="size-4" />
                  Preview
                </LinkButton>
              )}
              {project.dataset && (
                <LinkButton href={project.dataset}>
                  <Dataset class="size-4" />
                  Dataset
                </LinkButton>
              )}
            </footer>
          </div>
        </article>
      )
    })
  }
</div>
```

- [ ] **Step 2: Verify build compiles without errors**

Run: `cd '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio' && npx tsc --noEmit`
Expected: no errors (GitHub fetch will warn and fall back to static if GITHUB_TOKEN not set yet)

- [ ] **Step 3: Commit**

```bash
git -C '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio' add src/components/Projects.astro
git -C '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio' commit -m "feat: dynamic portfolio projects from GitHub API"
```

---

### Task 5: Local environment and build verification

**Files:**
- Create: `.env.example`
- Create: `.env` (local only, gitignored)

- [ ] **Step 1: Create .env.example**

```
# GitHub fine-grained PAT with Contents: read + Metadata: read
# Required to fetch portfolio.json from tagged repos (including private ones)
GITHUB_TOKEN=
```

- [ ] **Step 2: Verify .env is in .gitignore**

Run: `grep -n '\.env' '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio/.gitignore'`
Expected: a line matching `.env` or `.env*`. If not present, add `.env` to `.gitignore`.

- [ ] **Step 3: Create local .env with your token**

Create the file `/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio/.env`:
```
GITHUB_TOKEN=<paste your fine-grained PAT here>
```

The token to use is the one you'll create in Task 9 Step 1. For now, skip this step and come back after Task 9.

- [ ] **Step 4: Run local build**

Run: `cd '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio' && npm run build`

Expected: build succeeds. Look for `[portfolio]` lines in the output.
- With token set: should log which repos were fetched
- Without token set: warns and falls back to static only — still a successful build

- [ ] **Step 5: Commit .env.example**

```bash
git -C '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio' add .env.example
git -C '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio' commit -m "docs: add .env.example with GITHUB_TOKEN requirement"
```

---

### Task 6: Create portfolio.json in each project repo

**Files:**
- Create: `Futbea/portfolio.json`
- Create: `scan_prices/portfolio.json`
- Create: `GrowthOS/portfolio.json`

Images must be publicly accessible URLs (browser loads them). For private repos, host the image externally or use a placeholder until you take a real screenshot.

- [ ] **Step 1: Create Futbea/portfolio.json**

Create `/Users/miguelvieira/Desktop/proyectos/proyectos personales/Futbea/portfolio.json`:

```json
{
  "title": {
    "es": "Futbea",
    "en": "Futbea"
  },
  "description": {
    "es": "Marketplace de canchas de fútbol. Reserva tu cancha, gestiona tu complejo y conecta con tu liga — todo en una plataforma. Stack completo: Flutter (mobile), Next.js (web) y NestJS (API).",
    "en": "Football pitch marketplace. Book your pitch, manage your complex, and connect with your league — all in one platform. Full stack: Flutter (mobile), Next.js (web), NestJS (API)."
  },
  "image": "https://placehold.co/800x400/1a1a2e/ffffff?text=Futbea",
  "tags": ["Flutter", "Next.js", "NestJS", "PostgreSQL"],
  "links": {},
  "featured": true,
  "order": 1
}
```

- [ ] **Step 2: Create scan_prices/portfolio.json**

Create `/Users/miguelvieira/Desktop/proyectos/proyectos personales/scan_prices/portfolio.json`:

```json
{
  "title": {
    "es": "Scan Prices",
    "en": "Scan Prices"
  },
  "description": {
    "es": "Plataforma de consulta de precios en Venezuela por código de barras con conversión a tasa BCV en tiempo real. Monorepo con API NestJS, frontend Next.js y worker de scraping.",
    "en": "Venezuela price lookup platform by barcode with real-time BCV exchange rate conversion. Monorepo with NestJS API, Next.js frontend, and scraping worker."
  },
  "image": "https://placehold.co/800x400/0f172a/38bdf8?text=Scan+Prices",
  "tags": ["Next.js", "NestJS", "PostgreSQL"],
  "links": {
    "github": "https://github.com/MiguelVieirar16/scan_prices"
  },
  "featured": true,
  "order": 2
}
```

- [ ] **Step 3: Create GrowthOS/portfolio.json**

Create `/Users/miguelvieira/Desktop/proyectos/proyectos personales/GrowthOS/portfolio.json`:

```json
{
  "title": {
    "es": "GrowthOS",
    "en": "GrowthOS"
  },
  "description": {
    "es": "Herramienta personal de crecimiento profesional. Sistema para planificar, ejecutar y medir objetivos con integración de métricas y seguimiento de hábitos.",
    "en": "Personal professional growth tool. System for planning, executing and measuring goals with metrics integration and habit tracking."
  },
  "image": "https://placehold.co/800x400/064e3b/6ee7b7?text=GrowthOS",
  "tags": ["Next.js", "PostgreSQL"],
  "links": {
    "github": "https://github.com/MiguelVieirar16/GrowthOS"
  },
  "featured": true,
  "order": 3
}
```

- [ ] **Step 4: Commit portfolio.json to each repo**

```bash
git -C '/Users/miguelvieira/Desktop/proyectos/proyectos personales/Futbea' add portfolio.json
git -C '/Users/miguelvieira/Desktop/proyectos/proyectos personales/Futbea' commit -m "feat: add portfolio.json for personal portfolio integration"

git -C '/Users/miguelvieira/Desktop/proyectos/proyectos personales/scan_prices' add portfolio.json
git -C '/Users/miguelvieira/Desktop/proyectos/proyectos personales/scan_prices' commit -m "feat: add portfolio.json for personal portfolio integration"

git -C '/Users/miguelvieira/Desktop/proyectos/proyectos personales/GrowthOS' add portfolio.json
git -C '/Users/miguelvieira/Desktop/proyectos/proyectos personales/GrowthOS' commit -m "feat: add portfolio.json for personal portfolio integration"
```

---

### Task 7: GitHub Action in each project repo

**Files:**
- Create: `.github/workflows/portfolio-sync.yml` in Futbea, scan_prices, GrowthOS

- [ ] **Step 1: Create and commit in Futbea**

Create `/Users/miguelvieira/Desktop/proyectos/proyectos personales/Futbea/.github/workflows/portfolio-sync.yml`:

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

```bash
git -C '/Users/miguelvieira/Desktop/proyectos/proyectos personales/Futbea' add .github/workflows/portfolio-sync.yml
git -C '/Users/miguelvieira/Desktop/proyectos/proyectos personales/Futbea' commit -m "ci: trigger portfolio rebuild on push to main"
```

- [ ] **Step 2: Create and commit in scan_prices**

Create `/Users/miguelvieira/Desktop/proyectos/proyectos personales/scan_prices/.github/workflows/portfolio-sync.yml` with the same content as Step 1.

```bash
git -C '/Users/miguelvieira/Desktop/proyectos/proyectos personales/scan_prices' add .github/workflows/portfolio-sync.yml
git -C '/Users/miguelvieira/Desktop/proyectos/proyectos personales/scan_prices' commit -m "ci: trigger portfolio rebuild on push to main"
```

- [ ] **Step 3: Create and commit in GrowthOS**

Create `/Users/miguelvieira/Desktop/proyectos/proyectos personales/GrowthOS/.github/workflows/portfolio-sync.yml` with the same content as Step 1.

```bash
git -C '/Users/miguelvieira/Desktop/proyectos/proyectos personales/GrowthOS' add .github/workflows/portfolio-sync.yml
git -C '/Users/miguelvieira/Desktop/proyectos/proyectos personales/GrowthOS' commit -m "ci: trigger portfolio rebuild on push to main"
```

---

### Task 8: Create GitHub fine-grained token

This task is done in the browser.

- [ ] **Step 1: Create the token**

1. Go to **github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. Click **Generate new token**
3. Name: `netlify-portfolio-read`
4. Expiration: 1 year (or No expiration)
5. Resource owner: `MiguelVieirar16`
6. Repository access: **Only select repositories** → select: `futbea`, `scan_prices`, `GrowthOS`
7. Permissions:
   - **Contents** → Read-only
   - **Metadata** → Read-only (auto-selected)
8. Click **Generate token** → copy the value (starts with `github_pat_...`)

- [ ] **Step 2: Add token to local .env**

Edit `/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio/.env`:
```
GITHUB_TOKEN=github_pat_xxxx...
```

- [ ] **Step 3: Add token to Netlify**

1. Go to **Netlify → your portfolio site → Site configuration → Environment variables**
2. Click **Add a variable**
3. Key: `GITHUB_TOKEN`
4. Values: paste the token
5. Scopes: **Builds** (only needed at build time)
6. Save

---

### Task 9: Netlify build hook + repo secrets + topic tags

- [ ] **Step 1: Create Netlify build hook**

1. Go to **Netlify → your portfolio site → Site configuration → Build & deploy → Build hooks**
2. Click **Add build hook**
3. Name: `github-portfolio-sync`, Branch: `master`
4. Save → copy the generated URL (format: `https://api.netlify.com/build_hooks/xxxxxxxx`)

- [ ] **Step 2: Add NETLIFY_BUILD_HOOK secret to each repo**

Run each command and paste the build hook URL when prompted:

```bash
gh secret set NETLIFY_BUILD_HOOK --repo MiguelVieirar16/futbea
gh secret set NETLIFY_BUILD_HOOK --repo MiguelVieirar16/scan_prices
gh secret set NETLIFY_BUILD_HOOK --repo MiguelVieirar16/GrowthOS
```

- [ ] **Step 3: Tag each repo with topic `portfolio` on GitHub**

For each repo, go to its GitHub page → **About** section (gear icon) → **Topics** → type `portfolio` → **Save changes**:
- `MiguelVieirar16/futbea`
- `MiguelVieirar16/scan_prices`
- `MiguelVieirar16/GrowthOS`

- [ ] **Step 4: Push everything to GitHub**

```bash
# Portfolio site
git -C '/Users/miguelvieira/Desktop/proyectos/quien soy/portafolio' push origin master

# Projects (commits from Tasks 6 and 7)
git -C '/Users/miguelvieira/Desktop/proyectos/proyectos personales/Futbea' push personal main
git -C '/Users/miguelvieira/Desktop/proyectos/proyectos personales/scan_prices' push origin main
git -C '/Users/miguelvieira/Desktop/proyectos/proyectos personales/GrowthOS' push origin main
```

- [ ] **Step 5: Verify end-to-end**

1. Go to **Netlify → Deploys** — a build should be triggered by the portfolio push
2. Check build logs for `[portfolio]` lines — should show fetching 3 repos
3. Once deployed, open the live site
4. Confirm Futbea, scan_prices, GrowthOS appear **before** the Power BI projects
5. Toggle ES/EN — project titles and descriptions should switch languages correctly
6. Make a test push to scan_prices → confirm it triggers a new Netlify build automatically

---

## Self-Review

**Spec coverage:**
- ✅ portfolio.json schema → Task 1 (types) + Task 6 (files)
- ✅ GitHub Action trigger → Task 7
- ✅ Astro fetches GitHub API at build time → Task 2 + 4
- ✅ topic `portfolio` filter → `github.ts` filters by topic
- ✅ GITHUB_TOKEN for private repos → Task 8
- ✅ Netlify build hook → Task 9
- ✅ i18n (ES/EN) → Task 3 + 4 (data-i18n-es/en)
- ✅ Featured + order sorting → `github.ts` sort logic
- ✅ Error handling (missing portfolio.json → skip) → `Promise.allSettled` in `github.ts`
- ✅ Project priority order (products first) → order field in portfolio.json files

**Placeholder scan:** None found. All code blocks are complete.

**Type consistency:**
- `Project` interface defined in Task 1, used identically in Tasks 2, 4
- `RawPortfolioJson` defined in Task 1, used in Task 2 `fetchPortfolioJson`
- `getPortfolioProjects()` defined in Task 2, imported in Task 4
- `TAG_ICONS` record keys are strings, `tagName` is `string` — consistent
