export interface Project {
  titleEs: string
  titleEn: string
  descEs: string
  descEn: string
  image: string
  tags: string[]
  github?: string
  preview?: string
  dataset?: string  // only used by static projects (not from portfolio.json)
  featured: boolean
  order: number
}

export interface RawPortfolioJson {
  title: { es: string; en: string }
  description: { es: string; en: string }
  image: string
  tags?: string[]
  links?: { github?: string; preview?: string }
  featured?: boolean
  order?: number
}
