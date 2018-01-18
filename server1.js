var KiteConnect = require("kiteconnect").KiteConnect;
var mysql = require('mysql');

var kc = new KiteConnect("20cn5uuajhjwuew9");
kc.setAccessToken("kzyjs2qg578c0j7d5v4xb8a1ruvvwhhb")
console.log(kc.loginUrl())
// kc.requestAccessToken("w0wgnpqlnpife40zqa35cclfhz0ummab", "xr4nbe9v92q1x5y0omxbdqdks09uxar9")
// 	.then(function(response) {
//         console.log(response);
// 	//	init();
// 	})
// 	.catch(function(err) {
// 		console.log(err.response);
// 	})

init();
function init() {
    // Fetch equity margins.
    // You can have other api calls here.

    kc.margins("equity")
        .then(function (response) {
        }).catch(function (err) {
            // Something went wrong.
        });
    kc.quote("NSE", "RCOM").then((response) => {
        console.log(JSON.stringify(response));
    })

    // console.log(kc.loginUrl());
    // kc.orderPlace({ exchange: "NSE", tradingsymbol: 'RCOM', validity: "DAY", transaction_type: "SELL", quantity: 50, price: "35.05", squareoff_value: ".20", stoploss_value: ".5" }, "bo").then((response) => { console.log(response) }).catch((error) => {
    //     console.error(error);
    // })
//     kc.positions().then((response)=>{
// console.log(JSON.stringify(response));
//     })
kc.orders("180103001570812").then((response)=>{
//console.log(response);
}).
catch((error)=>{
console.log(error)})

}
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database:"ng"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

var KiteTicker = require("kiteconnect").KiteTicker;
var ticker = new KiteTicker("20cn5uuajhjwuew9", "YP5758", "test");

ticker.connect();
ticker.on("tick", setTick);
ticker.on("connect", subscribe);

function setTick(ticks) {
    for(tick of ticks){
        var sql = `Insert into tick_data (ltp,token,time,quantity) values (${tick.LastTradedPrice},${tick.Token},NOW(),${tick.LastTradeQuantity});`;
       console.log(sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Result: " + result);
          });
         }
   
  
}

function subscribe() {
    var items = [3375873,3463169,2933761];
    ticker.subscribe(items);
    ticker.setMode(ticker.modeQuote, items);
}

