const controller = require("../controllers/mobile.controller.js");
var router = require("express").Router();

// Creation of all the mobile routes. For more information, see the controller or the documentation file.
router.get("/ident", controller.ident);
router.post("/login", controller.login);
router.post("/start", controller.start);
router.post("/stop", controller.stop);
router.post("/update-dist", controller.updateDist);
router.get("/getUserDist", controller.getUserDist);
router.get("/getAllDist", controller.getAllDist);

module.exports = router;