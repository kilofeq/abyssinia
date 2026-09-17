/** Deterministic build: client -> Node renderer -> prerender, on every host. */
import { build } from 'vite'
import { access, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const configFile = resolve(root, 'vite.config.ts')
const clientDir = resolve(root, 'dist')
const serverDir = resolve(root, 'dist-ssr')

// Never let an earlier local build hide a missing renderer in CI.
await rm(clientDir, { recursive: true, force: true })
await rm(serverDir, { recursive: true, force: true })
await build({ root, configFile, build: { outDir: clientDir, ssr: false } })
await build({
  root,
  configFile,
  build: {
    ssr: resolve(root, 'src/entry-server.tsx'),
    outDir: serverDir,
    copyPublicDir: false,
    rollupOptions: { output: { format: 'es', entryFileNames: 'entry-server.js' } },
  },
})
await access(resolve(serverDir, 'entry-server.js'))
await import('./prerender.mjs')
