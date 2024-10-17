const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to get user data
app.get('/api/users', (req, res) => {
    fs.readFile('login.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file.');
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to create a new user
app.post('/api/users', (req, res) => {
    const newUser = req.body;
    fs.readFile('login.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file.');
        }
        const users = JSON.parse(data);
        // Check if the username already exists
        const existingUser = users.find(user => user.username === newUser.username);
        if (existingUser) {
            return res.status(400).send('Username already exists.');
        }
        // Add new user to the array
        users.push(newUser);
        // Write back to the JSON file
        fs.writeFile('login.json', JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing file.');
            }
            res.status(201).send('User created successfully.');
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});