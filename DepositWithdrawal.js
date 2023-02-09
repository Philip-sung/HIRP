const fs = require('fs');
const os = require('os');
const path = require('path')
const paths = require(`c:/Users/${os.userInfo().username}/Desktop/HIRP/paths`)

let idxnumGlobal = 1;
let rowIdxGlobal = 1;
let onSearchingFlagGlobal = 0;

function SetDate() {
  document.getElementById('now_date').valueAsDate = new Date();
}

function SetDWIndex(num = idxnumGlobal) {
  document.getElementById('dwindex').value = num;
}

function GetTransactionInput() {
  const transaction = {
    dwindex : document.getElementById("dwindex").value,
    date : document.getElementById("now_date").value,
    code : document.getElementById("code").value,
    item : document.getElementById("item").value,
    deposit : document.getElementById("deposit").value,
    withdraw : document.getElementById("withdraw").value,
    stock : document.getElementById("stock").value,
    note : document.getElementById("note").value
  }
  return transaction
}

function OnEditTransaction() {
  const hTbody = document.getElementById('htmlTbody');
  const transaction = GetTransactionInput();
  
  let existingIdx = false;
  let curRow = 0;

  const data =  fs.readFileSync(paths.ledgerCSVPath, 'utf-8')
  const row = data.split("\n");
  if(row.length == 0){
    existingIdx = false;
  }
  else if(row.length >= 1){
    const rowIdxLength = row.length - 1;
    for (let i = 0; i < rowIdxLength; i++) {
      let eachrow = {};
      eachrow = row[i].split(',');
      if(eachrow[0] == transaction.dwindex){
        existingIdx = true;
        curRow = eachrow[0];
      }
    }
  }

  if(existingIdx){
    ModifyCSV(curRow,transaction, paths.ledgerCSVPath);
    ModifyCSV(curRow,transaction, paths.ledgerBackupCSVPath);
    if(onSearchingFlagGlobal == 0){
      ReloadfromCSV();
    }
    else if (onSearchingFlagGlobal == 1){
      ReloadSearchResultfromCSV();
    }
  }
  else if(!existingIdx){
    
    AddRow(hTbody, 0);
    SetRow(hTbody,0,transaction);
    AddToCSV(transaction, paths.ledgerCSVPath);
    AddToCSV(transaction, paths.ledgerBackupCSVPath);
    idxnumGlobal++;
  }
  
  SetDWIndex(idxnumGlobal);
}

function OnDeleteTransaction() {
  const transaction = GetTransactionInput();

  let existingIdx = false;
  let curRow = 0;

  const data =  fs.readFileSync(paths.ledgerCSVPath, 'utf-8')
  const row = data.split("\n");
  if(row.length == 0){
    existingIdx = false;
  }
  else if(row.length >= 1){
    const rowIdxLength = row.length - 1;
    for (let i = 0; i < rowIdxLength; i++) {
      let eachrow = {};
      eachrow = row[i].split(',');
      if(eachrow[0] == transaction.dwindex){
        existingIdx = true;
        curRow = eachrow[0];
      }
    }
  }

  if(existingIdx){
    const deletedTransaction = DeletedRow(transaction);
    ModifyCSV(curRow,deletedTransaction, paths.ledgerCSVPath);
    if(onSearchingFlagGlobal == 0){
      ReloadfromCSV();
    }
    else if (onSearchingFlagGlobal == 1){
      ReloadSearchResultfromCSV();
    }
  }
  else if(!existingIdx){
    alert(`Invailed Number : Transaction Index "${transaction.dwindex}" Doesn't Exist`)
  }

}

function FetchRow(table, row, rowdata){
  table.rows[row].cells[0].innerHTML = rowdata[0];
  table.rows[row].cells[1].innerHTML = rowdata[1];
  table.rows[row].cells[2].innerHTML = rowdata[2] || 0;
  table.rows[row].cells[3].innerHTML = rowdata[3] || '-';
  table.rows[row].cells[4].innerHTML = rowdata[4] || 0;
  table.rows[row].cells[5].innerHTML = rowdata[5] || 0;
  table.rows[row].cells[6].innerHTML = rowdata[6];
  table.rows[row].cells[7].innerHTML = rowdata[7];
}

function AddRow(table, idx = 0) {
  const newRow0 = table.insertRow(idx);
  const newCell0 = newRow0.insertCell();
  const newCell1 = newRow0.insertCell();
  const newCell2 = newRow0.insertCell();
  const newCell3 = newRow0.insertCell();
  const newCell4 = newRow0.insertCell();
  const newCell5 = newRow0.insertCell();
  const newCell6 = newRow0.insertCell();
  const newCell7 = newRow0.insertCell();
  newRow0.id = rowIdxGlobal;
  SetClickableRow(newRow0);
  rowIdxGlobal++;
}

function SetRow(table, row, rowdata){
  table.rows[row].cells[0].innerHTML = rowdata.dwindex;
  table.rows[row].cells[1].innerHTML = rowdata.date;
  table.rows[row].cells[2].innerHTML = rowdata.code || 0;
  table.rows[row].cells[3].innerHTML = rowdata.item || '-';
  table.rows[row].cells[4].innerHTML = rowdata.deposit || 0;
  table.rows[row].cells[5].innerHTML = rowdata.withdraw || 0;
  table.rows[row].cells[6].innerHTML = rowdata.stock;
  table.rows[row].cells[7].innerHTML = rowdata.note;
}

function DeletedRow(transaction){
  transaction.code = '-';
  transaction.item = '-';
  transaction.deposit = '-';
  transaction.withdraw = '-';
  transaction.stock = '-';
  transaction.note = 'Deleted'
  
  return transaction
}

function SetClickableRow(object){
  object.addEventListener("click", function() { 
    document.getElementById('dwindex').value = object.cells[0].innerHTML;
    document.getElementById('now_date').value = object.cells[1].innerHTML;
    document.getElementById('code').value = object.cells[2].innerHTML;
    document.getElementById('item').value = object.cells[3].innerHTML;
    document.getElementById('deposit').value = object.cells[4].innerHTML;
    document.getElementById('withdraw').value = object.cells[5].innerHTML;
    document.getElementById('stock').value = object.cells[6].innerHTML;
    document.getElementById('note').value = object.cells[7].innerHTML;
  })
}

function AddToCSV(rowdata, path) {
  fs.appendFileSync(path, `${rowdata.dwindex},${rowdata.date},${rowdata.code || 0},${rowdata.item || '-'},${rowdata.deposit || 0},${rowdata.withdraw || 0},${rowdata.stock},${rowdata.note}\n`,'utf-8');
  console.log(`Transaction Added to ${path}`);
}

function ModifyCSV(curRow, rowdata, path) {
  fs.writeFileSync(paths.ledgerTempCSVPath, '\uFEFF', 'utf-8');
  const csv = fs.openSync(path)
  const data = fs.readFileSync(path, 'utf-8')
  const row = data.split("\n");
  if(row.length >= 1){
    const rowIdxLength = row.length - 1;
    for (let i = 0; i < rowIdxLength; i++) {
      let eachrow = {};
      eachrow = row[i].split(',');
      if (eachrow[0] != curRow){
        fs.appendFileSync(paths.ledgerTempCSVPath, `${eachrow[0]},${eachrow[1]},${eachrow[2]},${eachrow[3]},${eachrow[4]},${eachrow[5]},${eachrow[6]},${eachrow[7]}\n`, 'utf-8')
      }
      else if(eachrow[0] == curRow) {
        fs.appendFileSync(paths.ledgerTempCSVPath, `${rowdata.dwindex},${rowdata.date},${rowdata.code || 0},${rowdata.item || '-'},${rowdata.deposit || 0},${rowdata.withdraw || 0},${rowdata.stock},${rowdata.note}\n`,'utf-8');
      }
    }
  }
  fs.closeSync(csv)
  fs.unlinkSync(path)
  fs.renameSync(paths.ledgerTempCSVPath, path)
}

function ReadFromCSV() {
  const hTbody = document.getElementById('htmlTbody');
  const csv = fs.openSync(paths.ledgerCSVPath, 'r')
  const data = fs.readFileSync(paths.ledgerCSVPath, 'utf-8')
  const row = data.split("\n");
  const rowIdx = row.length - 1
  for (let i = 0; i < rowIdx; i++) {
    let eachrow = {};
    eachrow = row[i].split(',');
    AddRow(hTbody, 0);
    FetchRow(hTbody, 0, eachrow)
      if (i == rowIdx - 1){
        idxnumGlobal = eachrow[0];
        idxnumGlobal++;
        SetDWIndex(idxnumGlobal);
      }
  }
  console.log(`Fetching existing data completed : ${paths.ledgerCSVPath}`);
  fs.closeSync(csv);
}

function ReadFromCSVwithKey() {
  const hTbody = document.getElementById('htmlTbody');
  const searchkey = document.getElementById('searchkey').value;
  let searchingFor = false;
  
  const csv = fs.openSync(paths.ledgerCSVPath, 'r')
  const data = fs.readFileSync(paths.ledgerCSVPath, 'utf-8')
  const row = data.split("\n");
  const rowIdx = row.length - 1;
  for (let i = 0; i < rowIdx; i++) {
    let eachrow = {};
    eachrow = row[i].split(',');
    for(let i = 0; i < eachrow.length; i++){
      if(eachrow[i].includes(searchkey)){
        searchingFor = true;
        console.log(`each : ${eachrow[i]}, searchkey : ${searchkey}`)
      }
    }
    if(searchingFor == true){
      AddRow(hTbody, 0);
      FetchRow(hTbody, 0, eachrow)
      if (i == rowIdx - 1){
        idxnumGlobal = eachrow[0];
        idxnumGlobal++;
        SetDWIndex(idxnumGlobal);
      }
    }
    searchingFor = false;
  }
  fs.closeSync(csv);

  return searchkey;
}

function ReloadSearchResultfromCSV() {
  const hTbody = document.getElementById('htmlTbody');
  const curRowNum = hTbody.rows.length;
  for(let i = 0; i < curRowNum; i++){
    hTbody.removeChild(hTbody.childNodes[1]);
    rowIdxGlobal--;
  }

  const keyword = ReadFromCSVwithKey();
  onSearchingFlagGlobal = 1;
  console.log(`Keyword Search : ${keyword}`);
}

function ReloadfromCSV() {
  const hTbody = document.getElementById('htmlTbody');
  const curRowNum = hTbody.rows.length;
  for(let i = 0; i < curRowNum; i++){
    hTbody.removeChild(hTbody.childNodes[1]);
    rowIdxGlobal--;
  }

  ReadFromCSV();
  onSearchingFlagGlobal = 0;
  console.log("Keyword Search : Inactive");
}

SetDate();
ReadFromCSV();
SetDWIndex();