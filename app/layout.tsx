import type { Metadata } from 'next'
import { Geist, Geist_Mono, Lora } from 'next/font/google'
import Nav from '@/components/nav'
import Footer from '@/components/footer'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Justin Chang',
  description: 'Data Engineer and AI Researcher.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} font-sans bg-[#faf8f4] text-neutral-900 antialiased`}
      >
        <Nav />
        <main className="px-10 pt-5 pb-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
