const { where } = require("sequelize");
const db = require("../models");
const usersmodel = require("./users.controller");
const uuid = require('uuid');

const UserMeasure = db.user_measure;
const User = db.users;

function five0one(req, res){
   res.status(501).send('Not implemented');
};

exports.header_check = (req, res, next) => {
   user_id = req.headers['authorization']

   console.log("user_id: " + user_id);

   if (user_id !== 123456) {
      console.log("Mobile request");
      next();
   }else{
      console.log("Unauthorized");
      res.status(401).send('Missing or invalid authorization header');
   }
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

exports.get_dist = (req, res) => {
   const dosNumber = req.params.dosNum;
   
   UserMeasure.sum('distTraveled', { where: { dosNumber: dosNumber } })
      .then((sum) => {
         console.log("sum: " + sum);
         if (sum === null) {
            res.status(404).send('User not found');
         }
         res.status(200).send({
            dosNumber: dosNumber,
            distTraveled: sum
         });
      }).catch(() => {
         console.log("sum not found");
         res.status(400).send('Malformed request');
      });
   
};

exports.get_time = (req, res) => {
   UserMeasure.sum('timeSpent', { where: { dosNumber: dosNumber } })
      .then((sum) => {
         console.log("sum: " + sum);
         if (sum === null) {
            res.status(404).send('User not found');
         }
         res.status(200).send({
            dosNumber: dosNumber,
            timeSpent: sum
         });
      }).catch(() => {
         console.log("sum not found");
         res.status(400).send('Malformed request');
      });
};

exports.get_total_dist = (req, res) => {
   UserMeasure.sum('distTraveled')
      .then((sum) => {
         console.log("sum: " + sum);
         res.status(200).send({
            distTraveled: sum
         });
      }).catch(() => {
         console.log("sum not found");
         res.status(400).send('Malformed request');
      });
};

exports.get_total_time = (req, res) => {
   UserMeasure.sum('timeSpent')
      .then((sum) => {
         console.log("sum: " + sum);
         res.status(200).send({
            timeSpent: sum
         });
      }).catch(() => {
         console.log("sum not found");
         res.status(400).send('Malformed request');
      });
};

exports.logs = (req, res) => {
   five0one(req, res);
};

exports.create_participant = (req, res) => {
   const dosNum = req.body.dosNumber;
   const username = req.body.username;

   User.create({
      dosNumber: dosNum,
      name: username,
      rights: 0
   }).then(() => {
      console.log('User created');
      res.status(200).send({
         dosNumber: dosNum,
         username: username
      });
   }).catch((error) => {
      console.log('Error creating user ' + error);
      if (error.name === 'SequelizeUniqueConstraintError') {
         res.status(409).send({
            message: 'User already exists'
         });
      }else{
         res.status(500).send({
            message: 'Error creating user'
         });
      }
   });
};

exports.add_participant_data = (req, res) => {
   const dosNum = parseInt(req.body.dosNumber);
   const dist = req.body.distTraveled;
   const time = req.body.timeSpent;

   let _myUuid = uuid.v4();

   UserMeasure.create({
      myUuid: _myUuid,
      dosNumber: dosNum,
      distTraveled: 0,
      timeSpent: 0
   }).then(() => {
      console.log('UserMeasure created');
      UserMeasure.update({
         distTraveled: dist,
         timeSpent: time
      }, {
         where: {
            myUuid: _myUuid
         }
      }).then(() => {
         console.log('UserMeasure updated');
         res.status(200).send("Measure created");
      }).catch(() => {
         console.log('Error updating UserMeasure');
         res.status(500).send('Error updating UserMeasure');
      });
   }).catch((error) => {
      console.log('Error creating UserMeasure : ' + error);
      if (error.name === 'SequelizeForeignKeyConstraintError') {
         res.status(404).send('User not found');
      }else{
         res.status(500).send('Error creating UserMeasure');
      }
   });

};

