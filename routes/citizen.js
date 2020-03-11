const express = require("express");
const router = express.Router();
const passport = require("passport");
const isLoggedIn = require('../utils/isLoggedIn');
const sendEmail = require('../utils/sendEmail');
const Citizen = require('./../models/citizen');
const Report = require('./../models/report');
const checkStatus = require('./../utils/checkStatus');
const { TextAnalyticsClient, TextAnalyticsApiKeyCredential } = require("@azure/ai-text-analytics");


require('dotenv').config()

const key = process.env.AZURE_TEXT_ANALYTICS_KEY;
const endpoint = process.env.AZURE_TEXT_ANALYTICS_ENDPOINT;
const textAnalyticsClient = new TextAnalyticsClient(endpoint, new TextAnalyticsApiKeyCredential(key));

router.get('/dashboard', isLoggedIn, checkStatus, async (req, res) => {
    try {
        const user = await Citizen.findById(req.user._id);
        const reports = await Report.find()
        res.render('citizenDashboard', { user });
        
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

router.get("/report", function (req, res) {
    res.render('report');
});

router.post("/report", async (req, res) => {
    // console.log(req.body);

    var sentimentInput = [req.body.incidentDescription];
    let urgency = 'info';
    let sentimentResult = {};
    try {
        sentimentResult = await textAnalyticsClient.analyzeSentiment(sentimentInput);

    }
    catch (e) {
        console.log(e);
    }
    let score = sentimentResult[0].sentimentScores.negative.toFixed(5);
    switch (true) {
        case (score < 0.9): urgency = 'info'; break;
        case (score < 0.95): urgency = 'info'; break;
        case (score <= 0.99): urgency = 'warning'; break;
        default: urgency = 'danger';
    }

    var address = {
        state: req.body.state,
        district: req.body.district,
        policeStation: req.body.policeStation,
        city: req.body.city,
        landmark: req.body.landmark,
        streetName: req.body.streetName
    };
    var victim = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        fatherName: req.body.fatherName,
        gender: req.body.gender,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        age: req.body.age,
        idType: req.body.idType,
        idNumber: req.body.idNumber,
        address: address
    };

    var incident = {
        nature: req.body.nature,
        state: req.body.incidentState,
        district: req.body.incidentDistrict,
        policeStation: req.body.incidentPoliceStation,
        incidentPlace: req.body.incidentPlace,
        pincode: req.body.pincode,
        incidentAddress: req.body.incidentAddress,
        incidentDescription: req.body.incidentDescription
    };

    var evidence = {
        description: req.body.description,
        details: req.body.details
    };

    var report = {
        victimDetails: victim,
        incidentDetails: incident,
        evidenceDetails: evidence,
        urgency: urgency,
        status: 'Available',
        appointedPersonnel: undefined
    };

    console.log(sentimentResult[0].sentimentScores);


    console.log("Report: ", report);

    Report.create(report, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data.victimDetails.firstName + " inserted.");
            sendEmail(req.body.email, 'File Report for Police', 'Thank you for submitting your report. We will get back to you shortly.');

            if (score >= 0.99) {

                sendEmail('ygyashgoyal@gmail.com', 'Urgent FIR', 'A highly urgent report has been recorded that requires immediate attention. Kindly look into it. We need YGPOLICE.');
            }
        }
    });
    res.redirect('dashboard');

});

module.exports = router;