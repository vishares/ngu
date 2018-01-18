var fs=require('fs');
var KiteConnect = require("kiteconnect").KiteConnect;
var kc = new KiteConnect("20cn5uuajhjwuew9");
var kite={}
var accessToken=""
console.log("kite");
kite.startTranscation=function(requestToken){
   console.log(requestToken);
        kc.requestAccessToken(requestToken, "xr4nbe9v92q1x5y0omxbdqdks09uxar9")
    	.then(function(response) {
            accessToken=response.data.access_token
            kc.setAccessToken(accessToken);
    		init();
    	})
    	.catch(function(err) {
    		console.log(err.response);
    	})
    }
   



 


function init() {
    // Fetch equity margins.
    // You can have other api calls here.

    kc.margins("equity")
        .then(function (response) {
        }).catch(function (err) {
            // Something went wrong.
        });
    kc.quote("NSE", "RCOM").then((response) => {
       // console.log(JSON.stringify(response));
    })

   



}
kite.getPositions=(cb)=>{
   
    kc.positions().then((response)=>{
        cb(JSON.stringify(response));
            })
}
kite.getLoginUrl=()=>{

    return kc.loginUrl();
}

kite.getMargin=(cb)=>{

    kc.margins("equity").then((response)=>{
        cb(JSON.stringify(response));
            })

}

kite.placeOrder=(options,cb)=>{

    let finalOptions=Object.assign( { exchange: "NSE", validity: "DAY",  price: "0", squareoff_value: ".1", stoploss_value: ".5" },options)
    delete finalOptions.token;
   console.log(finalOptions);
    kc.orderPlace(finalOptions, "bo").then((response) => { 
       cb(response);
    }).catch((error) => {
        console.error(error);
    })


}

    
module.exports=kite;