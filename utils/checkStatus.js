const checkStatus = (req, res, next) => {
    var paths = req._parsedOriginalUrl.path.split('/');
    var userStatus = paths[1];
    console.log(paths);
    if (req.user.status === userStatus)
        return next();

    var url = '';
    url = url + '/' + req.user.status;

    for (var i = 2; i < paths.length; i++) {
        url += ('/' + paths[i]);
    }
    console.log(url);
    res.redirect(url);

}

module.exports = checkStatus;