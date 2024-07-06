const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
   const rights = {
      lambdaUsr: 0,
      admin: 1
   };

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
      rights: {
         type: DataTypes.INTEGER,
         allowNull: false
      },
   }, {});
   return User;
};