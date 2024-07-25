const { DataTypes } = require("sequelize");
// Define the UserMeasure model
module.exports = (sequelize, Sequelize) => {
   const UserMeasure = sequelize.define('UserMeasure', {
      myUuid: {
         primaryKey: true,
         type: DataTypes.UUID,
         allowNull: true
      },
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