const express = require("express");
const router = express.Router();
const Criminal = require('./../models/criminal');


router.get("/list",function(req,res){
    Criminal.find(function(err,list){
        res.send(list);
    });
});

router.get("/report",function(req,res){
    res.render('reportCriminal');
});


router.post("/report",function(req,res){
    var data = [{
        name:req.body.name,
        gender:req.body.gender,
        crimeType:req.body.crimeType,
        region:req.body.region,
        danger:req.body.danger,
        age:req.body.age
    }];
    //console.log(data);
    Criminal.create(data,(err,data)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(data[0].name+" submitted.");
        }
    });
    res.redirect('report');

});

module.exports = router;