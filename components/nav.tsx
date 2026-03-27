import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="px-10 py-5 flex justify-between items-center border-b border-neutral-100">
      <Link href="/" className="inline-flex items-center justify-center w-8 h-8 border border-neutral-400 text-xs font-semibold tracking-widest hover:border-neutral-900 transition-colors">
        JC
      </Link>
      <div className="flex gap-5 items-center text-neutral-400">
<a
          href="https://linkedin.com/in/justinjchang"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-neutral-900 transition-colors"
          aria-label="LinkedIn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
<a
          href="mailto:jschangg@gmail.com"
          className="hover:text-neutral-900 transition-colors"
          aria-label="Email"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </a>
        <a
          href="/Justin Chang Resume.pdf"
          target="_blank"
          className="text-xs font-medium border border-neutral-300 rounded px-3 py-1.5 hover:border-neutral-500 hover:bg-neutral-100 transition-all text-neutral-500 hover:text-neutral-900"
        >
          Resume
        </a>
      </div>
    </nav>
  )
}
