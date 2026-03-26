import Link from 'next/link'
import { ProjectMeta } from '@/lib/types'

export default function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <div className="py-6 border-b border-neutral-100 group-hover:border-neutral-300 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-neutral-900">{project.title}</h3>
          <span className="text-xs text-neutral-400 shrink-0 ml-4">{project.date}</span>
        </div>
        <p className="text-sm text-neutral-500 leading-relaxed">{project.description}</p>
      </div>
    </Link>
  )
}
