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
        <p className="text-sm text-neutral-500 leading-relaxed mb-3">{project.description}</p>
        {project.tags && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
