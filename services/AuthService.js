exports.isSignedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.redirect('account/signin');
}