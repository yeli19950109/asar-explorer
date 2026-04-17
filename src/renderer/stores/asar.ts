import { defineStore } from 'pinia'
import type { AsarContentItem } from '@/types'
import * as fs from '@/stores/fs.ts'

interface AsarState {
  asarName: string
  contents: AsarContentItem[]
  currentPath: string
  originalPath: string
  garbage: string[]
}

export const useAsarStore = defineStore('asar', {
  state: (): AsarState => ({
    asarName: '',
    contents: [],
    currentPath: '',
    originalPath: '',
    garbage: []
  }),
  actions: {
    addGarbage (path: string) {
      this.garbage.push(path)
      fs.addGarbage(path)
    },
    clearAsar () {
      this.asarName = ''
      this.contents = []
      this.originalPath = ''
      this.currentPath = ''
      this.garbage = []
      fs.clearGarbage()
    },
    setContents (contents: AsarContentItem[]) {
      this.contents = contents
    },
    setOriginalPath (path: string) {
      this.originalPath = path
      this.currentPath = path
      this.asarName = path.split(/\\|\//g).reverse()[0] ?? ''
    },
    async openFromPath (path: string) {
      if (!/\.asar$/i.test(path)) return
      try {
        if (!(await fs.pathExists(path))) return
        this.setOriginalPath(path)
      } catch {
        // ignore invalid paths
      }
    },
    setCurrentPath (path: string) {
      this.currentPath = path
    },
    async fetchContents (filePath: string) {
      const contents = await fs.getContents(filePath)
      this.setContents(contents)
    }
  }
})
