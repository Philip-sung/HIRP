const fs = require('fs');
const os = require('os');
const paths = require(`c:/Users/${os.userInfo().username}/Desktop/HIRP/paths`)

function StockAggregation() {
    const hTbody = document.getElementById('htmlTbody');
    const items = [];
    let item = {
        'itemCode': '',
        'itemName': '',
        'depositNum': 0,
        'withdrawNum': 0,
        'stock': 0,
        'price': 0,
        'total': 0,
        'note': ''
    }
    console.log(item)
    let existingItemFlag = false;
    let itemIdx = 0;
    
    const csv = fs.openSync(paths.ledgerCSVPath, 'r')
    const data = fs.readFileSync(paths.ledgerCSVPath, 'utf-8')
    const row = data.split("\n");
    const rowIdx = row.length - 1;
    for (let i = 0; i < rowIdx; i++) {
        existingItemFlag = false;

        let eachrow = {};
        eachrow = row[i].split(',');
        let itemCode = eachrow[2];
        let itemName = eachrow[3];
        let depositNum = parseInt(eachrow[4]);
        let withdrawNum = parseInt(eachrow[5]);
        console.log(`Current Raw Information : ${itemCode},${itemName},${depositNum},${withdrawNum}`);

        for(let j = 0; j < items.length; j++) {
            console.log(`check if it is existing item in array`)
            if(items[j].itemCode == itemCode){
                existingItemFlag = true;
                itemIdx = j;
                console.log(`It exists!`)
            }
        }
        
        if(existingItemFlag){
            console.log('existing Item : ')
            items[itemIdx].depositNum += depositNum;
            items[itemIdx].withdrawNum += withdrawNum;
            items[itemIdx].stock = items[itemIdx].stock + depositNum - withdrawNum;
            items[itemIdx].total = items[itemIdx].total + (depositNum - withdrawNum) * items[itemIdx].price;
            console.log(items[itemIdx])
        }
         
        else if (!existingItemFlag){
            item = {
                'itemCode': itemCode,
                'itemName': itemName,
                'depositNum': depositNum,
                'withdrawNum': withdrawNum,
                'stock': depositNum - withdrawNum,
                'price': 100,
                'total': (this.depositNum - this.withdrawNum) * this.price,
                'note': '-'
            }
            console.log(item)
            items.push(item);
            items.sort(function(a,b) {
                return a.itemCode < b.itemCode ? -1 : a.itemCode > b.itemCode ? 1 : 0;
            })
        }
    }

    console.log(`Finished Item Array : ${items}`)
    
    for (let j = 0; j < items.length; j++){
        AddStockRow(hTbody, items[j]);
    }

    fs.closeSync(csv);
}

function AddStockRow(table, item) {
    const newRow0 = table.insertRow();
    const newCell0 = newRow0.insertCell();
    const newCell1 = newRow0.insertCell();
    const newCell2 = newRow0.insertCell();
    const newCell3 = newRow0.insertCell();
    const newCell4 = newRow0.insertCell();
    const newCell5 = newRow0.insertCell();
    const newCell6 = newRow0.insertCell();
    const newCell7 = newRow0.insertCell();

    newCell0.innerHTML = item.itemCode;
    newCell1.innerHTML = item.itemName;
    newCell2.innerHTML = item.depositNum;
    newCell3.innerHTML = item.withdrawNum;
    newCell4.innerHTML = item.stock;
    newCell5.innerHTML = item.price;
    newCell6.innerHTML = item.total;
    newCell7.innerHTML = item.note;
}