import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { ProjectMeta, WritingMeta, ResearchMeta } from './types'

const contentDir = path.join(process.cwd(), 'content')

export function getProjects(): ProjectMeta[] {
  const dir = path.join(contentDir, 'projects')
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(dir, filename), 'utf8')
      const { data } = matter(raw)
      return { ...data, slug } as ProjectMeta
    })
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getProject(slug: string): { meta: ProjectMeta; content: string } {
  const filepath = path.join(contentDir, 'projects', `${slug}.mdx`)
  const raw = fs.readFileSync(filepath, 'utf8')
  const { data, content } = matter(raw)
  return { meta: { ...data, slug } as ProjectMeta, content }
}

export function getWritingPieces(): WritingMeta[] {
  const dir = path.join(contentDir, 'writing')
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(dir, filename), 'utf8')
      const { data } = matter(raw)
      return { ...data, slug } as WritingMeta
    })
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getWritingPiece(slug: string): { meta: WritingMeta; content: string } {
  const filepath = path.join(contentDir, 'writing', `${slug}.mdx`)
  const raw = fs.readFileSync(filepath, 'utf8')
  const { data, content } = matter(raw)
  return { meta: { ...data, slug } as WritingMeta, content }
}

export function getResearchPieces(): ResearchMeta[] {
  const dir = path.join(contentDir, 'research')
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(dir, filename), 'utf8')
      const { data } = matter(raw)
      return { ...data, slug } as ResearchMeta
    })
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getResearchPiece(slug: string): { meta: ResearchMeta; content: string } {
  const filepath = path.join(contentDir, 'research', `${slug}.mdx`)
  const raw = fs.readFileSync(filepath, 'utf8')
  const { data, content } = matter(raw)
  return { meta: { ...data, slug } as ResearchMeta, content }
}
