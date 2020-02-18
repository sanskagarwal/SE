const express = require("express");
const router = express.Router();
const passport = require("passport");
const isLoggedIn = require('../utils/isLoggedIn');
 const Citizen = require('./../models/citizen');
const checkStatus = require('./../utils/checkStatus');

router.get('/dashboard', isLoggedIn,checkStatus, async (req, res) => {
    try {
        const user = await Citizen.findById(req.user._id);
        //if (user.status === 'citizen') {
        res.render('citizenDashboard', { user });
        //} else {
        //     res.render('policeDashboard', { user });
        // }
    } catch (e) {
        console.log(e);
    }
});

router.get('/register', function (req, res) {
    res.render('citizenRegister');
});

router.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('dashboard');
    }
    res.render('citizenLogin');
});

router.post('/register', function (req, res) {
    const newCitizen = new Citizen({ username: req.body.username, email: req.body.email, status: "citizen" });
    Citizen.register(newCitizen, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('register');
        }
        passport.authenticate('citizenLogin')(req, res, function () {
            res.redirect('dashboard');
        });
    });
});

router.post("/login", passport.authenticate("citizenLogin", {
    failureRedirect: "login",
    failureFlash: true
}), function (req, res) {

    console.log(req.body)
    res.redirect('dashboard');
});




module.exports = router;