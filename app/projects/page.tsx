import { getProjects } from '@/lib/content'
import ProjectCard from '@/components/project-card'

export default function ProjectsPage() {
  const projects = getProjects()

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Projects</h1>
      <p className="text-sm text-neutral-400 mb-12">Things I&apos;ve built.</p>
      <div>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
