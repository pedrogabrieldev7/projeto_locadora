const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webpreferences: { preload: path.join(__dirname, 'preload.js'),   
      nodeIntegration: true,   
      contextIsolation: false,   
      enableRemoteModule: true }
    });
    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});
