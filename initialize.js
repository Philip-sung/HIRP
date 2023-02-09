const fs = require('fs');
const path = require('path')
const paths = require('./paths')

function createAppdata() {
    console.log(`*[Process01]Check if AppData directory exists...`);
    const appdataDir = fs.existsSync(paths.appdataPath);
    if (appdataDir) { console.log(`Appdata directory : ${appdataDir}`); }
    else if (!appdataDir){
        fs.mkdirSync(paths.appdataPath);
        fs.mkdirSync(paths.dataDirPath);
        console.log('Appdata directory created')
    }
    console.log(`*[Process01]Appdata directory check completed\n---`);
}

function createInitialCSV() {
    console.log(`*[Process02]Check if initial csv file exists...`);
    
    const existledger = fs.existsSync(paths.ledgerCSVPath)
    if(existledger) { console.log(`ledger.csv : ${existledger}`); }
    else if(!existledger) { fs.open(paths.ledgerCSVPath, 'w', (err, fd) => {
        fs.writeFile(paths.ledgerCSVPath, '\uFEFF', 'utf-8', (err, fd) => { console.log(`Content of Error Occured while creating ledger.csv : ${err}`); });
        fs.close(fd, (err) => {console.log('ledger.csv created')})
        }) 
    }
    
    const existledgerBackup = fs.existsSync(paths.ledgerBackupCSVPath)
    if(existledgerBackup) { console.log(`ledgerBackup.csv : ${existledgerBackup}`); }
    else if(!existledgerBackup) { fs.open(paths.ledgerBackupCSVPath, 'w', (err, fd) => {
        fs.writeFile(paths.ledgerBackupCSVPath, '\uFEFF', 'utf-8', (err, fd) => { console.log(`Content of Error Occured while creating ledgerBackup.csv : ${err}`); });
        fs.close(fd, (err) => {console.log('ledgerBackup.csv created')})
        }) 
    }
    
    const existclassify = fs.existsSync(paths.classifyCSVPath)
    if(existclassify) { console.log(`classify.csv : ${existclassify}`); }
    else if(!existclassify) { fs.open(paths.classifyCSVPath, 'w', (err, fd) => {
        fs.writeFile(paths.classifyCSVPath, '\uFEFF', 'utf-8', (err, fd) => { console.log(`Content of Error Occured while creating classfy.csv : ${err}`); });
        fs.close(fd, (err) => {console.log('classify.csv created')})
        })
    }
    console.log(`*[Process02]CSV file check completed`);
   }

  exports.createInitialCSV = createInitialCSV;
  exports.createAppdata = createAppdata;