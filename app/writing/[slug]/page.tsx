import { getWritingPiece, getWritingPieces } from '@/lib/content'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const pieces = getWritingPieces()
  return pieces.map((p) => ({ slug: p.slug }))
}

export default async function WritingPiecePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  try {
    const { meta, content } = getWritingPiece(slug)
    return (
      <article>
        <header className="mb-12">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">{meta.title}</h1>
          <p className="text-xs text-neutral-400 mb-1">{meta.date}</p>
          <p className="text-xs text-neutral-400">Justin J. Chang</p>
        </header>
        {/* font-serif switches to Lora for the paper body — gives it a distinct academic feel */}
        <div className="prose prose-neutral max-w-none font-serif">
          <MDXRemote source={content} />
        </div>
      </article>
    )
  } catch {
    notFound()
  }
}
