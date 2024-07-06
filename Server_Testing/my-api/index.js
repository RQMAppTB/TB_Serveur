const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const {v4} = require('uuid');
const app = express();
const port = 3000;

app.use(express.json());

const sequelize = new Sequelize('mydbtest', 'root', 'rootpassword', {
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

// ----------------------------------------------------------------------------------------
// App routes







// ----------------------------------------------------------------------------------------

app.get('/', async (req, res) => {
  console.log('Hello World!');
    await Item.create({
        name: 'Item 1',
        quantity: 10
    }).then((item) => {
        console.log(item.toJSON());
    }).catch((err) => {
        console.log('Error: ' + err.message);
    });
  res.send('Hello World!');
});

app.use('/use', (req, res, next) => {
    console.log('Hello World!');
    next();
});

app.get('/use/test', (req, res) => {
    res.send('Hello World!');
});

// CRUD operations
app.post('/items', async (req, res) => {
    const item = await Item.create(req.body);
    res.status(201).send("Bonjour");
});

app.get('/items', async (req, res) => {
  const items = await Item.findAll();
  res.send(items);
});

app.get('/items/:id', async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  res.send(item);
});

app.put('/items/:id', async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  await item.update(req.body);
  res.send(item);
});

app.delete('/items/:id', async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  await item.destroy();
  res.send({ message: 'Item deleted' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
