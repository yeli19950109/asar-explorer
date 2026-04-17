'use strict';

import path from 'node:path';
import { contextBridge, ipcRenderer } from 'electron';

/**
 * Renderer-visible API (only what we whitelist here reaches the page).
 * Must use contextBridge with contextIsolation: true — never assign to window in preload.
 */
const asarExplorer = {
    pathExists: (p) => ipcRenderer.invoke('fs:pathExists', p),
    getContents: (dirPath) => ipcRenderer.invoke('fs:getContents', dirPath),
    extractFile: (filePath, name) =>
        ipcRenderer.invoke('fs:extractFile', { filePath, name }),
    removeItem: (p) => ipcRenderer.invoke('fs:removeItem', p),
    addGarbage: (p) => ipcRenderer.send('asar:addGarbage', p),
    clearGarbage: () => ipcRenderer.send('asar:clearGarbage'),
    dragFileOut: (filePath, name) => {
        ipcRenderer.sendSync('asar:dragFileOut', { filePath, name });
    },
    joinPath: (...segments) => path.join(...segments),
    dirname: (p) => path.dirname(p),
    selectAsarFile: () => ipcRenderer.invoke('asar:selectFile'),
    notifyRendererReady: () => ipcRenderer.invoke('asar:rendererReady'),
    onAsarOpened: (callback) => {
        const listener = (_event, filePath) => callback(filePath);
        ipcRenderer.on('asar:opened', listener);
        return () => ipcRenderer.removeListener('asar:opened', listener);
    },
};

contextBridge.exposeInMainWorld('asarExplorer', asarExplorer);
