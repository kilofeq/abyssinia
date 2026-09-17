import {
  defineConfig,
  type Plugin,
  type ViteDevServer,
  type PreviewServer,
} from 'vite'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { RenderResult } from './src/entry-server'

/** Exercise the published redirect map and real 404s in local previews too. */
function staticRoutes(): Plugin {
  const install = (server: ViteDevServer | PreviewServer) => {
    const redirects = new Map(
      readFileSync(resolve(server.config.root, 'public/_redirects'), 'utf8')
        .split('\n')
        .filter((line) => line.trim() && !line.startsWith('#'))
        .map((line) => {
          const [from, to] = line.trim().split(/\s+/)
          return [from!, to!]
        }),
    )
    server.middlewares.use((req, res, next) => {
      const path = new URL(req.url ?? '/', 'http://localhost').pathname
      const target = redirects.get(path)
      if (target) {
        res.writeHead(301, { Location: target })
        res.end()
        return
      }
      if (
        path !== '/' &&
        path !== '/en/' &&
        path !== '/admin/' &&
        path !== '/admin/index.html' &&
        !path.startsWith('/api/') &&
        (!path.split('/').pop()?.includes('.') || path.endsWith('.html')) &&
        !path.startsWith('/@') &&
        !path.startsWith('/node_modules/')
      ) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(
          req.method === 'HEAD'
            ? undefined
            : readFileSync(resolve(server.config.root, 'public/404.html')),
        )
        return
      }
      next()
    })
  }
  return {
    name: 'abyssinia-static-routes',
    configureServer: install,
    configurePreviewServer: install,
  }
}

/** Use the production renderer in dev, without requiring a prior build. */
function renderDevPages(): Plugin {
  return {
    name: 'abyssinia-dev-pages',
    apply: 'serve',
    transformIndexHtml: {
      order: 'pre',
      async handler(template, context) {
        if (!context.server) return template
        const pathname = new URL(
          context.originalUrl ?? context.path,
          'http://localhost',
        ).pathname
        const locale = /^\/en(?:\/|$)/.test(pathname) ? 'en' : 'pl'
        const { render } = await context.server.ssrLoadModule(
          '/src/entry-server.tsx',
        )
        const page: RenderResult = render(locale)
        const escapeAttr = (value: string) =>
          value
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
        return template
          .replace('<html lang="pl">', `<html lang="${page.lang}">`)
          .replace('<!--app-title-->', () => escapeAttr(page.title))
          .replace('<!--app-description-->', () => escapeAttr(page.description))
          .replace('<!--app-head-->', () => page.head)
          .replace('<!--app-html-->', () => page.html)
      },
    },
    handleHotUpdate({ file, server, modules }) {
      // Components/content run only on the server. Reload their HTML instead
      // of asking React Fast Refresh to update a nonexistent client root.
      if (
        file.includes('/src/') &&
        /\.(tsx?|json)$/.test(file) &&
        !file.endsWith('/client.ts')
      ) {
        for (const module of modules)
          server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
        return []
      }
    },
  }
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [staticRoutes(), renderDevPages(), react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8788',
        changeOrigin: true,
        configure(proxy) {
          proxy.on('proxyReq', (outgoing, incoming) => {
            if (incoming.headers.origin === `http://${incoming.headers.host}`)
              outgoing.setHeader('Origin', 'http://127.0.0.1:8788')
          })
        },
      },
    },
  },
  build: {
    rollupOptions: isSsrBuild
      ? undefined
      : {
          input: {
            main: resolve('index.html'),
            admin: resolve('admin/index.html'),
          },
        },
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    reportCompressedSize: true,
    // The SSR bundle is only ever imported by scripts/prerender.mjs, so it has
    // no use for a second copy of the fonts and gallery.
    copyPublicDir: !isSsrBuild,
  },
}))
