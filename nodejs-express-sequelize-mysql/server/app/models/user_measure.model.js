const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
   const UserMeasure = sequelize.define('UserMeasure', {
      myUuid: {
         primaryKey: true,
         type: DataTypes.UUID,
         allowNull: true
      },
      /*dosNumber: {
         type: DataTypes.INTEGER,
         allowNull: false
      },*/
      distTraveled: {
         type: DataTypes.INTEGER,
         allowNull: false
      },
      timeSpent: {
         type: DataTypes.INTEGER,
         allowNull: false
      },
      number: {
         type: DataTypes.INTEGER,
         allowNull: false
      },
      status: {
         type: DataTypes.BOOLEAN,
         allowNull: false
      }
   }, {});

   return UserMeasure;
};