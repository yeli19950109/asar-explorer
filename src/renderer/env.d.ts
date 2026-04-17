/// <reference types="vite/client" />

import type { AsarExplorerApi } from './types'

declare global {
  interface Window {
    asarExplorer?: AsarExplorerApi
  }

  /** Electron exposes the absolute path on `File` from drag-and-drop and file inputs. */
  interface File {
    path: string
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

export {}
