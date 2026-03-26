import { getWritingPieces } from '@/lib/content'
import WritingCard from '@/components/writing-card'

export default function WritingPage() {
  const pieces = getWritingPieces()

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Writing</h1>
      <p className="text-sm text-neutral-400 mb-12">Papers and essays.</p>
      <div>
        {pieces.map((piece) => (
          <WritingCard key={piece.slug} piece={piece} />
        ))}
      </div>
    </div>
  )
}
