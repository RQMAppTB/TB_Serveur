const express = require("express");
const db = require("./app/models");
const mobile_router = require("./app/routes/mobile.routes");
const admin_router = require("./app/routes/admin.routes");

const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


db.sequelize.sync()
   .then(() => {
      console.log("Synced db.");
   }).catch((err) => {
      console.log("Failed to sync db: " + err.message);
   });

// Simple route to check if the server is live
app.get("/", (req, res) => {
   res.json({ message: "server is live" });
});

// Add the routes to the app
app.use('/app/measures', mobile_router);
app.use('/server/data', admin_router);


// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}.`);
});
