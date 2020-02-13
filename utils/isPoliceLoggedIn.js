const isPoliceLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('info', 'Authentication Required');
    res.redirect("/police/login");
}

module.exports = isPoliceLoggedIn;