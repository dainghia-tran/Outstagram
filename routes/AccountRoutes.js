const express = require("express");
const router = express.Router();

const accountController = require("../controllers/AccountController");

router.post("/signup", accountController.signUp);

router.post("/signin", accountController.signIn);

router.get("/logout", accountController.logout);

module.exports = router;
