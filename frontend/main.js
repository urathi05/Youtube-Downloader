const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
        transparent: true,
        frame: false,
    });

    mainWindow.loadFile('index.html');

    // Open the file explorer dialog when requested from the renderer process
    ipcMain.handle('dialog:openDirectory', async () => {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory'], // Restrict to opening directories only
        });

        return result.filePaths[0]; // Return the selected path (if any)
    });

    // Close the window
    ipcMain.on('window:close', () => {
        mainWindow.close();
    });

    // Minimize the window
    ipcMain.on('window:minimize', () => {
        mainWindow.minimize();
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
