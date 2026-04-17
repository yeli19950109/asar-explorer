/**
 * File system access: main process handlers in src/main/events.js,
 * bridged via preload `contextBridge.exposeInMainWorld('asarExplorer', …)`.
 */

import type { AsarContentItem, AsarExplorerApi } from '../types.ts'

function getApi (): AsarExplorerApi {
  const api = typeof window !== 'undefined' ? window.asarExplorer : undefined
  if (!api) {
    throw new Error('asarExplorer preload API is not available')
  }
  return api
}

export function pathExists (p: string): Promise<boolean> {
  return getApi().pathExists(p)
}

export function getContents (dirPath: string): Promise<AsarContentItem[]> {
  return getApi().getContents(dirPath)
}

export function extractFile (filePath: string, name: string): Promise<string> {
  return getApi().extractFile(filePath, name)
}

export function removeItem (p: string): Promise<void> {
  return getApi().removeItem(p)
}

export function joinPath (...segments: string[]): string {
  return getApi().joinPath(...segments)
}

export function dirname (p: string): string {
  return getApi().dirname(p)
}

export function addGarbage (p: string): void {
  getApi().addGarbage(p)
}

export function clearGarbage (): void {
  getApi().clearGarbage()
}

export function startDrag (tmpPath: string): void {
  getApi().startDrag(tmpPath)
}

export function selectAsarFile (): Promise<string | null> {
  return getApi().selectAsarFile()
}

export function notifyRendererReady (): Promise<void> {
  return getApi().notifyRendererReady()
}

export function onAsarOpened (callback: (path: string) => void): () => void {
  return getApi().onAsarOpened(callback)
}
