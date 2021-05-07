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
            let verifyURL = `${req.protocol}://${req.get(
                "host"
            )}/account/verify-email?token=${usr.authToken}`;

            try {
                new Email(usr, verifyURL).sendVerify();
                res.json({
                    success: "true",
                    message:
                        "Email verification has been sent, check your email.",
                });
            } catch (error) {
                usr.authToken = undefined;
                usr.save();
                res.json({
                    success: "true",
                    message: "Something went wrong, please try again.",
                });
            }
        }
    });
};

exports.verifiEmail = (req, res) => {
    User.verifyEmail(req.query.token, (err, existingAuthToken) => {
        if (err) console.log("Something went wrong");
        console.log(existingAuthToken);
        res.json({ message: "Verified" });
    });
};

exports.signIn = (req, res) => {
    return res.send(req.user);
}

exports.signOut = (req, res) => {
    if (req.session) {
        req.logout();
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                res.clearCookie("session-id");
                res.json({ success: true, message: "Logged out successfully" });
            }
        });
    } else {
        res.statusCode = 403;
        res.json({ success: false, message: "You're not logged in" });
    }
};
