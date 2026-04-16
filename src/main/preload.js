'use strict'

const { contextBridge, ipcRenderer } = require('electron')
const path = require('path')

contextBridge.exposeInMainWorld('asarExplorer', {
  pathExists: (p) => ipcRenderer.invoke('fs:pathExists', p),
  getContents: (dirPath) => ipcRenderer.invoke('fs:getContents', dirPath),
  extractFile: (filePath, name) =>
    ipcRenderer.invoke('fs:extractFile', { filePath, name }),
  removeItem: (p) => ipcRenderer.invoke('fs:removeItem', p),
  addGarbage: (p) => ipcRenderer.send('asar:addGarbage', p),
  clearGarbage: () => ipcRenderer.send('asar:clearGarbage'),
  startDrag: (tmpPath) => ipcRenderer.send('ondragstart', tmpPath),
  joinPath: (...segments) => path.join(...segments)
})
