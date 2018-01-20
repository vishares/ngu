var fs = require("fs");
totalBrokerage = 0;
totalSTT = 0;
totalTC = 0;
otherCharges=0;
pl=0;
gst = 0;
var test = fs.readFileSync("./test1.json")
var orders = JSON.parse(test);

var position = JSON.parse(fs.readFileSync("./test2.json"))
position.day.forEach((pos)=>{
   pl+=(pos.unrealised);
})
console.log(pl);

var completedOrders = orders.forEach((order) => {

    if (order.status == "COMPLETE") {
        let value = (order.average_price * order.quantity)
        let brokerage = value * (0.01 / 100)
        totalBrokerage += brokerage > 20 ? 20 : brokerage;
        if (order.transaction_type == "SELL") {
            totalSTT += value * (0.024878 / 100);
        }
        totalTC += value * (0.0000325);

        otherCharges+=value * 0.00006 +value *0.0000015
   
    }

});
gst = (totalBrokerage +totalTC) * (0.18)

console.log(totalBrokerage + gst + totalSTT + totalTC+otherCharges);
console.log(pl-(totalBrokerage + gst + totalSTT + totalTC+otherCharges));
