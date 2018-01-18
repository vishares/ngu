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
 
  app.use(express.static(__dirname + '/dist/')); 

app.use('/zr',transaction)
app.listen(process.env.OPENSHIFT_NODEJS_PORT  || 8080,process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',()=>{
    console.log('listening');
})

