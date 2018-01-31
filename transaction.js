

"use strict";
var ip = require("ip");

var express = require('express');
var login = require('./login');
var url = require("url");
var ticker=require("./ticker");
var autoOrder = require("./autoOrder");
var mysql = require("mysql");
var symbolConf=require("./symbolConf");
var router = express.Router();
var tickerInstance=null;
var kite = require("./kite");



  

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


  tickerInstance=ticker.connect();
  autoOrder.rsiAlgo(ticker.con);

router.get("/getLoginUrl", (req, res) => {
    res.send({ url: kite.getLoginUrl() });
});

router.get("/setRequestToken", (req, res) => {
console.log("setRequestToken");
    kite.startTranscation(url.parse(req.url, true).query.request_token);
    res.send({ status: "0000" });
})

router.get("/setAccessToken", (req, res) => {

    res.send({ status: "0000" });
})
router.get("/getPosition", (req, res) => {
    kite.getPositions((data) => {
        res.send(data);
    })

})

router.get("/getMargin", (req, res) => {
    kite.getMargin((data) => {
        res.send(data);
    })

})

router.post("/placeOrder", (req, res) => {

    let options = req.body;

   // options = { exchange: "NSE", tradingsymbol: 'RCOM', validity: "DAY", transaction_type: "SELL", quantity: 2, price: "0", squareoff_value: ".2", stoploss_value: ".5" };
    kite.placeOrder(options, (data) => {
        res.send(data);
    },con,-1)
})

router.get("/connect",(req,res)=>{
    disconnect();
    tickerInstance=ticker.connect();
    autoOrder.rsiAlgo(ticker.con);
    res.send({status:"0000"})
})

router.get("/clear",(req,res)=>{
 disconnect();
 res.send({status:autoOrder.interval})
});

router.get("/getInstruments",(req,res)=>{
    let sql = `select * from instruments`;
    executeQuery(sql,res);    

});


router.post("/updateInstrument",(req,res)=>{
   
    symbolConf.updateInstrument(true);
   

    let sql = `update instruments set quantity=${req.body.quantity}, squareoff=${req.body.squareoff},stoploss=${req.body.stoploss},upperRSI=${req.body.upperRSI},lowerRSI=${req.body.lowerRSI},isEnabled=${!!req.body.isEnabled?'1':'0'} where token=${req.body.token}`;
    executeQuery(sql,res);    

   

});   

router.post("/addInstrument",(req,res)=>{
    symbolConf.updateInstrument(true);
    let sql = `insert into instruments values (${req.body.token},'${req.body.tradingsymbol}',${req.body.quantity}, ${req.body.squareoff},${req.body.stoploss},${req.body.upperRSI},${req.body.lowerRSI},${!!req.body.isEnabled?'1':'0'},-1 )`;
    console.log(sql);
    executeQuery(sql,res);    

   

});   


var executeQuery=(sql,res)=>{
 
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
           
        });
 

}
function disconnect(){
    tickerInstance.disconnect();
    clearInterval(autoOrder.getInterval());
     
}


module.exports = router;
