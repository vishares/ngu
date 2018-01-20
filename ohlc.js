var mysql = require("mysql");
var RSI = require('technicalindicators').RSI;
var placeOrder =require('./order')
var ip = require("ip");

var con = mysql.createConnection({
    host: ip.address().indexOf("192.168")!=-1?"localhost":"10.128.0.2",
    user: "root",
    password: ip.address().indexOf("192.168")!=-1?"root":"jSiw8bPtEFBB",
    database:"ng"
  });
  var ohlc = [],closeRSI=[];

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    let o, h, l, c;
    let sql = "select ltp as close ,DATE_FORMAT(`time`, '%H:%i') AS `time` from tick_data  where id in (select max(id) from tick_data where token ='381697' group by UNIX_TIMESTAMP(time) DIV 60) ;"
    con.query(sql, function (err, result) {
        if (err) throw err;
        c = result;

    });

    let sql3 = "select ltp as open,min(ltp) as  low, max(ltp) as high,DATE_FORMAT(`time`, '%H:%i') AS `time` from tick_data  where token ='381697' group by UNIX_TIMESTAMP(time) DIV 60  ;"
    con.query(sql3, function (err, result) {
        if (err) throw err;
        l = result;
        ohlc = l.map((value, index) => {

       
              closeRSI.push(c[index].close);
            return { open: value.open, high:value.high, low: value.low, close: c[index].close, time: value.time }
        })
        var inputRSI = {
            values :closeRSI,
            period : 14
          };
          var RSI1=RSI.calculate(inputRSI);
          RSI1.forEach((element,index) => {
                console.log(element);
                console.log(ohlc[index+13]);
              //  placeOrder()
              
              
          });
       
        //console.log(ohlc)
    });

});


