const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
import {v4 as uuidv4} from 'uuid';
const app = express();
const port = 3000;

app.use(express.json());

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
  isLoggedIn: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  loginToken: {
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



app.post('/app/measures/login', async (req, res) => {
  const dosNum = req.body.dosNumber;

  let user = await User.findOne({
    where: {
      dosNumber: dosNum
    }
  });


  
  let connectToken = uuidv4();
  if(user){
    if (user.isLoggedIn){
      return res.status(409).send('User already logged in');
    }
    
    User.update({
      isLoggedIn: true,
      loginToken: connectToken
    }, {
      where: {
        dosNumber: dosNum
      }
    });


  }else{
    const userData = await askIfExist(dosNum);
    if (user){
  
  
      User.create({
        dosNumber: userData.dosNumber,
        name: userData.name,
        isLoggedIn: true,
        logginToken: connectToken,
        distTraveled: 0,
        timeSpent: 0
      });

    }
  }

  
  res.status(501).send('Not implemented');
});

async function askIfExist(dosNum){

  let doesExist = true;
  //Ask the RQM server if the user exist
  
  if (doesExist){
    return {
      dosNumber: dosNum,
      name: "John Doe",
    };
  }else{
    return null;
  }
}

app.post('/app/measures/logout', (req, res) => {
  res.status(501).send('Not implemented');
});

app.post('/app/measures/start', (req, res) => {
  res.status(501).send('Not implemented');
});

app.post('/app/measures/stop', (req, res) => {
  res.status(501).send('Not implemented');
});

app.post('/app/measures/update-dist', (req, res) => {
  res.status(501).send('Not implemented');
});

app.get('/app/measures/get-all', (req, res) => {
  res.status(501).send('Not implemented');
});

// ----------------------------------------------------------------------------------------
// Admin routes

app.get('/server/data/get-all-data', (req, res) => {
  res.status(501).send('Not implemented');
});

app.post('/server/data/create-participant', (req, res) => {
  res.status(501).send('Not implemented');
});

app.post ('/server/data/add-participant-data', (req, res) => {
  res.status(501).send('Not implemented');
});

app.get('/server/data/get-participant-data/:id', (req, res) => {
  res.status(501).send('Not implemented');
});

app.get('/server/data/get-participant-dist/:id', (req, res) => {
  res.status(501).send('Not implemented');
});

app.get('/server/data/get-participant-time/:id', (req, res) => {
  res.status(501).send('Not implemented');
});

app.get('/server/data/get-total-dist', (req, res) => {
  res.status(501).send('Not implemented');
});

app.get('/server/data/get-total-time', (req, res) => {
  res.status(501).send('Not implemented');
});

app.get('/server/data/logs', (req, res) => {
  res.status(501).send('Not implemented');
});



// ----------------------------------------------------------------------------------------
app.get('/', async (req, res) => {
    await Item.create({
        name: 'Item 1',
        quantity: 10
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
