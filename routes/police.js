const express = require("express");
const router = express.Router();
const passport = require("passport");
const isLoggedIn = require('../utils/isLoggedIn');
 const Police  = require('./../models/police');
const User = require('./../models/user');
const checkStatus = require('./../utils/checkStatus');


router.get('/dashboard', isLoggedIn,checkStatus, async (req, res) => {
    try {
        const user = await Police.findById(req.user._id);
        res.render('policeDashboard', { user });
    } catch (e) {
        console.log(e);
    }
});

router.get('/register', function (req, res) {
    res.render('policeRegister');
});

router.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('dashboard');
    }
    res.render('policeLogin');
});

router.post('/register', function (req, res) {
    //console.log("Police request recieved.");
    const newPolice = new Police({ username: req.body.username, email: req.body.email, status: "police" });
    Police.register(newPolice, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/police/register');
        }
        passport.authenticate('policeLogin')(req, res, function () {
            res.redirect('dashboard');
        });
    });
});

router.post("/login", passport.authenticate("policeLogin", {
    failureRedirect: "/police/login",
    failureFlash: true
}), function (req, res) {

    console.log(req.body)
    res.redirect('dashboard');
});


module.exports = router;