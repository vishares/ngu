
var symbolConf=require("./symbolConf");

var mysql = require("mysql");
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "ng"
});


var RCOM = {
    token: 3375873,
    tradingsymbol: "RCOM",
    quantity: 40,
    squareoff_value: 0.1,
    stoploss_value: 0.5,
    upperRSI:"20",
    lowerRSI:"25",
}


var JPASSOCIAT = {
    token: 2933761,
    tradingsymbol: "JPASSOCIAT",
    quantity: "40",
    squareoff_value: "0.15",
    stoploss_value: "0.5",
    upperRSI:"75",
    lowerRSI:"20",
}


var GMRINFRA = {
    token: 3463169,
    tradingsymbol: "GMRINFRA",
    quantity: "40",
    squareoff_value: "0.1",
    stoploss_value: "0.5"
}
var IFCI = {
    token: 381697,
    tradingsymbol: "IFCI",
    quantity: "40",
    squareoff_value: "0.1",
    stoploss_value: "0.5"
}
var SINTEX = {
    token: 1492737,
    tradingsymbol: "SINTEX",
    quantity: "40",
    squareoff_value: "0.1",
    stoploss_value: "0.5"
}
var SUZLON = {
    token: 3076609,
    tradingsymbol: "SUZLON",
    quantity: "40",
    squareoff_value: "0.1",
    stoploss_value: "0.5"
}
var NHPC = {
    token: 4454401,
    tradingsymbol: "NHPC",
    quantity: "40",
    squareoff_value: "0.1",
    stoploss_value: "0.5"
}
var ADANIPOWER = {
    token: 4451329,
    tradingsymbol: "ADANIPOWER",
    quantity: "40",
    squareoff_value: "0.1",
    stoploss_value: "0.5"
}

var SOUTHBANK = {
    token: 1522689,
    tradingsymbol: "SOUTHBANK",
    quantity: "40",
    squareoff_value: "0.1",
    stoploss_value: "0.5"
}
var RNAVAL = {
    token: 4465665,
    tradingsymbol: "RNAVAL",
    quantity: "40",
    squareoff_value: "0.15",
    stoploss_value: "0.5",
    upperRSI:"75",
    lowerRSI:"25",
}

var MAHABANK = {
    token: 2912513,
    tradingsymbol: "MAHABANK",
    quantity: "40",
    squareoff_value: "0.1",
    stoploss_value: "0.5"
}

var IDFC = {
    token: 3060993,
    tradingsymbol: "IDFC",
    quantity: "20",
    squareoff_value: "0.15",
    stoploss_value: "0.5"
}

var RPOWER = {
    token: 3906305,
    tradingsymbol: "RPOWER",
    quantity: "20",
    squareoff_value: "0.15",
    stoploss_value: "0.5"
}
var JSWENERGY= {
    token: 4574465,
    tradingsymbol: "JSWENERGY",
    quantity: "20",
    squareoff_value: "0.2",
    stoploss_value: "0.5"
}

var HCC= {
    token: 352001,
    tradingsymbol: "HCC",
    quantity: "20",
    squareoff_value: "0.1",
    stoploss_value: "0.5"
}



var list1 = [GMRINFRA, JPASSOCIAT,SOUTHBANK,SUZLON,IFCI,SINTEX,RCOM,ADANIPOWER,NHPC,RNAVAL,IDFC,RPOWER,JSWENERGY,HCC]



con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
 let list=list1.map((item)=>{
     return item.token;
 })

 console.log(list);

list.forEach(element => {
  
   var selectedSymbol = list1.filter((item) => {
    
    return item.token == element;
});

let item= selectedSymbol[0];
   console.log(item);
   let sql = `insert into instruments (token,tradingsymbol,quantity,squareoff_value,stoploss_value,upperRSI,lowerRSI,isEnabled) values (${item.token},'${item.tradingsymbol}',${item.quantity},${item.squareoff_value},${item.stoploss_value},${item.upperRSI||70},${item.lowerRSI||30},1);`
   console.log(sql);
   con.query(sql, function (err, result) {
       if (err) throw err;
      console.log(JSON.stringify(result));
   });
});

let sql = `select token from instruments where isEnabled =1;`
console.log(sql);
con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result.map((item)=>{return item.token}))
   console.log(JSON.stringify(result));
});

   
});
getConfigfromToken = (list,token) => {
   
}