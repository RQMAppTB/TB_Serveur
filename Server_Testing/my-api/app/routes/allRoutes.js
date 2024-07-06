app.get('/app/measures/ident', async (req, res) => {
    const dosNum = req.body.dosNumber;
  
    const userData = await askIfExist(dosNum);
    if (userData){
  
      console.log('User found');
      res.status(200).send({
        dosNumber: dosNum,
        name: userData.name
      });
  /*
      User.create({
        dosNumber: userData.dosNumber,
        name: userData.name,
        myUuid: connectToken,
        distTraveled: 0,
        timeSpent: 0
      }).then(() => {
        console.log('User created');
        res.status(200).send({
          dosNumber: userData.dosNumber,
          myUuid: connectToken
        });
      }).catch(() => {*/
    
  
    }else{
      return res.status(404).send('User not found');
    }
  
  
    // Get user from database if exists
    /*let user = await User.findOne({
      where: {
        dosNumber: dosNum
      }
    });
  
  
    let connectToken = v4(); 
  
    // Check if user already exists
    if(user){
  
      // Update user login status
      User.update({
        loginToken: connectToken
      }, {
        where: {
          dosNumber: dosNum
        }
      });
  
      // Return connection token
      return res.status(200).send({
        dosNumber: user.dosNumber, 
        loginToken: connectToken
      });
  
    }else{
      
    }*/
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
  
  app.post('/app/measures/login', async (req, res) => {
    const dosNum = req.body.dosNumber;
    const name = req.body.name;
  
    let _myUuid = v4(); 
  
    console.log('Creating user with dosNumber: ' + dosNum + ' and name: ' + name + ' and uuid: ' + _myUuid)
  
    // Add entry to database
    await User.create({
      dosNumber: dosNum,
      name: name,
      myUuid: _myUuid,
      distTraveled: 0,
      timeSpent: 0
    }).then(() => {
      console.log('User created');
      res.status(200).send({
        dosNumber: dosNum,
        myUuid: _myUuid
      });
    }).catch(() => {
      console.log('Error creating user');
      res.status(500).send('Error creating user');
    })
  });
  
  app.get('/app/measures/get-user', async (req, res) => {
    let tmp = await User.findAll();
    console.log(tmp);
    res.status(200).send(tmp);
  });
  
  
  
  app.post('/app/measures/logout', async (req, res) => {
    await User.update({
      loginToken: null
    }, {
      where: {
        dosNumber: req.body.dosNumber
      }
    })
    .then(() => {
      res.status(200).send('User logged out');
    })
    .catch(() => {
      res.status(404).send('User not found');
    });
  });
  
  app.post('/app/measures/start', (req, res) => {
  
  
    res.status(200);
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