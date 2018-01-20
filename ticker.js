var KiteTicker = require("kiteconnect").KiteTicker;
var ticker = new KiteTicker("20cn5uuajhjwuew9", "YP5758", "test");
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

ticker.on("tick", setTick);
ticker.on("connect", subscribe);

ticker.on("noreconnect", function() {
    console.log("noreconnect")
});

ticker.on("reconnecting", function(reconnect_interval, reconnections) {
    console.log("Reconnecting: attempet - ", reconnections, " innterval - ", reconnect_interval);
});

function setTick(ticks) {
    for(tick of ticks){
        var sql = `Insert into tick_data (ltp,token,time,quantity) values (${tick.LastTradedPrice},${tick.Token},NOW(),${tick.LastTradeQuantity});`;
       
        con.query(sql, function (err, result) {
            if (err) throw err;
          });
         }
   }

function subscribe() {
  //  var items = [3375873,3463169,2933761];
  symbolConf.getTradingList(con,(items)=>{
    ticker.subscribe(items);
    ticker.setMode(ticker.modeFull, items);
  });    
   
}
module.exports ={connect:function(){
    ticker.connect();
},con}