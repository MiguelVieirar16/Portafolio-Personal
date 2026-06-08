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
