var express=require('express');
var router =express.Router();


router.get('/:accessToken',(req,res)=>{
router.accessToken=req.params.accessToken;
res.send('success');
})

module.exports=router;