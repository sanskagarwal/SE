const express = require("express");
const router = express.Router();
const passport = require("passport");
const isLoggedIn = require('../utils/isLoggedIn');
const Police = require('./../models/police');
const Report = require('./../models/report');
const checkStatus = require('./../utils/checkStatus');
const Criminal = require('./../models/criminal');
const sendEmail = require('./../utils/sendEmail');


router.get('/dashboard', isLoggedIn, checkStatus, async (req, res) => {
    try {
        const user = await Police.findById(req.user._id);

        var criminalData = await Criminal.find();

        var reportData = await Report.find({});
        res.render('policeDashboard', { user: user, list: criminalData, reportList: reportData });

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

router.post("/reportSelect", async (req, res) => {
    var _id = req.body.id;

    try {
        await Report.updateOne({ _id }, { $set: { status: 'Appointed', appointedPersonnel: req.user.username } });
        var victimEmail = await Report.findById(_id);
        console.log(victimEmail.victimDetails.email);
        sendEmail(Police.findOne({username:req.user.username}).email,'Report Appointed','You have been appointed the case');
        sendEmail(victimEmail.victimDetails.email,'Case has been appointed',`Your case has been appointed to ${req.user.username} `);

        res.sendStatus(200);
    }
    catch (e) { 
        console.log(e);
        res.sendStatus(500);
    }


})


module.exports = router;