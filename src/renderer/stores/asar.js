import { defineStore } from 'pinia'
import * as fs from '@/fs'

export const useAsarStore = defineStore('asar', {
  state: () => ({
    asarName: '',
    contents: [],
    currentPath: '',
    originalPath: '',
    garbage: []
  }),
  actions: {
    addGarbage (path) {
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
    setContents (contents) {
      this.contents = contents
    },
    setOriginalPath (path) {
      this.originalPath = path
      this.currentPath = path
      this.asarName = path.split(/\\|\//g).reverse()[0]
    },
    setCurrentPath (path) {
      this.currentPath = path
    },
    async fetchContents (filePath) {
      const contents = await fs.getContents(filePath)
      this.setContents(contents)
    }
  }
})
