"use strict";
var isChanged=false;

function isInstrumentUpdated(){
    return isChanged;

}

function updateInstrument(value){
    isChanged=value;
    
    }

var getTradingList = (con,cb) => {

    let sql = `select token from instruments where isEnabled =1;`
    
    con.query(sql, function (err, result) {
        if (err) throw err;
   
        cb(result.map((data) => {
            return data.token
        }))
    });

   
}

var getInstruments=(con,token,cb)=>{
    let sql = `select * from instruments where token =${token};`
    
    con.query(sql, function (err, result) {
        if (err) throw err;
        cb(result[0]); 
    });

    
}


module.exports ={getTradingList,getInstruments,isInstrumentUpdated,isChanged,updateInstrument};