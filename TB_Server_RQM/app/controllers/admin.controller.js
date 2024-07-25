const { where } = require("sequelize");
const db = require("../models");
const uuid = require('uuid');
var path = require('path');
const { jsonStrMessage } = require("../utils");

const UserMeasure = db.user_measure;
const User = db.users;

/**
 * Function to return a 501 error code to a request
 * @param {*} req request object 
 * @param {*} res response object
 */
function five0one(req, res) {
   res.status(501).send(jsonStrMessage('Not implemented'));
};

/**
 * Function to check the authorization header
 * If the header is not present or invalid, it will return a 401 error code
 * If the header is valid, it will call the next function
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} next function to call to forward the request
 */
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

/**
 * Function to get all the users and their measures from the database.
 * It will return a 200 status code with the data if the request is successful
 * It will return a 500 status code if the request fails
 * @param {*} req request object
 * @param {*} res response object
 */
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

/**
 * Function to get the data of a specific user from the database.
 * It will return a 200 status code with the data if the request is successful
 * It will return a 404 status code if the user is not found
 * It will return a 500 status code if the request fails
 * @param {*} req request object
 * @param {*} res the response object
 */
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

/**
 * Function to get the distance traveled by a specific user from the database.
 * It will return a 200 status code with the data if the request is successful
 * It will return a 404 status code if the request is malformed
 * It will return a 404 status code if the user is not found
 * It will return a 500 status code if the request fails
 * @param {*} req request object
 * @param {*} res response object
 */
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

/**
 * Function to get the time spent on measures by a specific user from the database.
 * It will return a 200 status code with the data if the request is successful
 * It will return a 400 status code if the request is malformed
 * It will return a 404 status code if the user is not found
 * It will return a 500 status code if the request fails
 * @param {*} req request object
 * @param {*} res response object
 */
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

/**
 * Function to get the totaal distance traveled by all users from the database.
 * It will return a 200 status code with the data if the request is successful
 * It will return a 500 status code if the request fails
 * @param {*} req request object
 * @param {*} res response object
 */
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

/**
 * Function to get the total time spent on measures by all users from the database.
 * It will return a 200 status code with the data if the request is successful
 * It will return a 500 status code if the request fails
 * @param {*} req request object
 * @param {*} res response object
 */
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

/**
 * Function to get the logs from the server
 * Not implemented
 * @param {*} req request object
 * @param {*} res response object
 */
exports.logs = (req, res) => {
   five0one(req, res);
};

/**
 * Function to get the number of people currently having a measure active
 * It will return a 200 status code with the data if the request is successful
 * It will return a 500 status code if the request fails
 * @param {*} req request object
 * @param {*} res response object
 */
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

/**
 * Function to create a new user in the database
 * It will return a 201 status code if the request is successful
 * It will return a 400 status code if the request is malformed
 * It will return a 409 status code if the user already exists
 * It will return a 500 status code if the request fails
 * @param {*} req request object
 * @param {*} res response object
 * @returns 
 */
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

/**
 * Create a new measure for a user. The user must exist in the database before calling this function.
 * The measure will be created with a status of unactive.
 * It will return a 201 status code if the request is successful
 * It will return a 400 status code if the request is malformed
 * It will return a 404 status code if the user is not found
 * It will return a 500 status code if the request fails
 * @param {*} req request object
 * @param {*} res response object
 */
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