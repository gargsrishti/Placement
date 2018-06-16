const Register = require('../models/register.model.js');
var validator = require('validator');

const winston = require('winston')
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
require('console-stamp')(logger, '[HH:MM:ss.l]');

// Register for a company
exports.create = (req, res) => {
	// Validate request
    if(validator.isEmpty(req.body.studentId) || validator.isEmpty(req.body.companyId)) {
		logger.log({
			level: 'error',
			message: "Student and Company Id mandatory"
		});
        return res.status(400).send({
            message: "Student and Company Id mandatory"
        });
    }
	
	const register = new Register({
        studentId: req.body.studentId, 
        companyId: req.body.companyId,
    });

    // Save data in the database
    register.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
		logger.log({
			level: 'error',
			message: err.message || "Some error occurred while registering....."
		});
        res.status(500).send({
            message: err.message || "Some error occurred while registering....."
        });
    });
	logger.log({
		level: 'info',
		message: 'Student registered for company Successfully'
	});
};

// Retrieve and return all registerations.
exports.findAll = (req, res) => {
	logger.log({
		level: 'info',
		message: 'Retrieving all registration data '
	});
	Register.find()
    .then(register => {
        res.send(register);
    }).catch(err => {
		logger.log({
			level: 'error',
			message: err.message || "Some error occurred while retrieving registration data."
		});
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving registration data."
        });
    });
};

// Return single entry using registration Id
exports.findOne = (req, res) => {
	logger.log({
		level: 'info',
		message: 'Retrieving registration data with id' + req.params.registerId
	});
	Register.findById(req.params.registerId)
    .then(register => {
        if(!register) {
			logger.log({
				level: 'error',
				message: "Data not found with registrationid " + req.params.registerId
			});
            return res.status(404).send({
                message: "Data not found with registrationid " + req.params.registerId
            });            
        }
        res.send(register);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            logger.log({
				level: 'error',
				message: "Data not found with id " + req.params.registerId
			});
			return res.status(404).send({
                message: "Data not found with id " + req.params.registerId
            });                
        }
		logger.log({
			level: 'error',
			message: "Error retrieving data with registration id " + req.params.registerId
		});
        return res.status(500).send({
            message: "Error retrieving data with registrationid " + req.params.registerId
        });
    });
};

// Unregister for a company using RegisterId
exports.delete = (req, res) => {
	Register.findByIdAndRemove(req.params.registerId)
    .then(register => {
        if(!register) {
            logger.log({
				level: 'error',
				message: "Data not found with Registrationid " + req.params.registerId
			});
			return res.status(404).send({
                message: "Data not found with Registrationid " + req.params.registerId
            });
        }
		logger.log({
			level: 'info',
			message: "Unregistered successfully!"
		});
        res.send({message: "Unregistered successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            logger.log({
				level: 'error',
				message: "Registration not found with id " + req.params.registerId
			});
			return res.status(404).send({
                message: "Registration not found with id " + req.params.registerId
            });                
        }
		logger.log({
			level: 'error',
			message: "Problem Unregistring with id " + req.params.registerId
		});
        return res.status(500).send({
            message: "Problem Unregistring with id " + req.params.registerId
        });
    });
};