var mysql =require('mysql');
var ip = require("ip");

function getConnection(){
    var con = mysql.createConnection({
        host: ip.address().indexOf("192.168")!=-1?"localhost":"10.128.0.2",
        user: "root",
        password: ip.address().indexOf("192.168")!=-1?"root":"jSiw8bPtEFBB",
        database:"ng"
      });
      return con;
}



  
module.exports= {con:getConnection};