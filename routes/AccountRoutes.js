const express = require("express");
const router = express.Router();

const accountController = require("../controllers/AccountController");
const middleware = require("../middleware/Auth");


//route: /account/signup
router.post("/signup", accountController.signUp);

//route: /account/signin
router.post("/signin", accountController.signIn);

//route: /account/signout
router.get("/signout", accountController.signOut);

//route: /account/search
router.get("/search", accountController.search);

//route: /account/change-password
router.put(
    "/change-password",
    middleware.authenticate,
    accountController.changePassword
);

//route: /account/change-avatar
router.put('/change-avatar', middleware.authenticate, accountController.changeAvatar);

//route: /account/follow
router.put("/follow", middleware.authenticate, accountController.follow);

module.exports = router;
