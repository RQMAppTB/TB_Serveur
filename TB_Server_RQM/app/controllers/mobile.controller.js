const db = require("../models");
const uuid = require('uuid');
const { DataTypes, where, Op } = require("sequelize");
const { jsonStrMessage } = require("../utils");
const UserMeasure = db.user_measure;
const User = db.users;

/**
 * Function to return a 501 error code to a request
 * @param {*} req request object 
 * @param {*} res response object
 */
exports.five0one = (req, res) => {
   res.status(501).send(jsonStrMessage('Not implemented'));
};

/**
 * Function to get the user name from the dossard number
 * It will call the RQM server to get the user name
 * It will return a 200 status code with the user name if the user is found
 * It will return a 400 status code if the request is malformed
 * It will return a 404 status code if the user is not found
 * It will return a 500 status code if an error occurs
 * @param {*} req request object
 * @param {*} res response object
 */
exports.ident = async (req, res) => {
   const dosNum = parseInt(req.query.dosNumber);

   if(isNaN(dosNum)){
      res.status(400).send(jsonStrMessage('Malformed request'));
      return;
   }

   console.log('RQM_SERV: ' + process.env.RQM_SERV);

   let url = new URL(process.env.RQM_SERV);
   url.searchParams.append('action', "get_username");
   url.searchParams.append('dossard', dosNum.toString().padStart(4, '0'));

   console.log("URL: " + url)

   const requestOptions = {
      method: "GET",
      redirect: "follow"
   };

   fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
         console.log("result" + result)

         jresult = JSON.parse(result);

         if (jresult.success) {
            res.status(200).send({
               dosNumber: dosNum,
               name: jresult.username,
            });
         } else {
            res.status(404).send(jsonStrMessage('User not found'));
         }
      })
      .catch((error) => res.status(500).send(jsonStrMessage("Something went wrong on our side")));
};

/**
 * Function to create a user if it does not exist
 * It will return a 200 status code with the user information if the user already exists
 * It will return a 201 status code with the user information if the user is created
 * It will return a 400 status code if the request is malformed
 * It will return a 500 status code if an error occurs
 * @param {*} req request object
 * @param {*} res response object
 */
exports.login = async (req, res) => {
   const dosNum = parseInt(req.body.dosNumber);
   const username = req.body.username;

   console.log('Creating user with dosNumber: ' + dosNum + ' and name: ' + username);

   if (isNaN(dosNum) || !username){
      res.status(400).send(jsonStrMessage('Malformed request'));
      return;
   }

   const user = await User.findOne({
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

   const distTraveled = await UserMeasure.sum('distTraveled', { where: { dosNumber: dosNum } })
      .then((sum) => {
         console.log("sum: " + sum);
         if(sum === null){
            return 0;
         }else{
            return sum;
         }
      }).catch(() => {
         console.log("sum not found");
         return 0;
      });

   console.log("user: " + user);

   if (user) {
      console.log('User found');

      res.status(200).send({
         dosNumber: user.dosNumber,
         username: user.name,
         distTraveled: distTraveled,
      });
   } else {
      console.log('My User not found');
      User.create({
         dosNumber: dosNum,
         name: username
      }).then(() => {
         res.status(201).send({
            dosNumber: dosNum,
            username: username,
            distTraveled: 0,
         });
      }).catch((error) => {
         console.log('Error creating user ' + error);
         res.status(500).send(jsonStrMessage('Something went wrong on our side'));
      });
   }
}

/**
 * Function to start a measure for a user
 * It will return a 201 status code with the user information if the measure is started
 * It will return a 202 status code with the user information if the notification could not be sent to the RQM server
 * It will return a 400 status code if the request is malformed
 * It will return a 404 status code if the user does not exist
 * It will return a 500 status code if an error occurs
 * @param {*} req request object
 * @param {*} res response object
 */
exports.start = (req, res) => {
   const dosNum = parseInt(req.body.dosNumber);
   const name = req.body.name;
   const number = parseInt(req.body.number);

   console.log('Starting user with dosNumber: ' + dosNum + ' and name: ' + name + ' and number: ' + number);

   if (isNaN(dosNum) || !name || isNaN(number)) {
      res.status(400).send(jsonStrMessage('Malformed request'));
      return;
   }

   // Generate a new UUID
   let _myUuid = uuid.v4();

   UserMeasure.create({
      myUuid: _myUuid,
      dosNumber: dosNum,
      distTraveled: 0,
      timeSpent: 0,
      number: number,
      status: true
   }).then(() => {
      console.log('measure created');

      const requestOptions = {
         method: "GET",
         redirect: "follow"
      };


      let url = new URL(process.env.RQM_SERV);
      url.searchParams.append('action', "save_notification");
      url.searchParams.append('utilisateur', name);
      url.searchParams.append('dossard', dosNum.toString().padStart(4, '0'));
      url.searchParams.append('type', "start");

      fetch(url, requestOptions)
         .then((response) => response.text())
         .then((result) => {
            console.log(result);

            const jresult = JSON.parse(result);

            if (jresult.success) {
               console.log("Notification sent");
               res.status(201).send({
                  dosNumber: dosNum,
                  myUuid: _myUuid
               });
            } else {
               console.log("Notification not sent");
               res.status(202).send({
                  dosNumber: dosNum,
                  myUuid: _myUuid,
                  error: "Notification not sent"
               });
            }
         })
         .catch((error) => {
            console.error(error)
            res.status(500).send(jsonStrMessage("Something went wrong on our side"));
         });
   }).catch((error) => {
      console.log('Error creating measure');
      console.log("error" + error);
      if(error.name === 'SequelizeForeignKeyConstraintError'){
         console.log('User do not exist');
         res.status(404).send(jsonStrMessage('User does not exist'));
         return;
      }
      res.status(500).send(jsonStrMessage('Something went wrong on our side'));
   });
}

/**
 * Function to stop a measure
 * It will return a 201 status code if the measure is stopped and the notification is sent
 * It will return a 202 status code if the measure is stopped but the notification could not be sent
 * It will return a 400 status code if the request is malformed
 * It will return a 404 status code if the measure is not found
 * It will return a 500 status code if an error occurs
 * @param {*} req request object
 * @param {*} res response object
 */
exports.stop = async (req, res) => {
   const uuid = req.body.uuid;
   const distTraveled = parseInt(req.body.dist);
   const timeSpent = parseInt(req.body.time);

   if (!uuid || isNaN(distTraveled) || isNaN(timeSpent)) {
      res.status(400).send(jsonStrMessage('Malformed request'));
      return;
   }

   console.log('Stopping user with uuid: ' + uuid + ' and dist: ' + distTraveled + ' and time: ' + timeSpent)

   UserMeasure.update({
      distTraveled: distTraveled,
      timeSpent: timeSpent,
      status: false
   }, {
      where: {
         myUuid: uuid,
         status: true,
         timeSpent:{
            [Op.lte]: timeSpent
         },
         distTraveled:{
            [Op.lte]: distTraveled
         }
      }
   }).then(async (nbUpdate) => {

      if(nbUpdate[0] === 0){
         res.status(404).send(jsonStrMessage('No running measure was found for this uuid'));
         return;
      }

      console.log('measure updated');

      const measure = await UserMeasure.findByPk(uuid);
      const user = await User.findByPk(measure.dosNumber);

      const requestOptions = {
         method: "GET",
         redirect: "follow"
      };

      let url = new URL(process.env.RQM_SERV);
      url.searchParams.append('action', "save_notification");
      url.searchParams.append('utilisateur', user.name);
      url.searchParams.append('dossard', user.dosNumber.toString().padStart(4, '0'));
      url.searchParams.append('type', "end");

      fetch(url, requestOptions)
         .then((response) => response.text())
         .then((result) => {
            console.log(result);

            jresult = JSON.parse(result);

            if (jresult.success) {
               console.log("Notification sent");
               res.status(201).send(jsonStrMessage('Measure stopped'));
            } else {
               console.log("Notification not sent");
               console.log(jresult.error)
               res.status(202).send(jsonStrMessage('Measure stopped but could not send notification'));
            }
         })
         .catch((error) => {
            console.log("Error sending notification");
            console.error(error)
            res.status(500).send(jsonStrMessage("Something went wrong on our side"));
         });
   }).catch((error) => {
      console.log('Error updating measure');
      console.log("error" + error);
      res.status(500).send(jsonStrMessage('Something went wrong on our side'));
   });
};

/**
 * Function to update a measure, it will replace the current measure's dist and time with the new ones
 * It will return a 200 status code if the measure is updated
 * It will return a 400 status code if the request is malformed
 * It will return a 404 status code if the measure is not found
 * It will return a 500 status code if an error occurs
 * @param {*} req request object
 * @param {*} res response object
 */
exports.updateDist = async (req, res) => {

   const _uuid = req.body.uuid;
   const dist = parseInt(req.body.dist);
   const time = parseInt(req.body.time);

   if (!req.body.uuid || !req.body.dist || !req.body.time) {
      res.status(400).send(jsonStrMessage('Malformed request'));
      return;
   }

   console.log('Updating user with uuid: ' + req.body.uuid + ' and dist: ' + req.body.dist + ' and time: ' + req.body.time);

   console.log('testing value:' + _uuid + ' /// ' + dist + ' /// ' + time);

   updateMeasure(req.body.uuid, parseInt(req.body.dist), parseInt(req.body.time))
      .then((array) => {
         if (array[0] === 0) {
            res.status(404).send(jsonStrMessage('User not found'));
         } else {
            res.status(200).send(jsonStrMessage('Measure updated'));
         }
      }).catch((error) => {
         console.log('Error updating measure ' + error);
         res.status(500).send(jsonStrMessage('Something went wrong on our side'));
      });
};

/**
 * Function to get the distance traveled by a user
 * It will return a 200 status code with the distance traveled by the user
 * It will return a 400 status code if the request is malformed
 * It will return a 404 status code if the user is not found
 * It will return a 500 status code if an error occurs
 * @param {*} req request object
 * @param {*} res response object
 */
exports.getUserDist = async (req, res) => {
   const dosNum = parseInt(req.query.dosNumber);

   if (!dosNum) {
      res.status(400).send(jsonStrMessage('Malformed request'));
      return;
   }


   UserMeasure.sum('distTraveled', { where: { dosNumber: dosNum } })
      .then((sum) => {
         console.log("sum: " + sum);
         if (sum === null) {
            res.status(404).send(jsonStrMessage('No measure found for this user'));
         }else{
            res.status(200).send({
               dosNumber: dosNum,
               distTraveled: sum
            });
         }
      }).catch((error) => {
         console.log('Error getting user dist' + error);
         res.status(500).send(jsonStrMessage('Something went wrong on our side'));
      });
}

/**
 * Function to get the distance traveled by all users
 * It will return a 200 status code with the total distance traveled by all users
 * It will return a 500 status code if an error occurs
 * @param {*} req request object
 * @param {*} res response object
 */
exports.getAllDist = async (req, res) => {
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
}

/**
 * Function to update a measure. It will replace the current measure's dist and time with the new ones
 * @param {*} _uuid uuid of the measure to update
 * @param {*} dist new distance
 * @param {*} time new time
 * @returns Promise resolving to the number of rows updated
 */
function updateMeasure(_uuid, dist, time) {
   return UserMeasure.update({
      distTraveled: dist,
      timeSpent: time
   }, {
      where: {
         myUuid: _uuid,
         status: true,
         timeSpent:{
            [Op.lte]: time
         },
         distTraveled:{
            [Op.lte]: dist
         }
      }
   })
}