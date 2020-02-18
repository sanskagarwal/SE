const express = require("express");
const router = express.Router();

router.get('/', function (req, res) {
    res.render('index');
});

router.get("/logout", function (req, res) {
    req.logout();
    if (req.session) {
        req.session.destroy((err) => {
            if (err) console.log('Error : Failed to destroy the session during logout.', err);
            req.user = null;
            res.redirect('/');
        });
    }
});

router.get("/report",function(req,res){
    res.render('report');
});

router.post("/report",function(req,res){

});



module.exports = router;