const express = require("express");
const router = express.Router();
const passport = require("passport");

const AccountController = require("../controllers/AccountController");
const AuthService = require("../services/AuthService");

router.get("/", (req, res) => {
    res.send("Done");
});

router.get("/signin", (req, res) => {
    res.send("Sign in page");
});

router.get("/verify-email");

router.post("/signup", AuthService.isNotSignedIn, AccountController.signUp);

router.post(
    "/signin",
    AuthService.isNotSignedIn,
    passport.authenticate("local", {
        failureRedirect: "/unauthorized",
        failureFlash: true,
    }),
    AccountController.signIn
);

router.post("/signout", AccountController.signOut);

module.exports = router;
