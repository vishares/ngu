var KiteConnect = require("kiteconnect").KiteConnect;


var kc = new KiteConnect("20cn5uuajhjwuew9");
kc.setAccessToken("kzyjs2qg578c0j7d5v4xb8a1ruvvwhhb")
module.exports= function placeOrder(){
    kc.orderPlace({  tradingsymbol: 'RCOM', transaction_type: "SELL", quantity: 10 }, "bo").then((response) => { console.log(response) }).catch((error) => {
        console.error(error);
    })
} 
 