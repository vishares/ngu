var KiteTicker = require("kiteconnect").KiteTicker;
var kite =require("./kite");
var moment = require('moment-timezone')

var mysql=require("mysql");
var symbolConf=require("./symbolConf");
var ip = require("ip");
var fs=require('fs');

var db_config = {
  host: ip.address().indexOf("192.168")!=-1?"localhost":"localhost",
  user: ip.address().indexOf("192.168")!=-1?"root":"ngufastc_root",
  password: ip.address().indexOf("192.168")!=-1?"root":"Qwerty1!",
  database:ip.address().indexOf("192.168")!=-1?"ng":"ngufastc_db"
};

var con;

function handleDisconnect() {
  con = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

                                                  con.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
                                          con.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect()


module.exports ={connect:function(){
    var ticker = new KiteTicker({
        api_key: "20cn5uuajhjwuew9",
        user_id: "YP5758",
        access_token: JSON.parse(fs.readFileSync("./properties.json")).access_token
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
            var date=moment(tick.timestamp).tz('Asia/Calcutta').format('HH:mm:ss');
            var sql = `Insert into tick_data (ltp,token,time,quantity) values (${tick.last_price},${tick.instrument_token},'${date}',${tick.volume});`;
            con.query(sql, function (err, result) {
                if (err) throw err;
              });
             }
       }
    
    function subscribe() {
   //   var items = [3375873];
      console.log("subscribe")
      symbolConf.getTradingList(con,(items)=>{
        ticker.subscribe(items);
        ticker.setMode(ticker.modeFull, items);
      });    
       
    }

   

    ticker.connect();
    return ticker;
},con}