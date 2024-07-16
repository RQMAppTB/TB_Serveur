const db = require("../models");
const uuid = require('uuid');
const User = db.users;
const Op = db.Sequelize.Op;

exports.createUser = (req, res) => {
    if (!req.body.dosNumber || !req.body.name) {
        res.status(400).send({
            message: "missing required fields name or dosNumber"
        });
        return;
    }
};

exports.getUser = async (dosNum) => {
   this_user = await User.findOne({
      where: {
         dosNumber: dosNum
      }
   }).then((user) => {
      console.log("user: " + user);
      return user;
   }).catch(() => {
      console.log("user not found");
      return null;
   });

   return this_user;
};
