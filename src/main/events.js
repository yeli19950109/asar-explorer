import { ipcMain, app } from 'electron'
import { join } from 'path'
import fs from 'fs-extra'

function serializeStat (st) {
  return {
    isFile: st.isFile(),
    isDirectory: st.isDirectory()
  }
}

ipcMain.handle('fs:pathExists', (_e, p) => fs.existsSync(p))

ipcMain.handle('fs:getContents', async (_e, dirPath) => {
  if (!fs.existsSync(dirPath)) {
    throw new Error('Path does not exist')
  }
  const files = await fs.readdir(dirPath)
  const contents = []
  for (const file of files) {
    const full = join(dirPath, file)
    const st = await fs.stat(full)
    contents.push({
      name: file,
      path: full,
      stat: serializeStat(st)
    })
  }
  return contents
})

ipcMain.handle('fs:extractFile', async (_e, { filePath, name }) => {
  const tmpBase = app.getPath('temp')
  const tmpPath = join(tmpBase, name)
  await fs.copy(filePath, tmpPath)
  return tmpPath
})

ipcMain.handle('fs:removeItem', (_e, p) => {
  fs.removeSync(p)
})

const garbagePaths = new Set()

ipcMain.on('asar:addGarbage', (_e, p) => {
  garbagePaths.add(p)
})

ipcMain.on('asar:clearGarbage', () => {
  garbagePaths.clear()
})

ipcMain.on('ondragstart', (e, dragPath) => {
  e.sender.startDrag({
    file: dragPath,
    icon: join(__static, '/drag.png')
  })
})

app.on('before-quit', () => {
  for (const p of garbagePaths) {
    try {
      fs.removeSync(p)
    } catch (err) {
      // ignore cleanup errors
    }
  }
  garbagePaths.clear()
})
