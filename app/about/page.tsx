export default function About() {
  return (
    <div className="space-y-12 max-w-lg">

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">About</h2>
        <ul className="space-y-2 text-neutral-600">
          <li>Based in New York City</li>
          <li>Background in B2B sales and operations</li>
          <li>Inspired by builders who challenge the status quo</li>
          <li>Curious about the implications of those innovations</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">Systems Philosophy</h2>
        <ul className="space-y-2 text-neutral-600">
          <li>Every decision has a tradeoff</li>
          <li>User behavior should inform design</li>
          <li>Performance under pressure separates theory from reality</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">Outside of Work</h2>
        <ul className="space-y-2 text-neutral-600">
          <li>Avid tennis player</li>
          <li>Podcast connoisseur</li>
        </ul>
      </section>

    </div>
  )
}
