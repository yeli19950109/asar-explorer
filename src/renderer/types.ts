export interface AsarItemStat {
  isFile: boolean
  isDirectory: boolean
}

export interface AsarContentItem {
  name: string
  path: string
  stat: AsarItemStat
}

export interface AsarExplorerApi {
  pathExists: (p: string) => Promise<boolean>
  getContents: (dirPath: string) => Promise<AsarContentItem[]>
  extractFile: (filePath: string, name: string) => Promise<string>
  removeItem: (p: string) => Promise<void>
  joinPath: (...segments: string[]) => string
  addGarbage: (p: string) => void
  clearGarbage: () => void
  startDrag: (tmpPath: string) => void
}
