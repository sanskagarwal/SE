const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require('./../models/user');
const isLoggedIn = require('../utils/isPoliceLoggedIn');
const Police  = require('./../models/police');


router.get('/dashboard', isLoggedIn, async (req, res) => {
    try {
        console.log(req.user);
        const user = await Police.findById(req.user._id);
        res.render('dashboard', { user });
    } catch (e) {
        console.log(e);
    }
});

router.get('/register', function (req, res) {
    res.render('policeregister');
});

router.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render('policelogin');
});

router.post('/register', function (req, res) {
    //console.log("Police request recieved.");
    const newPolice = new Police({ username: req.body.username, email: req.body.email,status: "police" });
    Police.register(newPolice, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/dashboard');
        });
    });
});

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/police/login",
    failureFlash: true
}), function (req, res) {

    console.log(req.body)
    res.redirect('/police/dashboard');
});




module.exports = router;