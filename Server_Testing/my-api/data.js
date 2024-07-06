
const e = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mydb', 'root', 'rootpassword', {
    host: 'db',
    dialect: 'mysql'
  });
  
  sequelize.authenticate().then(() => {
    console.log('Connected to MySQL');
  }).catch(err => {
    console.error('Unable to connect to MySQL', err);
  });
  
  const User = sequelize.define('User', {
    dosNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    myUuid: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: true
    },
    distTraveled: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  
// Sample data model
const Item = sequelize.define('Item', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  
  // Sync database
  sequelize.sync();

  exports.User = User;
  exports.Item = Item;