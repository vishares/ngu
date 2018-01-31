"use strict";
var mysql = require("mysql");
var RSI = require('technicalindicators').RSI;
var symbolConf = require("./symbolConf");
var moment=require('moment-timezone')
var kite = require('./kite')
let sellSignal={};
let buySignal={};

var interval,rsiLower=0,rsiHigher=0,marginRSILower=0,marginRSIHigher=0, highTimer,lowTimer;
function rsiAlgo(con) {
    symbolConf.getTradingList(con, (list) => {
        list.forEach((symbol)=>{
            sellSignal[symbol]={enabled:false,times:0};
            buySignal[symbol]={enabled:false,times:0};
                 });
      
       var autoRsi = () => {

            if (symbolConf.isInstrumentUpdated()) {
                symbolConf.updateInstrument(false);
                symbolConf.getTradingList(con, (listupdated) => {
                    listToUpdate(con, list);
                    list=listupdated;
                });
            }

            else {
                listToUpdate(con, list);
            }

        }
        var ONE_MINUTE = 60 * 1000;
        
       
        function repeatEvery(func, interval) {
            // Check current time and calculate the delay until next interval
            var now = new Date(),
                delay = interval - now % interval+2500;
        
            function start() {

                func();
                // ... and every interval
                setInterval(func, interval);
            }
        
            setTimeout(start, delay);
        }
        repeatEvery(autoRsi, ONE_MINUTE);
    });

   

}

var listToUpdate = (con, list) => {
    rsiLower=0,rsiHigher=0;
   
    list.forEach((item) => {
        rsiPlaceOrder(con, item,list)
    });
  
    console.log("=====================================================")
    
}

function rsiPlaceOrder(con, item,list) {
    var ohlc = [], closeRSI = [],RSIValue;
    let o, h, l, c;
    symbolConf.getInstruments(con, item, (option) => {
        // let sql = `select ltp as close ,DATE_FORMAT(` + 'time' + `, '%H:%i') AS time from tick_data  where id in (select max(id) from tick_data  where token='${item}'  and time < DATE_SUB(now(), INTERVAL 1 MINUTE) group by UNIX_TIMESTAMP(time) DIV 60) ;`

        // con.query(sql, function (err, result) {
        //     if (err) throw err;
        //     c = result;
        // });
let currentDate=moment().tz('Asia/Calcutta').format('HH:mm');
        let sql3 = `select t1.close,t2.time,t2.low,t2.high,t2.open from
        
                    (select ltp as open, min(ltp) as low, max(ltp) as high, DATE_FORMAT(`+'`time`'+`,'%H:%i') as time from tick_data  where token='${item}' and time <'${currentDate}' group by UNIX_TIMESTAMP(time) DIV 60 )  t2 inner join
        
                    (select ltp as close,DATE_FORMAT(`+'`time`'+`,'%H:%i') as time  from tick_data where id in  (select max(id) as maxid from tick_data where token='${item}' and time <'${currentDate}' group by UNIX_TIMESTAMP(time) DIV 60)) t1    
        
                    on t1.time =t2.time;`
        con.query(sql3, function (err, result) {
            if (err) throw err;
            ohlc = result;
//             console.log(sql);
//             console.log(c.length);
//             ohlc = l.map((value, index) => {

// try{
//    console.log(index);
  
//     closeRSI.push(c[index].close);
// }
// catch(e){
// console.log(e);
// }
               
//                 return { open: value.open, high: value.high, low: value.low, close: c[index].close, time: value.time }
//             });

closeRSI = ohlc.map((ohlcValue)=>{
    return ohlcValue.close;
})
            if (closeRSI.length > 13 && new Date().getHours() < 24) {
               
                RSIValue= validateRSI(closeRSI, option,list,con,ohlc)
            }



            //console.log(ohlc)
        });
    });

}
var validateRSI = function (closeRSI, option,list,con,ohlc) {
    var inputRSI = {
        values: closeRSI,
        period: 14
    };

    var RSI1 = RSI.calculate(inputRSI);

    
    let latestRSI=RSI1[RSI1.length - 1];
   
    // let rsilistValue=""
    // for(let i=RSI1.length-1 ;i>RSI1.length-14;i++){
    //     rsilistValue+=RSI1[i];
    // }
   

    
        if (latestRSI > (option.upperRSI + marginRSIHigher) ) {
            sellSignal[option.token].times++;
            sellSignal[option.token].enabled=true;
            // rsiHigher++;
            // if(rsiHigher/list.length>0.5 && !highTimer){
            //     marginRSIHigher=10;
            //     console.log(">>"+marginRSIHigher);            
            //     highTimer=setTimeout(function(){
            //         clearTimeout(highTimer);
            //         highTimer=null;
            //         marginRSIHigher-=10;
            //     },300000)
            // }
            // kite.placeOrder(Object.assign(option, { transaction_type: "SELL", price: closeRSI[closeRSI.length - 1],quantity:Math.round(Math.pow(option.quantity,latestRSI/option.upperRSI)),squareoff: (option.squareoff+((Math.floor(((latestRSI/5-14)*0.05)*20)/20)))}), (data) => {
            //     console.log(data)
            // },con,latestRSI)
        }
        else if (latestRSI < (option.lowerRSI - marginRSILower) && latestRSI !=0 ) {
           
            buySignal[option.token].enabled=true;
            buySignal[option.token].times++;
            // rsiLower++;
            // if(rsiLower/list.length>0.5 && !lowTimer){
            //     marginRSILower=10;
            //     lowTimer=setTimeout(function(){
            //         clearTimeout(lowTimer);
            //         lowTimer=null;
            //         marginRSILower-=10;
            //     },300000)
            // // }
            // kite.placeOrder(Object.assign(option, { transaction_type: "BUY", price: closeRSI[closeRSI.length - 1],quantity:Math.round((option.quantity*(option.lowerRSI/latestRSI))),squareoff: (option.squareoff+((Math.floor(((6-latestRSI/5)*0.05)*20)/20))) }), (data) => {
            //     console.log(data)
            // },con,latestRSI)
        }
        if(sellSignal[option.token].enabled  && latestRSI < 70  ){
           if(latestRSI >60){
            kite.placeOrder(Object.assign(option, { transaction_type: "SELL", price: closeRSI[closeRSI.length - 1]}), (data) => {
            },con,latestRSI);
          
           }
           sellSignal[option.token].enabled=false;
           sellSignal[option.token].times=0;
               
    //console.log('sell');
            //con.query(`insert into backtest (token,transaction_type,price,quantity,time,squareoff,stoploss) values (${option.token},'SELL',${closeRSI[closeRSI.length - 1]},${option.quantity},'${time}',${option.squareoff}, ${option.stoploss})`);
    
        }
        else if(buySignal[option.token].enabled && latestRSI > 30 && latestRSI < 40){
           
if(latestRSI <40){
    kite.placeOrder(Object.assign(option, { transaction_type: "BUY", price: closeRSI[closeRSI.length - 1]}), (data) => {
    },con,latestRSI);
}
           
            buySignal[option.token].enabled=false;
            buySignal[option.token].times=0;
           // con.query(`insert into backtest (token,transaction_type,price,quantity,time,squareoff,stoploss) values (${option.token},'BUY',${closeRSI[closeRSI.length - 1]},${option.quantity},'${time}',${option.squareoff}, ${option.stoploss})`);
          //  console.log('buy');
        }
        console.log(ohlc[closeRSI.length - 1].time+":"+option.tradingsymbol + ":" + closeRSI[closeRSI.length - 1] + ":" + latestRSI+":"+  sellSignal[option.token].times+ buySignal[option.token].times);

    }

var getInterval = function () {
    return interval;
}

module.exports = { rsiAlgo, getInterval };