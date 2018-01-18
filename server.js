var express=require('express');
var login=require('./login');
var transaction=require('./transaction');
var app=express();



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  var bodyParser = require('body-parser')
  app.use( bodyParser.json() );  
 
  app.use(express.static(__dirname + '/Angular/ZerodhaClient/dist/')); 

app.use('/zr',transaction)
app.listen(8080,()=>{
    console.log('listening');
})

