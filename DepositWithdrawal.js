const fs = require('fs');

let idxnum=1;

function setDate() {
  document.getElementById('now_date').valueAsDate = new Date();
}

function setDWIndex(num = idxnum) {
  document.getElementById('dwindex').value = num;
}

function getTransactionInput() {
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

function onEditTransaction() {
  const hTbody = document.getElementById('htmlTbody');
  const transaction = getTransactionInput();
  const table = document.getElementById('dwTable');
  
  let existingIdx = false;
  let curRow = 0;
  let rowIdx = table.rows.length - 1;
  if(rowIdx > 0){
    for (let i = 0; i < rowIdx; i++){
      if (hTbody.rows[i].cells[0].innerHTML == transaction.dwindex){
        existingIdx = true;
        curRow = i;
      }
    }
  }
  else if(rowIdx == 0){
    existingIdx = false;
  }

  if(existingIdx){
    modifyCSV(curRow + 1,transaction);
    setRow(hTbody,curRow,transaction);
  }
  else if(!existingIdx){
    
    addRow(hTbody, 0);
    setRow(hTbody,0,transaction);
    addToCSV(transaction);
    idxnum++;
  }
  
  setDWIndex(idxnum);
}

function setRow(table, row, rowdata){
  table.rows[row].cells[0].innerHTML = rowdata.dwindex;
  table.rows[row].cells[1].innerHTML = rowdata.date;
  table.rows[row].cells[2].innerHTML = rowdata.code || 0;
  table.rows[row].cells[3].innerHTML = rowdata.item || '-';
  table.rows[row].cells[4].innerHTML = rowdata.deposit || 0;
  table.rows[row].cells[5].innerHTML = rowdata.withdraw || 0;
  table.rows[row].cells[6].innerHTML = rowdata.stock;
  table.rows[row].cells[7].innerHTML = rowdata.note;
}

function fetchRow(table, row, rowdata){
  table.rows[row].cells[0].innerHTML = rowdata[0];
  table.rows[row].cells[1].innerHTML = rowdata[1];
  table.rows[row].cells[2].innerHTML = rowdata[2] || 0;
  table.rows[row].cells[3].innerHTML = rowdata[3] || '-';
  table.rows[row].cells[4].innerHTML = rowdata[4] || 0;
  table.rows[row].cells[5].innerHTML = rowdata[5] || 0;
  table.rows[row].cells[6].innerHTML = rowdata[6];
  table.rows[row].cells[7].innerHTML = rowdata[7];
}

function addRow(table, idx = 0) {
  const newRow0 = table.insertRow(idx); 
  const newCell0 = newRow0.insertCell();
  const newCell1 = newRow0.insertCell();
  const newCell2 = newRow0.insertCell();
  const newCell3 = newRow0.insertCell();
  const newCell4 = newRow0.insertCell();
  const newCell5 = newRow0.insertCell();
  const newCell6 = newRow0.insertCell();
  const newCell7 = newRow0.insertCell();
}

function addToCSV(rowdata) {
  fs.appendFile(__dirname+ '../../../data/ledger.csv', `${rowdata.dwindex},${rowdata.date},${rowdata.code || 0},${rowdata.item || '-'},${rowdata.deposit || 0},${rowdata.withdraw || 0},${rowdata.stock},${rowdata.note}\n`,'utf-8', (err) => {console.log(err)});
  console.log('Transaction Added');
}

function modifyCSV(curRow, rowdata) {
  const hTbody = document.getElementById('htmlTbody');
  const table = document.getElementById('dwTable');
  const row = hTbody.rows.length;

  console.log(`row length : ${row}`)
  for(let i = row; i > 0; i--){
    if(i != curRow){
      fs.appendFile(__dirname+ '../../../data/ledgerTemp.csv', `${table.rows[i].cells[0].innerHTML},${table.rows[i].cells[1].innerHTML},${table.rows[i].cells[2].innerHTML},${table.rows[i].cells[3].innerHTML},${table.rows[i].cells[4].innerHTML},${table.rows[i].cells[5].innerHTML},${table.rows[i].cells[6].innerHTML},${table.rows[i].cells[7].innerHTML}`, 'utf-8', (err) => {})
    }
    else if(i == curRow){
      fs.appendFile(__dirname+ '../../../data/ledgerTemp.csv', `${rowdata.dwindex},${rowdata.date},${rowdata.code || 0},${rowdata.item || '-'},${rowdata.deposit || 0},${rowdata.withdraw || 0},${rowdata.stock},${rowdata.note}\n`,'utf-8', (err) => {console.log(err)});
    }
  }
  fs.unlink('./data/ledger.csv', (err) => {"fail to delete \"ledger.csv\""});
  fs.rename(__dirname+ '../../../data/ledgerTemp.csv', __dirname+ '../../../data/ledger.csv', (err) => {"fail to rename \"ledgerTemp.csv\""});
  fs.open(__dirname+ '../../../data/ledgerTemp.csv','w', (err) => {"fail to create \"ledgerTemp.csv\""});
  console.log("modifyied")
}

function readFromCSV() {
  const hTbody = document.getElementById('htmlTbody');
  const transaction = getTransactionInput();

  fs.open('./data/ledger.csv', 'r', (err, fd)=>{
    fs.readFile(fd, 'utf-8', (err,data) =>{
      const row = data.split("\n");
      const table = [];
      for (let i = 0; i < row.length - 1; i++) {
        let eachrow = {};
        eachrow = row[i].split(',');
        addRow(hTbody, 0);
        fetchRow(hTbody, 0, eachrow)
         if (i == row.length - 1){
           idxnum = eachrow[0];
           idxnum++;
           setDWIndex(idxnum);
         }
      }
    })
  })
}

setDate();
readFromCSV();
setDWIndex();