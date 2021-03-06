"use strict";
var fs = require('fs');
var KiteConnect = require("kiteconnect").KiteConnect;
var kc = new KiteConnect({ api_key: "20cn5uuajhjwuew9" });
var kite = {}
var accessToken = ""


console.log("kite");
kc.setAccessToken(JSON.parse(fs.readFileSync("./properties.json")).access_token);
kite.startTranscation = function (requestToken) {
    console.log(requestToken);
    kc.generateSession(requestToken, "xr4nbe9v92q1x5y0omxbdqdks09uxar9")
        .then(function (response) {
            kite.access_token = accessToken = response.access_token;
            console.log(accessToken);
            kc.setAccessToken(accessToken);
            init();
            try {

                var err = fs.writeFileSync('./properties.json', { access_token1: accessToken }, { encoding: 'utf8', flag: 'w' })

                console.log(err);
            }
            catch (e) {
                console.log(e);
            }

        })
        .catch(function (err) {
            console.log(err.response);
        })
}







// function init() {
//     // Fetch equity margins.
//     // You can have other api calls here.

//     kc.margins("equity")
//         .then(function (response) {
//         }).catch(function (err) {
//             // Something went wrong.
//         });
//     kc.quote("NSE", "RCOM").then((response) => {
//        // console.log(JSON.stringify(response));
//     })





// }
kite.getPositions = (cb) => {
    var totalBrokerage = 0;
    var totalSTT = 0;
    var totalTC = 0;
    var otherCharges = 0;
    var pl = 0;
    var gst = 0;
    var symbolPL = {};

    kc.getPositions().then((position) => {
        position.day.forEach((pos) => {
            symbolPL[pos.tradingsymbol] = { pl: pos.unrealised, charges: 0 }
            pl += (pos.unrealised);
        })


        kc.getOrders().then(function (orders) {

            var completedOrders = orders.forEach((order) => {

                if (order.status == "COMPLETE") {

                    let value = (order.average_price * order.quantity)
                    let brokerage = value * (0.01 / 100)
                    totalBrokerage += brokerage > 20 ? 20 : brokerage;
                    let iSTT = 0;
                    if (order.transaction_type == "SELL") {
                        iSTT = value * (0.024878 / 100);
                        totalSTT += iSTT;
                    }
                    let tc = value * (0.0000325);
                    totalTC += tc

                    let indgst = (brokerage + tc) * (0.18);
                    let iocharges = value * 0.00006 + value * 0.0000015;
                    otherCharges += iocharges;
                    symbolPL[order.tradingsymbol].charges = symbolPL[order.tradingsymbol].charges + iocharges + indgst + brokerage + tc + iSTT;
                }

            });


            //console.log(symbolPL)
            let symbols = Object.keys(symbolPL);

            symbols.forEach((symbol) => {
                console.log(symbol + ":" + symbolPL[symbol].charges + ":" + (symbolPL[symbol].pl - symbolPL[symbol].charges))
            })
            gst = (totalBrokerage + totalTC) * (0.18);
            cb({ charges: totalBrokerage + gst + totalSTT + totalTC + otherCharges, pl: pl - (totalBrokerage + gst + totalSTT + totalTC + otherCharges) })

        }).catch(function (err) {
            console.log(err);
        });
    }).catch((e) => {
        console.log(e);
    });

}



kite.getLoginUrl = () => {

    return kc.getLoginURL();
}

kite.getMargin = (cb) => {

    kc.margins("equity").then((response) => {
        cb(JSON.stringify(response));
    })

}

kite.placeOrder = (options, cb, con, latestRSI) => {

    let finalOptions = Object.assign({ exchange: "NSE", validity: "DAY", price: 0, order_type: "LIMIT", squareoff: .1, stoploss: .5 }, options)
    delete finalOptions.token;
    console.log(finalOptions);
    kc.placeOrder("bo",finalOptions).then((response) => {


        kc.getOrderHistory(response.order_id).then((data)=>{
            let temp=data[1];  
            var sql = `Insert into order_details (order_id,parent_order_id,status,status_message,tradingsymbol,instrument_token,transaction_type,quantity,price,cancelled_quantity,filled_quantity,stoploss,squareoff,latestRSI,time) values ('${temp.order_id}','${temp.parent_order_id}','${temp.status}','${temp.status_message}','${temp.tradingsymbol}',${temp.instrument_token},'${temp.transaction_type}',${temp.quantity},${temp.price},${temp.cancelled_quantity},${temp.filled_quantity},${finalOptions.stoploss},${finalOptions.squareoff},${latestRSI},NOW());`;
            //console.log(tick);
             con.query(sql, function (err, result) {
                 if (err) throw err;
                 cb(temp);
               });

            }).catch(error=>{
                console.log(error);
            });

    }).catch((error) => {
        console.error(error);
    })


}



module.exports = kite;