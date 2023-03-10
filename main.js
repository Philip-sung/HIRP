'use strict';

const electron = require('electron');
const initialize = require('./initialize')

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({
      width: 1280,
      height: 960,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
        //enableRemoteModule: true,
      }
    });
    mainWindow.loadURL(`file://${app.getAppPath()}/static/html/ledger.html`);
    console.log('Welcome to HIRP!\n---')
    mainWindow.on('closed', () => { mainWindow = null; });
    initialize.createAppdata();
    initialize.createInitialCSV();
});