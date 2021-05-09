const express = require("express");
const router = express.Router();

const accountController = require("../controllers/AccountController");

router.post("/signup", accountController.signUp);

router.post("/signin", accountController.signIn);

module.exports = router;
