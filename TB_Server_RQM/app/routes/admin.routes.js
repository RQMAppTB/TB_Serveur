const controller = require("../controllers/admin.controller.js");
var router = require("express").Router();

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

/*
module.exports = app => {



   app.use('/server/data', router);
}*/
/*
app.get('/server/data/get-all-data', (req, res) => {
   res.status(501).send('Not implemented');
});

app.post('/server/data/create-participant', (req, res) => {
   res.status(501).send('Not implemented');
});

app.post('/server/data/add-participant-data', (req, res) => {
   res.status(501).send('Not implemented');
});

app.get('/server/data/get-participant-data/:id', (req, res) => {
   res.status(501).send('Not implemented');
});

app.get('/server/data/get-participant-dist/:id', (req, res) => {
   res.status(501).send('Not implemented');
});

app.get('/server/data/get-participant-time/:id', (req, res) => {
   res.status(501).send('Not implemented');
});

app.get('/server/data/get-total-dist', (req, res) => {
   res.status(501).send('Not implemented');
});

app.get('/server/data/get-total-time', (req, res) => {
   res.status(501).send('Not implemented');
});

app.get('/server/data/logs', (req, res) => {
   res.status(501).send('Not implemented');
});*/