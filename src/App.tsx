import type { Copy } from './content/copy'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { SharedTable } from './components/SharedTable'
import { Gallery } from './components/Gallery'
import { Menu } from './components/Menu'
import { Visit } from './components/Visit'
import { Reserve } from './components/Reserve'
import { Footer } from './components/Footer'
import { LogoSymbol } from './components/Logo'

export function App({ copy }: { copy: Copy }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2.5 focus:font-semibold focus:text-oncream focus:no-underline"
      >
        {copy.skipToContent}
      </a>
      <LogoSymbol />
      <Header copy={copy} />
      <main id="main">
        <Hero copy={copy} />
        <SharedTable copy={copy} />
        <Menu copy={copy} />
        <Gallery copy={copy} />
        <Visit copy={copy} />
        <Reserve copy={copy} />
      </main>
      <Footer copy={copy} />
    </>
  )
}
