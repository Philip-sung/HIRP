
let idxnum=0;

function setDate() {
  document.getElementById('now_date').valueAsDate = new Date();
}

function setDWIndex(num = 0) {
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
  console.log(`rowIdx : ${rowIdx}`)
  if(rowIdx > 0){
    console.log(transaction.dwindex)
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
    setRow(hTbody,curRow,transaction);
  }
  else if(!existingIdx){
    
    addRow(hTbody, 0);
    setRow(hTbody,0,transaction)
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

setDate();
setDWIndex();