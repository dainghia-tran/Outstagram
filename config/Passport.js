const passport = require("passport");
const User = require("../models/UserModel");

const LocalStrategy = require("passport-local").Strategy;

User.authenticate();

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        (email, password, done) => {
            User.findOne({ email: email }, (err, user) => {
                if (err) return done(err);
                if (!user)
                    return done(null, false, { message: "User not found!" });
                if (!user.validPassword(password))
                    return done(null, false, {
                        message: "Incorrect password!",
                    });
                return done(null, user);
            });
        }
    )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;
