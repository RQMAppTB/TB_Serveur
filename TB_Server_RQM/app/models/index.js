const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
   host: process.env.DB_HOST,
   dialect: 'mysql'
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users.model.js")(sequelize, Sequelize);
db.user_measure = require("./user_measure.model.js")(sequelize, Sequelize);

db.users.hasMany(db.user_measure, {
   foreignKey: 'dosNumber',
   sourceKey: 'dosNumber'
});
db.user_measure.belongsTo(db.users, {
   foreignKey: 'dosNumber',
   targetKey: 'dosNumber'
});

module.exports = db;
