const User = require("../models/UserModel");
const UserModel = require("../models/UserModel");

exports.signUp = (req, res) => {
    const user = new User(req.body);
    UserModel.register(user, req.body.password, (err, usr) => {
        if (err) {
            res.statusCode = 500;
            res.json({
                success: false,
                message: "Error when creating account!",
                err,
            });
        } else {
            res.statusCode = 200;
            res.json({
                success: true,
                message: "Your account has been created!",
            });
        }
    });
};

exports.signIn = (req, res) => {
    res.json({ success: true, message: "Logged in successfully" });
    res.redirect("/");
};

exports.signOut = (req, res) => {
    if (req.session) {
        req.logout();
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                res.clearCookie('session-id');
                res.json({ success: true, message: "Logged out successfully" });
            }
        });
    } else {
        res.statusCode = 403;
        res.json({ success: false, message: "You're not logged in" });
    }
}
