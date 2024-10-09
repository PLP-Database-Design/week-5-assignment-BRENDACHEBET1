// Declare dependencies/ Variables
const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());
dotenv.config();

// Connect to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check if db connection works
db.connect((err) => {
    if (err) return console.log("Error connecting to the database");
    console.log("Connected to MySQL successfully as id: ", db.threadId);
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// 1.Retrieve all patients
app.get('/patients', (req, res) => {
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM Patients', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving patients');
        } else {
            res.render('patients', { results });
        }
    });
});

//2. Retrieve all providers
app.get('/providers', (req, res) => {
    db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving providers');
        } else {
            res.render('providers', { results });
        }
    });
});


// 3.Retrieve patients by first name
app.get('/patients/by-first-name', (req, res) => {
    const firstName = req.query.first_name; 
    if (!firstName) {
        return res.status(400).send('First name is required');
    }

    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM Patients WHERE first_name = ?';
    db.query(query, [firstName], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving patients');
        } else {
            res.render('patients', { results });
        }
    });
});

//4.Retrieve all providers by their specialty
app.get('/providers/by-specialty', (req, res) => {
    const specialty = req.query.specialty;
    if (!specialty) {
        return res.status(400).send('Specialty is required');
    }

    const query = 'SELECT first_name, last_name, provider_specialty FROM Providers WHERE provider_specialty = ?';
    db.query(query, [specialty], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving providers');
        } else {
            res.json(results);
        }
    });
});

// Send message on root
app.get('/', (req, res) => {
    res.send('Server started successfully');
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
