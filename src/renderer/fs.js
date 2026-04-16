/**
 * File system access: main process handlers in src/main/events.js,
 * bridged via preload `contextBridge.exposeInMainWorld('asarExplorer', …)`.
 */

function getApi () {
  const api = typeof window !== 'undefined' && window.asarExplorer
  if (!api) {
    throw new Error('asarExplorer preload API is not available')
  }
  return api
}

export function pathExists (p) {
  return getApi().pathExists(p)
}

export function getContents (dirPath) {
  return getApi().getContents(dirPath)
}

export function extractFile (filePath, name) {
  return getApi().extractFile(filePath, name)
}

export function removeItem (p) {
  return getApi().removeItem(p)
}

export function joinPath (...segments) {
  return getApi().joinPath(...segments)
}

export function addGarbage (p) {
  getApi().addGarbage(p)
}

export function clearGarbage () {
  getApi().clearGarbage()
}

export function startDrag (tmpPath) {
  getApi().startDrag(tmpPath)
}
