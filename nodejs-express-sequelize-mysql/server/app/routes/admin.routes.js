module.exports = app => {
   const controller = require("../controllers/admin.controller.js");
   var router = require("express").Router();

   router.use(function (req, res, next) {

      user_id = req.headers['authorization']

      console.log("user_id: " + user_id);

      if (user_id !== 123456) {
         console.log("Mobile request");
         next();
      }else{
         console.log("Unauthorized");
         res.status(401).send('Unauthorized');
      }
   });

   router.get("/get-all-data", controller.get_all_data);
   router.post("/create-participant", controller.five0one);
   router.post("/add-participant-data", controller.five0one);
   router.get("/get-data/:dosNum", controller.get_data);
   router.get("/get-dist/:dosNum", controller.five0one);
   router.get("/get-time/:dosNum", controller.five0one);
   router.get("/get-total-dist", controller.five0one);
   router.get("/get-total-time", controller.five0one);
   router.get("/logs", controller.five0one);



   app.use('/server/data', router);
}
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