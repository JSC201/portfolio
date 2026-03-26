import { getProject, getProjects } from '@/lib/content'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import { AlgoVisualizer } from '@/algo-visualizer/components/AlgoVisualizer'
export async function generateStaticParams() {
  const projects = getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  try {
    const { meta, content } = getProject(slug)
    return (
      <article>
        <header className="mb-12">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">{meta.title}</h1>
          <p className="text-xs text-neutral-400 mb-1">{meta.date}</p>
          <p className="text-xs text-neutral-400">Justin J. Chang</p>
        </header>
        <div className="prose prose-neutral prose-sm max-w-none">
          <MDXRemote source={content} components={{ AlgoVisualizer }} />
        </div>
      </article>
    )
  } catch {
    notFound()
  }
}
