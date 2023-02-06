'use strict';

const electron = require('electron');
const fs = require('fs');
const path = require('path');

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
    const ledger_csv = fs.readFileSync(__dirname + "\\data\\result.csv","utf-8");
    csvRows(ledger_csv);
    mainWindow.loadURL(`file://${app.getAppPath()}/static/html/ledger.html`);
    console.log('Welcome to HIRP!')
    mainWindow.on('closed', () => { mainWindow = null; });
});

function csvRows (csv) {
  const arr = [['품목', '나이'], ['제로초','27'], ['네로', '32']];
  const data = arr.map((row) => row.join(',')).join('\n');
  fs.writeFileSync('./data/result.csv', data,"utf-8");

  const rows = csv.split("\r\n");
  if(rows[rows.length - 1] === ''){
    rows.pop();
  }
  console.log(rows)

  let results = [];
  let columnTitle = [];

  for (const i in rows) {
    const row = rows[i]
    const data = row.split(",")
    if (i === "0"){
      columnTitle = data;
    } else {
      let row_data = {};
      for (const index in columnTitle) {
        const title = columnTitle[index];
        row_data[title] = data[index];
      }
      results.push(row_data);
    }
  }
  console.log(results);
}