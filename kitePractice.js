

var KiteConnect = require("kiteconnect").KiteConnect;
var mysql = require('mysql');
var KiteTicker = require("kiteconnect").KiteTicker;

var fs=require("fs");
var kc = new KiteConnect({api_key: "20cn5uuajhjwuew9"});
 kc.setAccessToken("ggx48ll13mpsy545o4cxmocd6zs7gbjs")
console.log(kc.getLoginURL())
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


kc.getPositions()
.then(function (response) {
    fs.writeFileSync("./test2.json",JSON.stringify(response));
    //console.log(response)
}).catch(function (err) {
    // Something went wrong.
});

kc.getOrders().then(function (response) {
     fs.writeFileSync("./test1.json",JSON.stringify(response));
      console.log(response)
  }).catch(function (err) {
      // Something went wrong.
  });

var ticker = new KiteTicker({
    api_key: "20cn5uuajhjwuew9",
    user_id: "YP5758",
    access_token: "ggx48ll13mpsy545o4cxmocd6zs7gbjs"
});
ticker.connect();
var mysql=require("mysql");
var symbolConf=require("./symbolConf");
var ip = require("ip");

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

ticker.autoReconnect(true, -1, 5)

ticker.on("ticks", setTick);
ticker.on("connect", subscribe);
ticker.on("order_update",(data)=>{
//console.log(data);
})

ticker.on("noreconnect", function() {
    console.log("noreconnect")
});

ticker.on("reconnecting", function(reconnect_interval, reconnections) {
    console.log("Reconnecting: attempet - ", reconnections, " innterval - ", reconnect_interval);
});

function setTick(ticks) {
    for(tick of ticks){
        var date=new Date(tick.timestamp).toISOString().slice(11, 19);
      //  console.log(date);
        var sql = `Insert into tick_data (ltp,token,time,quantity) values (${tick.last_price},${tick.instrument_token},'${date}',${tick.last_quantity});`;
       //console.log(tick);
        con.query(sql, function (err, result) {
            if (err) throw err;
          });
         }
   
}

function subscribe() {
    var items = [3375873];
  //symbolConf.getTradingList(con,(items)=>{
    ticker.subscribe(items);
    ticker.setMode(ticker.modeFull, items);
  //});    
   
}