// 'use strict';

// const async = require('async');
// const osenv = require('osenv');
// const fs = require('fs');
// const path = require('path');

// function getUserHomeFolder() {
//     return osenv.home();
// }

// function getFilesInFolder(folderPath, cb) {
//     fs.readdir(folderPath, cb);
// }

// function main() {
//     const folderPath = getUserHomeFolder();
//     getFilesInFolder(folderPath, (err, files) => {
//         if (err) {
//             return alert('Sorry, we could not load your home folder');
//         }
//         files.forEach((file) => {
//             console.log(`${folderPath}/${file}`);
//         })
//     })
// }

// main();