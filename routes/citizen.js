const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require('./../models/user');
const isLoggedIn = require('../utils/isPoliceLoggedIn');

router.get('/register', function (req, res) {
    res.render('register');
});


router.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render('login');
});


router.post('/register', function (req, res) {
    const newUser = new User({ username: req.body.username, email: req.body.email,status: 'citizen' });
    User.register(newUser, req.body.password, function (err, user) {
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
    failureRedirect: "/login",
    failureFlash: true
}), function (req, res) {
    
    res.redirect('/dashboard');
});

module.exports = router;