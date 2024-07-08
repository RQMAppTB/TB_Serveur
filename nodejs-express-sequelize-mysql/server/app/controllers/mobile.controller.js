//const { Json } = require("sequelize/lib/utils");
const db = require("../models");
const usersmodel = require("./users.controller");
const uuid = require('uuid');
const { DataTypes, where } = require("sequelize");
const UserMeasure = db.user_measure;
const User = db.users;

exports.five0one = (req, res) => {
   res.status(501).send('Not implemented');
};

exports.ident = async (req, res) => {
   const dosNum = parseInt(req.query.dosNumber);

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
               name: jresult.username || "User not found",
            });
         } else {
            res.status(404).send('User not found');
         }
      })
      .catch((error) => res.status(500).send("Something went wrong on our side"));
};

exports.login = async (req, res) => {
   const dosNum = parseInt(req.body.dosNumber);
   const username = req.body.username;

   console.log('Creating user with dosNumber: ' + dosNum + ' and name: ' + username);

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
         distTraveled: distTraveled,
      });
   } else {
      console.log('My User not found');
      await User.create({
         dosNumber: dosNum,
         name: username,
         rights: 0
      });
      res.status(200).send({
         dosNumber: dosNum,
         username: username,
         distTraveled: distTraveled,
      });
   }
}

exports.start = (req, res) => {
   const dosNum = parseInt(req.body.dosNumber);
   const name = req.body.name;
   const number = req.body.number;

   console.log('Starting user with dosNumber: ' + dosNum);

   if (!dosNum || !name) {
      res.status(400).send('Malformed request');
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
               res.status(200).send({
                  dosNumber: dosNum,
                  myUuid: _myUuid
               });
            } else {
               console.log("Notification not sent");
               res.status(400).send(jresult.error);
            }
         })
         .catch((error) => {
            console.error(error)
            res.status(500).send("Something went wrong on our side");
         });
   }).catch((error) => {
      console.log('Error creating measure');
      console.log("error" + error);
      res.status(404).send('User not found');
   });
}

exports.stop = async (req, res) => {
   const dosNum = parseInt(req.body.dosNumber);
   const uuid = req.body.uuid;
   const distTraveled = req.body.dist;
   const timeSpent = req.body.time;

   console.log('Stopping user with dosNumber: ' + dosNum + ' and myUuid: ' + uuid);

   // check if user exists
   usersmodel.getUser(dosNum)
      .then((user) => {
         if (user) {
            console.log("User found" + user);

            // Update the user_measure table with the new distance and time
            UserMeasure.update({
               distTraveled: distTraveled,
               timeSpent: timeSpent,
               status: false
            }, {
               where: {
                  myUuid: uuid
               }
            }).then(() => {
               console.log('measure updated');

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
                        res.status(200).send('Measure stopped');
                     } else {
                        console.log("Notification not sent");
                        res.status(400).send(jresult.error);
                     }
                  })
                  .catch((error) => {
                     console.error(error)
                     res.status(500).send("Something went wrong on our side");
                  });
            }).catch(() => {
               console.log('Error updating measure');
               res.status(500).send('Error updating measure');
            });


         } else {
            console.log("User not found");
            res.status(404).send('User not found');
         }
      }).catch(() => {
         res.status(500).send('Something went wrong');
      });

};

exports.updateDist = async (req, res) => {
   console.log('Updating user with uuid: ' + req.body.uuid + ' and dist: ' + req.body.dist + ' and time: ' + req.body.time);

   updateMeasure(req.body.uuid, req.body.dist, req.body.time, res)
      .then((array) => {
         if (array[0] === 0) {
            res.status(404).send('User not found');
         } else {
            res.status(200).send('Measure updated');
         }
         //res.status(200).send('Measure updated');
      }).catch(() => {
         res.status(500).send('Error updating measure');
      });
};


exports.getUserDist = async (req, res) => {
   const dosNum = parseInt(req.query.dosNumber);

   UserMeasure.sum('distTraveled', { where: { dosNumber: dosNum } })
      .then((sum) => {
         console.log("sum: " + sum);
         if (sum === null) {
            res.status(404).send('User not found');
         }
         res.status(200).send({
            dosNumber: dosNum,
            distTraveled: sum
         });
      }).catch(() => {
         console.log("sum not found");
         res.status(400).send('Malformed request');
      });
}

exports.getAllDist = async (req, res) => {
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
}


function updateMeasure(_uuid, dist, time, res) {
   return UserMeasure.update({
      distTraveled: dist,
      timeSpent: time
   }, {
      where: {
         myUuid: _uuid,
         status: true
      }
   })
}