const express = require("express");
const IndexController = require("../controllers/IndexController");

var router = express.Router();

router.get("/unauthorized", IndexController.unauthorized);

module.exports = router;
