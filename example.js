var fs = require("fs");

orders = JSON.parse(fs.readFileSync("test.json"));
//console.log(orders);

completedOrders = orders.data.filter((order) => {

    return order.status == "COMPLETE"
});

// completedOrders.forEach(element => {
//     if(element.tradingsymbol  =="RCOM"){
//         console.log("==============================================================================================")
//         console.log(`${element.order_id} | ${element.parent_order_id} | ${element.order_timestamp} | ${element.tradingsymbol} | ${element.transaction_type} | ${element.quantity} | ${element.price} `  )
//         console.log("==============================================================================================")
//     }

// });

let rcomparent = completedOrders.filter((element) => {
    return element.tradingsymbol == "RCOM" && element.parent_order_id != "";
});
totalProfit=0;
rcomparent.forEach(element => {
    let parentOrder = completedOrders.find((data) => {
        return data.order_id == element.parent_order_id;
    })
    let profit;
    let TotalCharges=0;
    if (parentOrder.transaction_type == "BUY") {
        profit = (element.price ==0?element.trigger_price:element.price) - parentOrder.price;

    }
    else {
        profit = parentOrder.price - (element.price ==0?element.trigger_price:element.price);
    }
   
   console.log( parentOrder.price)
   console.log( (element.price ==0?element.trigger_price:element.price))
   console.log(profit*element.quantity)
   totalProfit+=profit*element.quantity;
   
});
console.log(totalProfit);

// completedOrders.forEach(element => {
//     completedOrders.find((value)=>{
// return value.element.order_id =element
//     })
//     if(element.tradingsymbol  =="RCOM"){
//         console.log("==============================================================================================")
//         console.log(`${element.order_id} | ${element.parent_order_id} | ${element.order_timestamp} | ${element.tradingsymbol} | ${element.transaction_type} | ${element.quantity} | ${element.price} `  )
//         console.log("==============================================================================================")
//     }
   
// });
