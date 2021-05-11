const express = require("express");
const router = express.Router();

const accountController = require("../controllers/AccountController");
const middleware = require("../middleware/Auth");

router.post("/signup", accountController.signUp);

router.post("/signin", accountController.signIn);

router.get("/signout", accountController.signOut);

router.get("/search", accountController.search);

router.put(
    "/change-password",
    middleware.authenticate,
    accountController.changePassword
);

router.put('/change-avatar', middleware.authenticate, accountController.changeAvatar);

module.exports = router;
