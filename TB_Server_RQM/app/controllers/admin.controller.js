const { where } = require("sequelize");
const db = require("../models");
const uuid = require('uuid');
var path = require('path');
const { jsonStrMessage } = require("../utils");

const UserMeasure = db.user_measure;
const User = db.users;

function five0one(req, res) {
   res.status(501).send(jsonStrMessage('Not implemented'));
};

exports.header_check = (req, res, next) => {
   user_id = req.headers['authorization']

   console.log("user_id: " + user_id);
   console.log("process.env.ADMIN_KEY: " + process.env.ADMIN_KEY);

   if (user_id === process.env.ADMIN_KEY) {
      console.log("Admin request");
      next();
   } else {
      console.log("Unauthorized");
      res.status(401).send(jsonStrMessage('Missing or invalid authorization header'));
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
      res.status(500).send(jsonStrMessage('Error retrieving data'));
   });

};

exports.get_data = (req, res) => {
   const dosNumber = req.params.dosNum;

   if (!dosNumber) {
      res.status(400).send(jsonStrMessage('Malformed request'));
      return;
   }

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
         dosNumber: dosNumber
      },
   }).then(data => {
      console.log("data" + data);
      if (data.dosNumber === null) {
         console.log("User not found")
         res.status(404).send(jsonStrMessage('User not found'));
      } else {
         console.log("User found")
         res.status(200).send(data);
      }
   }).catch(err => {
      console.log("error" + err);
      res.status(500).send(jsonStrMessage('Something went wrong on our side'));
   });
}

exports.get_dist = (req, res) => {
   const dosNumber = parseInt(req.params.dosNum);

   if (isNaN(dosNumber)) {
      res.status(400).send(jsonStrMessage('Malformed request'));
      return;
   }

   UserMeasure.sum('distTraveled', { where: { dosNumber: dosNumber } })
      .then((sum) => {
         console.log("sum: " + sum);
         if (sum === null) {
            res.status(404).send(jsonStrMessage('No measure found'));
            return;
         }
         res.status(200).send({
            dosNumber: dosNumber,
            distTraveled: sum
         });
      }).catch((error) => {
         console.log("Can't get measure: " + error);
         res.status(500).send(jsonStrMessage('Something went wrong on our side'));
      });

};

exports.get_time = (req, res) => {
   const dosNumber = parseInt(req.params.dosNum);

   if (isNaN(dosNumber)) {
      res.status(400).send('Malformed request');
      return;
   }

   UserMeasure.sum('timeSpent', { where: { dosNumber: dosNumber } })
      .then((sum) => {
         console.log("sum: " + sum);
         if (sum === null) {
            res.status(404).send(jsonStrMessage('No measure found'));
            return;
         }
         res.status(200).send({
            dosNumber: dosNumber,
            timeSpent: sum
         });
      }).catch((error) => {
         console.log("Can't get measure: " + error);
         res.status(500).send(jsonStrMessage('Something went wrong on our side'));
      });
};

exports.get_total_dist = (req, res) => {
   UserMeasure.findAll({
      attributes: [
         [db.sequelize.fn('SUM', db.sequelize.literal('distTraveled * number')), 'distTraveled']
      ],
      raw: true
   })
   .then((sum) => {
      const total = parseInt(sum[0].distTraveled, 10);
      console.log("sum: " + total);
      res.status(200).send({
         distTraveled: total || 0
      });
   }).catch((error) => {
      console.log("Can't get measure: " + error);
      res.status(500).send(jsonStrMessage('Something went wrong on our side'));
   });
};

exports.get_total_time = (req, res) => {
   UserMeasure.sum('timeSpent')
      .then((sum) => {
         console.log("sum: " + sum);
         res.status(200).send({
            timeSpent: sum
         });
      }).catch((error) => {
         console.log("Can't get measure: " + error);
         res.status(500).send(jsonStrMessage('Something went wrong on our side'));
      });
};

exports.logs = (req, res) => {
   five0one(req, res);
};

exports.get_active_number = (req, res) => {
   UserMeasure.sum('number', {
      where: {
         status: true
      }
   }).then((sum) => {
      console.log("sum: " + sum);
      res.status(200).send({
         number: sum || 0
      });
   }).catch((error) => {
      console.log("Can't get measure: " + error);
      res.status(500).send(jsonStrMessage('Something went wrong on our side'));
   });
};

exports.create_participant = (req, res) => {
   const dosNum = parseInt(req.body.dosNumber);
   const username = req.body.username;

   if (isNaN(dosNum) || !username) {
      res.status(400).send(jsonStrMessage('Malformed request'));
      return;
   }

   User.create({
      dosNumber: dosNum,
      name: username
   }).then(() => {
      console.log('User created');
      res.status(201).send({
         dosNumber: dosNum,
         username: username
      });
   }).catch((error) => {
      console.log('Error creating user ' + error);
      if (error.name === 'SequelizeUniqueConstraintError') {
         res.status(409).send(jsonStrMessage('User already exists'));
      } else {
         res.status(500).send(jsonStrMessage('Something went wrong on our side'));
      }
   });
};

exports.add_participant_data = (req, res) => {
   const dosNum = parseInt(req.body.dosNumber);
   const dist = parseInt(req.body.distTraveled);
   const time = parseInt(req.body.timeSpent);
   const num = parseInt(req.body.number);

   if (isNaN(dosNum) || isNaN(dist) || isNaN(time) || isNaN(num) || num <= 0) {
      res.status(400).send(jsonStrMessage('Malformed request'));
      return;
   }

   let _myUuid = uuid.v4();

   UserMeasure.create({
      myUuid: _myUuid,
      dosNumber: dosNum,
      distTraveled: 0,
      timeSpent: 0,
      number: num,
      status: false
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
         res.status(201).send(jsonStrMessage('Measure created'));
      }).catch((error) => {
         console.log('Error updating UserMeasure : ' + error);
         res.status(500).send(jsonStrMessage('Something went wrong on our side'));
      });
   }).catch((error) => {
      console.log('Error creating UserMeasure : ' + error);
      if (error.name === 'SequelizeForeignKeyConstraintError') {
         res.status(404).send(jsonStrMessage('User not found'));
      } else {
         res.status(500).send(jsonStrMessage('Something went wrong on our side'));
      }
   });
};