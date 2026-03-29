import Link from 'next/link'
import { getProjects, getResearchPieces, getWritingPieces } from '@/lib/content'

export default function Home() {
  const projects = getProjects()
  const research = getResearchPieces()
  const writing = getWritingPieces()

  return (
    <div className="space-y-20">

      {/* Hero */}
      <section className="flex items-start gap-10">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight mb-2">Justin J. Chang</h1>
          <p className="text-neutral-500 mb-8">Data Engineer &amp; AI Researcher</p>
          <div className="text-neutral-600 leading-relaxed space-y-4">
            <p>
              Data Platform Engineer at First Principles, building financial market
              data infrastructure for Mosaic.
            </p>
            <p>
              Focused on designing reliable data systems that hold up under real-world constraints.
            </p>
            <p>
              Thank you for stopping by!
            </p>
          </div>
        </div>
        <img
          src="/Hiking.jpg"
          alt="Justin Chang"
          className="shrink-0 w-48 h-60 object-cover rounded-2xl [object-position:center_35%]"
        />
      </section>

      {/* Projects */}
      <section id="projects">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Projects</h2>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {projects.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="group block">
              <div className="border border-neutral-200 border-t-2 border-t-blue-400 rounded-lg p-6 h-full bg-neutral-50/50 group-hover:-translate-y-1 group-hover:shadow-md transition-all duration-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">{project.title}</h3>
                  <span className="text-neutral-400 ml-4 shrink-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Research */}
      <section id="research">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Research</h2>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {research.map((piece) => (
            <Link key={piece.slug} href={`/research/${piece.slug}`} className="group block">
              <div className="border border-neutral-200 border-t-2 border-t-amber-400 rounded-lg p-6 h-full bg-neutral-50/50 group-hover:-translate-y-1 group-hover:shadow-md transition-all duration-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">{piece.title}</h3>
                  <span className="text-neutral-400 ml-4 shrink-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed">{piece.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Writing */}
      <section id="writing">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Writing</h2>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {writing.map((piece) => (
            <Link key={piece.slug} href={`/writing/${piece.slug}`} className="group block">
              <div className="border border-neutral-200 border-t-2 border-t-emerald-400 rounded-lg p-6 h-full bg-neutral-50/50 group-hover:-translate-y-1 group-hover:shadow-md transition-all duration-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">{piece.title}</h3>
                  <span className="text-neutral-400 ml-4 shrink-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed">{piece.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
