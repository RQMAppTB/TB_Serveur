const { where } = require("sequelize");
const db = require("../models");
const usersmodel = require("./users.controller");

const UserMeasure = db.user_measure;
const User = db.users;

exports.five0one = (req, res) => {
   res.status(501).send('Not implemented');
};

exports.get_all_data = (req, res) => {

   console.log("get-all-data");

   User.findAll({
      attributes: [
         'dosNumber',
         'name',
         [db.sequelize.cast(db.sequelize.fn('COALESCE', db.sequelize.fn('SUM', db.sequelize.col('UserMeasures.distTraveled')), 0), 'UNSIGNED'), 'total_distance_traveled'],
         [db.sequelize.cast(db.sequelize.fn('COALESCE', db.sequelize.fn('SUM', db.sequelize.col('UserMeasures.timeSpent')), 0), 'UNSIGNED'), 'total_temps_spent'],
         [db.sequelize.fn('COALESCE', db.sequelize.fn('COUNT', db.sequelize.col('UserMeasures.myUuid')), 0), 'number_of_measures']
      ],
      include: [{
         model: UserMeasure,
         attributes: []
      }],
      group: ['dosNumber', 'name']
   }).then(data => {
      console.log("data" + data);
      res.status(200).send(data);
   }).catch(err => {
      console.log("error" + err);
      res.status(500).send("Error retrieving data");
   });

};

exports.get_data = (req, res) => {

   User.findOne({
      attributes: [
         'dosNumber',
         'name',
         [db.sequelize.cast(db.sequelize.fn('COALESCE', db.sequelize.fn('SUM', db.sequelize.col('UserMeasures.distTraveled')), 0), 'UNSIGNED'), 'total_distance_traveled'],
         [db.sequelize.cast(db.sequelize.fn('COALESCE', db.sequelize.fn('SUM', db.sequelize.col('UserMeasures.timeSpent')), 0), 'UNSIGNED'), 'total_temps_spent'],
         [db.sequelize.fn('COALESCE', db.sequelize.fn('COUNT', db.sequelize.col('UserMeasures.myUuid')), 0), 'number_of_measures']
      ],
      include: [{
         model: UserMeasure,
         attributes: []
      }],
      where: {
         dosNumber: req.params.dosNum
      },
   }).then(data => {
      console.log("data" + data);
      if(data.dosNumber === null){
         console.log("User not found")
         res.status(404).send("User not found");
      }else{
         console.log("User found")
         res.status(200).send(data);
      }
   }).catch(err => {
      console.log("error" + err);
      res.status(500).send("Error retrieving data");
   });
}