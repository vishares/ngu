
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
var con = mysql.createConnection({
    host: ip.address().indexOf("192.168")!=-1?"localhost":"10.128.0.2",
    user: "root",
    password: ip.address().indexOf("192.168")!=-1?"root":"jSiw8bPtEFBB",
    database:"ng"
  });
var kite = require("./kite");



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
    })
})

router.get("/connect",(req,res)=>{
    ticker.connect();
    autoOrder.rsiAlgo(ticker.con);
    res.send({status:"0000"})
})

router.get("/clear",(req,res)=>{
 
   clearInterval(autoOrder.getInterval());
    res.send({status:autoOrder.interval})
});

router.get("/getInstruments",(req,res)=>{
    let sql = `select * from instruments`;
    executeQuery(sql,res);    

});


router.post("/updateInstrument",(req,res)=>{
   
    symbolConf.updateInstrument(true);
   

    let sql = `update instruments set quantity=${req.body.quantity}, squareoff_value=${req.body.squareoff_value},stoploss_value=${req.body.stoploss_value},upperRSI=${req.body.upperRSI},lowerRSI=${req.body.lowerRSI},isEnabled=${!!req.body.isEnabled?'1':'0'} where token=${req.body.token}`;
    executeQuery(sql,res);    

   

});   

router.post("/addInstrument",(req,res)=>{
    symbolConf.updateInstrument(true);
    let sql = `insert into instruments values (${req.body.token},'${req.body.tradingsymbol}',${req.body.quantity}, ${req.body.squareoff_value},${req.body.stoploss_value},${req.body.upperRSI},${req.body.lowerRSI},${!!req.body.isEnabled?'1':'0'} )`;
    console.log(sql);
    executeQuery(sql,res);    

   

});   


var executeQuery=(sql,res)=>{
    var con = mysql.createConnection({
        host: ip.address().indexOf("192.168")!=-1?"localhost":"10.128.0.2",
        user: "root",
        password: ip.address().indexOf("192.168")!=-1?"root":"jSiw8bPtEFBB",
        database:"ng"
      });    con.connect(function (err) {
        if (err) throw err;
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
           
        });
 });

}


module.exports = router;
