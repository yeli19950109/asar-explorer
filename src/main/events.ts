import { ipcMain, app, dialog, BrowserWindow } from 'electron';
import path, { join } from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import type { Stats } from 'node:fs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

let mainWindowRef: BrowserWindow | null = null;
let pendingAsarPath: string | null = null;
let rendererAnnouncedReady = false;

export function attachMainWindow(win: BrowserWindow | null): void {
    mainWindowRef = win;
}

function sendAsarOpened(filePath: string): void {
    if (!mainWindowRef || mainWindowRef.isDestroyed()) return;
    mainWindowRef.webContents.send('asar:opened', filePath);
}

export function queueAsarOpen(filePath: string | undefined | null): void {
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

export function broadcastInitialAsarIfAny(): void {
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
    const dialogOpts = {
        title: 'Open ASAR archive',
        properties: ['openFile' as const],
        filters: [{ name: 'ASAR', extensions: ['asar'] }],
    };
    const { canceled, filePaths } = await (win
        ? dialog.showOpenDialog(win, dialogOpts)
        : dialog.showOpenDialog(dialogOpts));
    if (canceled || !filePaths[0]) return null;
    return filePaths[0];
});

function dragIconPath(): string {
    if (app.isPackaged) {
        return join(process.resourcesPath, 'drag.png');
    }
    return join(app.getAppPath(), 'resources', 'drag.png');
}

function serializeStat(st: Stats) {
    return {
        isFile: st.isFile(),
        isDirectory: st.isDirectory(),
    };
}

ipcMain.handle('fs:pathExists', (_e, p: string) => fs.existsSync(p));

ipcMain.handle('fs:getContents', async (_e, dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
        console.log(`${dirPath} not exist`);
        throw new Error('Path does not exist');
    }
    const files = await fsp.readdir(dirPath);
    const contents: { name: string; path: string; stat: ReturnType<typeof serializeStat> }[] = [];
    for (const file of files) {
        const full = join(dirPath, file);
        const st = await fsp.stat(full);
        contents.push({
            name: file,
            path: full,
            stat: serializeStat(st),
        });
    }
    return contents;
});

ipcMain.handle('fs:extractFile', async (_e, { filePath, name }: { filePath: string; name: string }) => {
    const tmpBase = app.getPath('temp');
    const tmpPath = join(tmpBase, name);
    await fsp.copyFile(filePath, tmpPath);
    return tmpPath;
});

ipcMain.handle('fs:removeItem', (_e, p: string) => {
    fs.rmSync(p, { recursive: true, force: true });
});

const garbagePaths = new Set<string>();

ipcMain.on('asar:addGarbage', (_e, p: string) => {
    garbagePaths.add(p);
});

ipcMain.on('asar:clearGarbage', () => {
    garbagePaths.clear();
});

/** Must run synchronously during renderer `dragstart` (use sendSync), or Finder/Desktop drop fails. */
ipcMain.on('asar:dragFileOut', (event, payload: { filePath: string; name: string }) => {
    try {
        const tmpBase = app.getPath('temp');
        const tmpPath = join(tmpBase, payload.name);
        fs.copyFileSync(payload.filePath, tmpPath);
        garbagePaths.add(tmpPath);
        event.sender.startDrag({
            file: tmpPath,
            icon: dragIconPath(),
        });
    } catch (err) {
        console.error('asar:dragFileOut', err);
    }
});

app.on('before-quit', () => {
    for (const p of garbagePaths) {
        try {
            fs.rmSync(p, { recursive: true, force: true });
        } catch {
            // ignore cleanup errors
        }
    }
    garbagePaths.clear();
});
