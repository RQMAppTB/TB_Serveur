const express = require("express");
const db = require("./app/models");

const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


db.sequelize.sync()//{ force: true})
   .then(() => {
      console.log("Synced db.");
   }).catch((err) => {
      console.log("Failed to sync db: " + err.message);
   });

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });


require("./app/routes/mobile.routes")(app);
require("./app/routes/admin.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}.`);
});
