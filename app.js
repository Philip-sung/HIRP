'use strict';

const async = require('async');
const osenv = require('osenv');
const fs = require('fs');
const path = require('path');


function getUserHomeFolder() {
    return osenv.home();
}

function getFilesInFolder(folderPath, cb) {
    fs.readdir(folderPath, cb);
}

function main() {
    const folderPath = getUserHomeFolder();
    getFilesInFolder(folderPath, (err, files) => {
        if (err) {
            return alert('Sorry, we could not load your home folder');
        }
        files.forEach((file) => {
            console.log(`${folderPath}/${file}`);
        })
    })
}

main();

function addRow() {
    const btnCrc = document.querySelector('.btnCrc');
    const hTbody = document.getElementById('htmlTbody');

    const newRow0 = hTbody.insertRow(); 
    const newCell0 = newRow0.insertCell();
    const newCell1 = newRow0.insertCell();
    const newCell2 = newRow0.insertCell();
    const newCell3 = newRow0.insertCell();
    const newCell4 = newRow0.insertCell();
    const newCell5 = newRow0.insertCell();
    const newCell6 = newRow0.insertCell();
    const newCell7 = newRow0.insertCell();

    const table = document.getElementById('myTable');
    const r = table.rows.length - 1;
    const l = table.rows[r].cells.length;
    
    for(let c = 0; c<l; c++) {
      hTbody.rows[r-1].cells[c].innerHTML = `[${r-1}][${c}]`
    }
  }
  