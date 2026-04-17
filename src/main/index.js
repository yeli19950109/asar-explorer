import path from 'node:path';
import { app, BrowserWindow, Menu } from 'electron';
import isDev from 'electron-is-dev';
import contextMenu from 'electron-context-menu';

import './events';
import process from 'node:process';

let mainWindow;

contextMenu({
    showLookUpSelection: false,
    showSearchWithGoogle: false,
    showCopyImage: false,
    showCopyImageAddress: false,
    showSaveImage: false,
    showSaveImageAs: false,
    showInspectElement: true,
    showServices: false,
});

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 540,
        useContentSize: true,
        titleBarStyle: 'hidden',
        width: 360,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
        },
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(
            path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
        );
    }

    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function setApplicationMenu() {
    if (process.platform === 'darwin') {
        Menu.setApplicationMenu(Menu.buildFromTemplate([
            {
                label: app.name,
                submenu: [
                    {
                        role: 'services',
                        submenu: [],
                    },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' },
                ],
            },
            {
                label: 'Edit',
                submenu: [
                    {
                        label: 'Undo',
                        accelerator: 'CmdOrCtrl+Z',
                    },
                    {
                        label: 'Redo',
                        accelerator: 'Shift+CmdOrCtrl+Z',
                    },
                    {
                        type: 'separator',
                    },
                    {
                        label: 'Cut',
                        accelerator: 'CmdOrCtrl+X',
                    },
                    {
                        label: 'Copy',
                        accelerator: 'CmdOrCtrl+C',
                    },
                    {
                        label: 'Paste',
                        accelerator: 'CmdOrCtrl+V',
                    },
                    {
                        label: 'Select All',
                        accelerator: 'CmdOrCtrl+A',
                    }],
            },
            {
                label: '&Window',
                role: 'window',
                submenu: [
                    { role: 'minimize' },
                    { role: 'close' },
                ],
            },
        ]));
    } else {
        Menu.setApplicationMenu(null);
    }
}

app.on('ready', () => {
    setApplicationMenu();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
