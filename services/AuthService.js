exports.isSignedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    else {
        res.statusCode = 401;
        res.json({ message: "You are not signed in" });
        res.redirect('account/signin');
    }
}

exports.isNotSignedIn = (req, res, next) => {
    if (!req.isAuthenticated())
        return next();
    else {
        res.statusCode = 406;
        res.json({ message: "You are signed in" });
        res.redirect("/");
    }
}