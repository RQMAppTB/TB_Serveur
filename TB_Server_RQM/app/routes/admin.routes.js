const controller = require("../controllers/admin.controller.js");
var router = require("express").Router();

// Creation of all the admin routes. For more information, see the controller or the documentation file.
router.use(controller.header_check);

router.get("/get-all-data", controller.get_all_data);
router.get("/get-data/:dosNum", controller.get_data);
router.get("/get-dist/:dosNum", controller.get_dist);
router.get("/get-time/:dosNum", controller.get_time);
router.get("/get-total-dist", controller.get_total_dist);
router.get("/get-total-time", controller.get_total_time);
router.get("/logs", controller.logs);
router.get("/get-active-number", controller.get_active_number);
router.post("/create-participant", controller.create_participant);
router.post("/add-participant-data", controller.add_participant_data);

module.exports = router;