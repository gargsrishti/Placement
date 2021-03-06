//Logging
const winston = require('winston')
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
require('console-stamp')(logger, '[HH:MM:ss.l]');

const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url)
.then(() => {
    //console.log("Successfully connected to the database");
	logger.log({
		level: 'info',
		message: 'Successfully connected to the database'
	});
}).catch(err => {
    //console.log('Could not connect to the database. Exiting now...');
    logger.log({
		level: 'error',
		message: 'Successfully connected to the database'
	});
	process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to Placement application. Add/Update/Delete Students easily. Register/Unregister company or Student from Company."});
});

// Require Student routes
require('./app/routes/student.routes.js')(app);

// Require Company routes
require('./app/routes/company.routes.js')(app);

// Require Registration routes
require('./app/routes/register.routes.js')(app);

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});