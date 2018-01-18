
var mysql = require("mysql");
var RSI = require('technicalindicators').RSI;
var symbolConf = require("./symbolConf");
var kite = require('./kite')

var interval,rsiLower=0,rsiHigher=0,marginRSILower=0,marginRSIHigher=0, highTimer,lowTimer;
function rsiAlgo(con) {
    symbolConf.getTradingList(con, (list) => {
        autoRsi = () => {

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
        setTimeout(() => {
            autoRsi();
            interval = setInterval(autoRsi, 60000);
        }, (58 - new Date().getSeconds()) * 1000);

    });



}

listToUpdate = (con, list) => {
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
        let sql = `select ltp as close ,DATE_FORMAT(` + 'time' + `, '%H:%i') AS time from tick_data  where id in (select max(id) from tick_data where token ='${item}' group by UNIX_TIMESTAMP(time) DIV 60) ;`

        con.query(sql, function (err, result) {
            if (err) throw err;
            c = result;
        });

        let sql3 = `select ltp as open,min(ltp) as  low, max(ltp) as high,DATE_FORMAT(` + 'time' + `, '%H:%i') AS time from tick_data  where token ='${item}' group by UNIX_TIMESTAMP(time) DIV 60  ;`
        con.query(sql3, function (err, result) {
            if (err) throw err;
            l = result;
            ohlc = l.map((value, index) => {


                closeRSI.push(c[index].close);
                return { open: value.open, high: value.high, low: value.low, close: c[index].close, time: value.time }
            })

            if (closeRSI.length > 13 && new Date().getHours() < 15) {
                RSIValue= validateRSI(closeRSI, option,list)
            }



            //console.log(ohlc)
        });
    });

}
validateRSI = function (closeRSI, option,list) {
    var inputRSI = {
        values: closeRSI,
        period: 14
    };

    var RSI1 = RSI.calculate(inputRSI);

    
    let latestRSI=RSI1[RSI1.length - 1];
    console.log(option.tradingsymbol + ":" + closeRSI[closeRSI.length - 1] + ":" + latestRSI+ ":" + marginRSIHigher+ ":" + marginRSILower);
    if (latestRSI > (option.upperRSI + marginRSIHigher)) {
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
        kite.placeOrder(Object.assign(option, { transaction_type: "SELL", price: closeRSI[closeRSI.length - 1],quantity:Math.round(Math.pow(option.quantity,latestRSI/option.upperRSI)),squareoff_value: (option.squareoff_value+((Math.floor(((latestRSI/5-14)*0.05)*20)/20)))}), (data) => {
            console.log(data)
        })
    }
    else if (latestRSI < (option.lowerRSI - marginRSILower)) {
        // rsiLower++;
        // if(rsiLower/list.length>0.5 && !lowTimer){
        //     marginRSILower=10;
        //     lowTimer=setTimeout(function(){
        //         clearTimeout(lowTimer);
        //         lowTimer=null;
        //         marginRSILower-=10;
        //     },300000)
        // }
        kite.placeOrder(Object.assign(option, { transaction_type: "BUY", price: closeRSI[closeRSI.length - 1],quantity:Math.round((option.quantity*(option.lowerRSI/latestRSI))),squareoff_value: (option.squareoff_value+((Math.floor(((6-latestRSI/5)*0.05)*20)/20))) }), (data) => {
            console.log(data)
        })
    }

}

getInterval = function () {
    return interval;
}

module.exports = { rsiAlgo, getInterval };