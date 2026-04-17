import { ipcMain, app, dialog, BrowserWindow } from 'electron';
import path, { join } from 'node:path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

let mainWindowRef = null;
let pendingAsarPath = null;
let rendererAnnouncedReady = false;

export function attachMainWindow(win) {
    mainWindowRef = win;
}

function sendAsarOpened(filePath) {
    if (!mainWindowRef || mainWindowRef.isDestroyed()) return;
    mainWindowRef.webContents.send('asar:opened', filePath);
}

export function queueAsarOpen(filePath) {
    if (!filePath || !/\.asar$/i.test(filePath)) return;
    pendingAsarPath = filePath.startsWith('file:') ? fileURLToPath(filePath) : path.resolve(filePath);
    if (fs.existsSync(pendingAsarPath)) {
        if (rendererAnnouncedReady) {
            sendAsarOpened(pendingAsarPath);
            pendingAsarPath = null;
        } else {
            console.log(`rendererAnnouncedReady not ready`);
        }
    } else {
        console.log(`${pendingAsarPath} not exit`);
    }
}

export function broadcastInitialAsarIfAny() {
    const arg = process.argv.slice(1).find((a) => /\.asar$/i.test(a));
    if (!arg) return;
    queueAsarOpen(arg);
}

app.on('open-file', (event, filePath) => {
    event.preventDefault();
    queueAsarOpen(filePath);
});

ipcMain.handle('asar:rendererReady', () => {
    rendererAnnouncedReady = true;
    if (pendingAsarPath && mainWindowRef && !mainWindowRef.isDestroyed()) {
        sendAsarOpened(pendingAsarPath);
        pendingAsarPath = null;
    }
});

ipcMain.handle('asar:selectFile', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    const { canceled, filePaths } = await dialog.showOpenDialog(win ?? undefined, {
        title: 'Open ASAR archive',
        properties: ['openFile'],
        filters: [{ name: 'ASAR', extensions: ['asar'] }],
    });
    if (canceled || !filePaths[0]) return null;
    return filePaths[0];
});

function dragIconPath() {
    if (app.isPackaged) {
        return join(process.resourcesPath, 'drag.png');
    }
    return join(app.getAppPath(), 'resources', 'drag.png');
}

function serializeStat(st) {
    return {
        isFile: st.isFile(),
        isDirectory: st.isDirectory(),
    };
}

ipcMain.handle('fs:pathExists', (_e, p) => fs.existsSync(p));

ipcMain.handle('fs:getContents', async (_e, dirPath) => {
    if (!fs.existsSync(dirPath)) {
        console.log(`${dirPath} not exist`)
        throw new Error('Path does not exist');
    }
    const files = await fs.readdir(dirPath);
    const contents = [];
    for (const file of files) {
        const full = join(dirPath, file);
        const st = await fs.stat(full);
        contents.push({
            name: file,
            path: full,
            stat: serializeStat(st),
        });
    }
    return contents;
});

ipcMain.handle('fs:extractFile', async (_e, { filePath, name }) => {
    const tmpBase = app.getPath('temp');
    const tmpPath = join(tmpBase, name);
    await fs.copy(filePath, tmpPath);
    return tmpPath;
});

ipcMain.handle('fs:removeItem', (_e, p) => {
    fs.removeSync(p);
});

const garbagePaths = new Set();

ipcMain.on('asar:addGarbage', (_e, p) => {
    garbagePaths.add(p);
});

ipcMain.on('asar:clearGarbage', () => {
    garbagePaths.clear();
});

ipcMain.on('asar:ondragstart', (e, dragPath) => {
    e.sender.startDrag({
        file: dragPath,
        icon: dragIconPath(),
    });
});

app.on('before-quit', () => {
    for (const p of garbagePaths) {
        try {
            fs.removeSync(p);
        } catch (err) {
            // ignore cleanup errors
        }
    }
    garbagePaths.clear();
});
