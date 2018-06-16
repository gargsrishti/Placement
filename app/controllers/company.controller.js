const Company = require('../models/company.model.js');
var validator = require('validator');

const winston = require('winston')
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
require('console-stamp')(logger, '[HH:MM:ss.l]');

// Create and Save a new Company
exports.create = (req, res) => {
	// Validate request
    if(validator.isEmpty(req.body.name)) {
		logger.log({
			level: 'error',
			message: "Company name is Mandatory"
		});
        return res.status(400).send({
            message: "Company name is Mandatory"
        });
    }
	
	const company = new Company({
        name: validator.trim(req.body.name), 
        salary: req.body.salary,
		date: req.body.date
    });

    // Save data in the database
    company.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
		logger.log({
			level: 'error',
			message: err.message || "Some error occurred while creating the new company entry."
		});
        res.status(500).send({
            message: err.message || "Some error occurred while creating the new company entry."
        });
    });
	logger.log({
		level: 'info',
		message: 'Company registered Successfully'
	});
};

// Retrieve and return all company data from the database.
exports.findAll = (req, res) => {
	logger.log({
		level: 'info',
		message: 'Retrieving data for all companies'
	});
	Company.find()
    .then(company => {
        res.send(company);
    }).catch(err => {
		logger.log({
			level: 'error',
			message: err.message || "Some error occurred while retrieving company data."
		});
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving company data."
        });
    });
};

// Find a single company with a companyId
exports.findOne = (req, res) => {
	logger.log({
		level: 'info',
		message: 'Retrieving company data with id' + req.params.companyId
	});
	Company.findById(req.params.companyId)
    .then(company => {
        if(!company) {
			logger.log({
				level: 'error',
				message: "Company not found with id " + req.params.companyId
			});
            return res.status(404).send({
                message: "Company not found with id " + req.params.companyId
            });            
        }
        res.send(company);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            logger.log({
				level: 'error',
				message: "Company not found with id " + req.params.companyId
			});
			return res.status(404).send({
                message: "Company not found with id " + req.params.companyId
            });                
        }
		logger.log({
			level: 'error',
			message: "Error retrieving company with id " + req.params.companyId
		});
        return res.status(500).send({
            message: "Error retrieving company with id " + req.params.companyId
        });
    });
};

// Update a company identified by the companyId in the request
exports.update = (req, res) => {
	logger.log({
		level: 'info',
		message: 'Trying to update company data with id' + req.params.companyId
	});
	// Validate Request
    if(!req.body.name) {
		logger.log({
			level: 'error',
			message: "Company name can not be empty"
		});
        return res.status(400).send({
            message: "Company name can not be empty"
        });
    }

    // Find company and update it with the request body
    Company.findByIdAndUpdate(req.params.companyId, {
        name: req.body.name, 
        salary: req.body.salary,
		date: req.body.date
    }, {new: true})
    .then(company => {
        if(!company) {
			logger.log({
				level: 'error',
				message: "Company not found with id " + req.params.companyId
			});
            return res.status(404).send({
                message: "Company not found with id " + req.params.companyId
            });
        }
        res.send(company);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            logger.log({
				level: 'error',
				message: "Company not found with id " + req.params.companyId
			});
			return res.status(404).send({
                message: "Company not found with id " + req.params.companyId
            });                
        }
		logger.log({
			level: 'error',
			message: "Error updating company with id " + req.params.companyId
		});
        return res.status(500).send({
            message: "Error updating company with id " + req.params.companyId
        });
    });
};

// Delete a company data with the specified companyId in the request
exports.delete = (req, res) => {
	Company.findByIdAndRemove(req.params.companyId)
    .then(company => {
        if(!company) {
            logger.log({
				level: 'error',
				message: "Company not found with id " + req.params.companyId
			});
			return res.status(404).send({
                message: "Company not found with id " + req.params.companyId
            });
        }
		logger.log({
			level: 'info',
			message: "Company data deleted successfully!"
		});
        res.send({message: "Company data deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            logger.log({
				level: 'error',
				message: "Company not found with id " + req.params.companyId
			});
			return res.status(404).send({
                message: "Company not found with id " + req.params.companyId
            });                
        }
		logger.log({
			level: 'error',
			message: "Could not delete company with id " + req.params.companyId
		});
        return res.status(500).send({
            message: "Could not delete company with id " + req.params.companyId
        });
    });
};