const express = require("express");
const router = express.Router();
const passport = require("passport");

const AccountController = require("../controllers/AccountController");

router.get("/", (req, res) => {
    res.send("Done");
});

router.get("/signin", (req, res) => {
    res.send("Sign in page");
});

router.post("/signup", AccountController.signUp);

router.post(
    "/signin",
    passport.authenticate("local", {
        failureRedirect: "/account/signin",
        failureFlash: true,
    }),
    AccountController.signIn
);

router.post("/signout", AccountController.signOut)

module.exports = router;
