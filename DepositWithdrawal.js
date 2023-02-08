const fs = require('fs');
const os = require('os');
const path = require('path')
const paths = require(`c:/Users/${os.userInfo().username}/Desktop/HIRP/paths`)

let idxnum=1;
let rowIdxGlobal = 1;

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

function onDeleteTransaction() {
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
    const deletedTransaction = deletedRow(transaction);
    modifyCSV(curRow + 1,deletedTransaction);
    setRow(hTbody,curRow,deletedTransaction);
  }
  else if(!existingIdx){
    alert(`Invailed Number : Transaction Index "${transaction.dwindex}" Doesn't Exist`)
  }

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
  newRow0.id = rowIdxGlobal;
  setClickableRow(newRow0);
  rowIdxGlobal++;
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

function deletedRow(transaction){
  transaction.code = '-';
  transaction.item = '-';
  transaction.deposit = '-';
  transaction.withdraw = '-';
  transaction.stock = '-';
  transaction.note = 'Deleted'
return transaction

}

function addToCSV(rowdata) {
  fs.appendFileSync(paths.ledgerCSVPath, `${rowdata.dwindex},${rowdata.date},${rowdata.code || 0},${rowdata.item || '-'},${rowdata.deposit || 0},${rowdata.withdraw || 0},${rowdata.stock},${rowdata.note}\n`,'utf-8');
  console.log('Transaction Added');
}

function modifyCSV(curRow, rowdata) {
  const hTbody = document.getElementById('htmlTbody');
  const table = document.getElementById('dwTable');
  const row = hTbody.rows.length;

  console.log(`row length : ${row}`)

  fs.writeFile(paths.ledgerCSVPath, '\uFEFF', 'utf-8', (err, fd) => { console.log(err); });
  fs.open(paths.ledgerCSVPath, 'w', (err,fd)=> {
    for(let i = row; i > 0; i--){
      if(i != curRow){
        fs.appendFileSync(paths.ledgerCSVPath, `${table.rows[i].cells[0].innerHTML},${table.rows[i].cells[1].innerHTML},${table.rows[i].cells[2].innerHTML},${table.rows[i].cells[3].innerHTML},${table.rows[i].cells[4].innerHTML},${table.rows[i].cells[5].innerHTML},${table.rows[i].cells[6].innerHTML},${table.rows[i].cells[7].innerHTML}\n`, 'utf-8')
      }
      else if(i == curRow){
        fs.appendFileSync(paths.ledgerCSVPath, `${rowdata.dwindex},${rowdata.date},${rowdata.code || 0},${rowdata.item || '-'},${rowdata.deposit || 0},${rowdata.withdraw || 0},${rowdata.stock},${rowdata.note}\n`,'utf-8');
      }
    }
  });

  console.log("modifyied")
}

function readFromCSV() {
  const hTbody = document.getElementById('htmlTbody');

  fs.open(paths.ledgerCSVPath, 'r', (err, fd)=>{
    fs.readFile(fd, 'utf-8', (err,data) =>{
      const row = data.split("\n");
      console.log(`rows : ${row.length}`)
      const rowIdx = row.length - 1
      for (let i = 0; i < rowIdx; i++) {
        let eachrow = {};
        eachrow = row[i].split(',');
        addRow(hTbody, 0);
        fetchRow(hTbody, 0, eachrow)
        console.log('Fetching existing data completed');
        console.log(`Most recent index : ${eachrow[0]}`);
        console.log(`i : ${i}`);
        console.log(`row length : ${row.length}`);
         if (i == rowIdx - 1){
          console.log("last row")
           idxnum = eachrow[0];
           idxnum++;
           setDWIndex(idxnum);
         }
      }
    })
  })
}

function setClickableRow(object){
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

setDate();
readFromCSV();
setDWIndex();