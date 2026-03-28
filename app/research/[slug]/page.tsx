import { getResearchPiece, getResearchPieces } from '@/lib/content'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import NeuronSimulator from '@/components/interactives/neuron-model/NeuronSimulator'

export async function generateStaticParams() {
  const pieces = getResearchPieces()
  return pieces.map((p) => ({ slug: p.slug }))
}

export default async function ResearchPiecePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  try {
    const { meta, content } = getResearchPiece(slug)
    return (
      <article>
        <header className="mb-12">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">{meta.title}</h1>
          <p className="text-xs text-neutral-400 mb-1">{meta.date}</p>
          <p className="text-xs text-neutral-400">Justin J. Chang</p>
        </header>
        <div className="prose prose-neutral max-w-none">
          <MDXRemote source={content} components={{ NeuronSimulator }} />
        </div>
      </article>
    )
  } catch {
    notFound()
  }
}
