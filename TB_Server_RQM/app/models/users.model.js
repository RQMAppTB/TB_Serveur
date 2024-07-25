const { DataTypes } = require("sequelize");
// Define the User model
module.exports = (sequelize, Sequelize) => {
   const User = sequelize.define('Users', {
      dosNumber: {
         type: DataTypes.STRING,
         primaryKey: true,
         allowNull: false
      },
      name: {
         type: DataTypes.STRING,
         allowNull: false
      },
   }, {});
   return User;
};