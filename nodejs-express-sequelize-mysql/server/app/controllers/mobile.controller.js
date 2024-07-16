const db = require("../models");
const uuid = require('uuid');
const { DataTypes, where, Op } = require("sequelize");
const { jsonStrMessage } = require("../utils");
const UserMeasure = db.user_measure;
const User = db.users;

exports.five0one = (req, res) => {
   res.status(501).send(jsonStrMessage('Not implemented'));
};

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
         return sum;
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
         distTraveled: distTraveled || 0,
      });
   } else {
      console.log('My User not found');
      User.create({
         dosNumber: dosNum,
         name: username,
         rights: 0
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

   // TODO remove this line later
   //_myUuid = "04610a98-5cef-4201-b7aa-e5d9ac293055";


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
         res.status(404).send(jsonStrMessage('User does not exist'));
      }
      res.status(500).send(jsonStrMessage('Something went wrong on our side'));
   });
}

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