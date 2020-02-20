const express = require("express");
const router = express.Router();
const Forum = require("./../models/forum");

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



router.get("/forum", async (req, res) => {
    try {
        const msg = await Forum.find({}, { _id: 0 });
        res.render("forum", { msg: msg });
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;