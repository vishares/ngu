var mysql=require("mysql");
var symbolConf=require("./symbolConf");
var ip = require("ip");

var KiteConnect = require("kiteconnect").KiteConnect;
var mysql = require('mysql');
var KiteTicker = require("kiteconnect").KiteTicker;

var fs=require("fs");
var kc = new KiteConnect({api_key: "20cn5uuajhjwuew9"});
 kc.setAccessToken("UPOEvkkFUVD2AlQ66GLsNUlspg7uyzOL")
console.log(kc.getLoginURL())
var con = mysql.createConnection({
    host: ip.address().indexOf("192.168")!=-1?"localhost":"10.128.0.2",
    user: "root",
    password: ip.address().indexOf("192.168")!=-1?"root":"jSiw8bPtEFBB",
    database:"ng"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  token=4574465;

// kc.requestAccessToken("w0wgnpqlnpife40zqa35cclfhz0ummab", "xr4nbe9v92q1x5y0omxbdqdks09uxar9")
// 	.then(function(response) {
//         console.log(response);
// 	//	init();
// 	})
// 	.catch(function(err) {
// 		console.log(err.response);
// 	})

// kc.generateSession("G2bGUVh1oEx7ebdcqDRyj0KuHrzeutdt", "xr4nbe9v92q1x5y0omxbdqdks09uxar9")
// .then(function(response) {
//     accessToken=response.access_token;
//     console.log(accessToken);

// })
// .catch(function(err) {
//     console.log(err);
// })


// kc.getPositions()
// .then(function (response) {
//     fs.writeFileSync("./test2.json",JSON.stringify(response));
//     //console.log(response)
// }).catch(function (err) {
//     // Something went wrong.
// });

// kc.getOrders().then(function (response) {
//      fs.writeFileSync("./test1.json",JSON.stringify(response));
//       console.log(response)
//   }).catch(function (err) {
//       // Something went wrong.
//   });
// options={  tradingsymbol: 'RCOM', transaction_type: "SELL", quantity: 10,exchange:"NSE",order_type:"LIMIT" ,price:0,squareoff:0.5,stoploss:1};
// kc.placeOrder("bo",options).then((response) => {
    
//     kc.getOrderHistory(response.order_id).then((data)=>{
//         let temp=data[1];
//         var sql = `Insert into order_details (order_id,parent_order_id,status,status_message,tradingsymbol,instrument_token,transaction_type,quantity,price,cancelled_quantity,filled_quantity,stoploss,squareoff) values ('${temp.order_id}','${temp.parent_order_id}','${temp.status}','${temp.status_message}','${temp.tradingsymbol}',${temp.instrument_token},'${temp.transaction_type}',${temp.quantity},${temp.price},${temp.cancelled_quantity},${temp.filled_quantity},${options.stoploss},${options.squareoff});`;
//         console.log(sql);
//         //console.log(tick);
//          con.query(sql, function (err, result) {
//              if (err) throw err;
//            });
       
//         }).catch(error=>{
//             console.log(error);
//         });
//   }).catch((error) => {
//     console.error(error);
// })




var ticker = new KiteTicker({
    api_key: "20cn5uuajhjwuew9",
    user_id: "YP5758",
    access_token: "UPOEvkkFUVD2AlQ66GLsNUlspg7uyzOL"
});
ticker.connect();



ticker.autoReconnect(true, 300, 5)

ticker.on("ticks", setTick);
ticker.on("connect", subscribe);
ticker.on("order_update",(temp)=>{
  var sql = `update order_details set parent_order_id='${temp.parent_order_id}',status='${temp.status}',status_message='${temp.status_message}',price=${temp.price},cancelled_quantity=${temp.cancelled_quantity},filled_quantity=${temp.filled_quantity} where order_id='${temp.order_id}';`
  console.log(sql);
  //console.log(tick);
   con.query(sql, function (err, result) {
       if (err) throw err;
       
     });

})

ticker.on("noreconnect", function() {
    console.log("noreconnect")
});

ticker.on("reconnecting", function(reconnect_interval, reconnections) {
    console.log("Reconnecting: attempet - ", reconnections, " innterval - ", reconnect_interval);
});

function setTick(ticks) {
  // var sql = `update instruments set new_token=${ticks[0].instrument_token} where token=${token};`;
  //         con.query(sql, function (err, result) {
  //           if (err) throw err;
  //         });
      // for(tick of ticks){
    //     console.log(tick.timestamp)
    //     var date=new Date(tick.timestamp).toISOString().slice(11, 19);
    //   //  console.log(date);
    //     var sql = `Insert into tick_data (ltp,token,time,quantity) values (${tick.last_price},${tick.instrument_token},'${date}',${tick.last_quantity});`;
    //    //console.log(tick);
    //     con.query(sql, function (err, result) {
    //         if (err) throw err;
    //       });
    //      }
   
}

function subscribe() {
    console.log("subsricbe")
    
    var items = [token];
  //symbolConf.getTradingList(con,(items)=>{
    ticker.subscribe(items);
    ticker.setMode(ticker.modeFull, items);
  //});    
}
// }
// //var KiteTicker = require("kiteconnect").KiteTicker;
// var ticker = new KiteTicker({
//     api_key: "20cn5uuajhjwuew9",
//     user_id: "YP5758",
//     access_token: "Auiu0vh4LKtvvbVgcuUfUFuJIFcgvG2m"
// });


// ticker.connect();
// ticker.on("ticks", onTicks);
// ticker.on("connect", subscribe);

// function onTicks(ticks) {
//     console.log("Ticks", ticks);
// }

// function subscribe() {
//     console.log("subsrcibe")
//     var items = [738561];
//     ticker.subscribe(items);
//     ticker.setMode(ticker.modeFull, items);
// }

