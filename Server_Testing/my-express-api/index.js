const express = require('express');
const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Route de base
app.get('/', async (req, res) => {
    console.log('Hello World!')
    setTimeout(() => {
        res.send('Hello World after 10 seconds!');
    }, 10000); // 10 seconds delay
});

app.use('/api', (req, res, next) => {
    console.log('API request received');
    tmp = req.body.isTrue;
    if (tmp === true) {
        console.log("value: " + tmp);
    }else{
        console.log("error");
    }
    next();
});

// Route pour récupérer des données
app.get('/api/data', (req, res) => {
    const data = {
        id: 1,
        name: 'Item 1',
        description: 'This is a description of item 1'
    };
    res.json(data);
});

// Route pour créer des données
app.post('/api/data', (req, res) => {
    const newData = req.body;
    // Ici, vous ajouteriez la logique pour ajouter les données à une base de données
    res.status(201).json(newData);
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
