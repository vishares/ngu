var KiteTicker = require("kiteconnect").KiteTicker;
var kite =require("./kite");
var moment=require('moment');

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
module.exports ={connect:function(){
    var ticker = new KiteTicker({
        api_key: "20cn5uuajhjwuew9",
        user_id: "YP5758",
        access_token: kite.access_token
    });

      ticker.autoReconnect(true, 300, 5)
      
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
            var date=moment(tick.timestamp).format('HH:mm:ss');
            var sql = `Insert into tick_data (ltp,token,time,quantity) values (${tick.last_price},${tick.instrument_token},'${date}',${tick.last_quantity});`;
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

   

    ticker.connect();
    return ticker;
},con}