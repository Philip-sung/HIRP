const os = require('os');
const path = require('path');

//os
const username = os.userInfo().username;
//paths
const appdataPath = path.join('C:','Users',username,'AppData','Local','HIRP')
const dataDirPath = path.join('C:','Users',username,'AppData','Local','HIRP','data')
const ledgerCSVPath = path.join('C:','Users',username,'AppData','Local','HIRP','data','ledger.csv')
const ledgerBackupCSVPath = path.join('C:','Users',username,'AppData','Local','HIRP','data','ledgerBackup.csv')
const ledgerTempCSVPath = path.join('C:','Users',username,'AppData','Local','HIRP','data','ledgerTemp.csv')
const classifyCSVPath = path.join('C:','Users',username,'AppData','Local','HIRP','data','classify.csv')

exports.appdataPath = appdataPath;
exports.dataDirPath = dataDirPath;
exports.ledgerCSVPath = ledgerCSVPath;
exports.ledgerBackupCSVPath = ledgerBackupCSVPath;
exports.ledgerTempCSVPath = ledgerTempCSVPath;
exports.classifyCSVPath = classifyCSVPath;