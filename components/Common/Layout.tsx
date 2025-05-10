import { ReactNode } from 'react'
import Head from 'next/head'
import Navbar from './Navbar'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
  title?: string
}

export default function Layout({ children, title = 'Vander Restaurant' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Vander Restaurant - Best food in town" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mt-5 pt-5">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}