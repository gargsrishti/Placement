const Student = require('../models/student.model.js');
var validator = require('validator');

const winston = require('winston')
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
require('console-stamp')(logger, '[HH:MM:ss.l]');


// Create and Save a new Student data
exports.create = (req, res) => {
	// Validate request
    if(!req.body.name || !validator.isAlpha(req.body.name)) {
		logger.log({
			level: 'error',
			message: 'Student name is Mandatory and must have characters only.'
		});
        return res.status(400).send({
            message: "Student name is Mandatory and must have characters only."
        });
    }
	
	if(!validator.isEmail(req.body.emailid)) {
		logger.log({
			level: 'error',
			message: 'Email address is invalid'
		});
        return res.status(400).send({
            message: "Email address is invalid"
        });
    }
	
	if(!req.body.department) {
		logger.log({
			level: 'warn',
			message: 'No department provided.... Using Computer Science as default'
		});
    }
	
	const student = new Student({
        name: validator.trim(req.body.name), //removing extra characters (Sanitizer)
        department: validator.trim(req.body.department) || "Computer Science",
		rollno: req.body.rollno,
		cgpa: req.body.cgpa,
		emailid: validator.normalizeEmail(req.body.emailid) //sanitizer
    });
	/*if (req.body.companyRegister)
	{
		student.companyRegister.push(req.body.companyRegister);
	}*/
    // Save data in the database
    student.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
		logger.log({
			level: 'error',
			message: err.message || "Some error occurred while creating the new student entry."
		});
        res.status(500).send({
            message: err.message || "Some error occurred while creating the new student entry."
        });
    });
	logger.log({
		level: 'info',
		message: 'Student Entry created Successfully'
	});
};

// Retrieve and return all student data from the database.
exports.findAll = (req, res) => {
	logger.log({
		level: 'info',
		message: 'Retrieving data for all students'
	});
	Student.find()
    .then(students => {
        res.send(students);
    }).catch(err => {
		logger.log({
			level: 'error',
			message: err.message || "Some error occurred while creating the new student entry."
		});
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving students data."
        });
    });
};

// Find a single student with a studentId
exports.findOne = (req, res) => {
	logger.log({
		level: 'info',
		message: 'Retrieving Student data with id '+ req.params.studentId
	});
	Student.findById(req.params.studentId)
    .then(student => {
        if(!student) {
			logger.log({
				level: 'error',
				message: "Student not found with id " + req.params.studentId
			});
            return res.status(404).send({
                message: "Student not found with id " + req.params.studentId
            });            
        }
        res.send(student);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
			logger.log({
				level: 'error',
				message: "Student not found with id " + req.params.studentId
			});
            return res.status(404).send({
                message: "Student not found with id " + req.params.studentId
            });                
        }
		logger.log({
			level: 'error',
			message: "Error retrieving student with id " + req.params.studentId
		});
        return res.status(500).send({
            message: "Error retrieving student with id " + req.params.studentId
        });
    });
};

// Update a student data identified by the studentId in the request
exports.update = (req, res) => {
	logger.log({
		level: 'info',
		message: 'Trying to update student data with id' + req.params.studentId
	});
	// Validate Request
    /*if(!req.body.name) {
		logger.log({
			level: 'error',
			message: "Student name can not be empty"
		});
        return res.status(400).send({
            message: "Student name can not be empty"
        });
    }*/
	
	var name, department, rollno, cgpa, emailid;
	//Retrieving Student data
	Student.findById(req.params.studentId)
    .then(student => {
        if(!student) {
			logger.log({
				level: 'error',
				message: "Student not found with id " + req.params.studentId
			});
            return res.status(404).send({
                message: "Student not found with id " + req.params.studentId
            });            
        }
		name = student.name;
        department = student.department;
		rollno = student.rollno;
		cgpa = student.cgpa;
		emailid = student.emailid;
		
    }).catch(err => {
        if(err.kind === 'ObjectId') {
			logger.log({
				level: 'error',
				message: "Student not found with id " + req.params.studentId
			});
            return res.status(404).send({
                message: "Student not found with id " + req.params.studentId
            });                
        }
		logger.log({
			level: 'error',
			message: "Error retrieving student with id " + req.params.studentId
		});
        return res.status(500).send({
            message: "Error retrieving student with id " + req.params.studentId
        });
    });
	console.log(name);
		console.log(department);
		console.log(cgpa);
		console.log(rollno);
		console.log(emailid);
    // Find student data and update it with the request body
    Student.findByIdAndUpdate(req.params.studentId, {
        name: req.body.name || name,
        department: req.body.department || department,
		rollno: req.body.rollno || rollno,
		cgpa: req.body.cgpa || cgpa,
    }, {new: true})
    .then(student => {
        if(!student) {
			logger.log({
				level: 'error',
				message: "Student not found with id " + req.params.studentId
			});
            return res.status(404).send({
                message: "Student not found with id " + req.params.studentId
            });
        }
        res.send(student);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
			logger.log({
				level: 'error',
				message: "Student not found with id " + req.params.studentId
			});
            return res.status(404).send({
                message: "Student not found with id " + req.params.studentId
            });                
        }
		logger.log({
				level: 'error',
				message: "Error updating student with id " + req.params.studentId
		});
        return res.status(500).send({
            message: "Error updating student with id " + req.params.studentId
        });
    });
};

// Delete a student data with the specified studentId in the request
exports.delete = (req, res) => {
	Student.findByIdAndRemove(req.params.studentId)
    .then(student => {
        if(!student) {
			logger.log({
				level: 'error',
				message: "Error updating student with id " + req.params.studentId
			});
            return res.status(404).send({
                message: "Student not found with id " + req.params.studentId
            });
        }
		logger.log({
				level: 'info',
				message: "Student deleted successfully!"
		});
        res.send({message: "Student deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
			logger.log({
				level: 'error',
				message: "Student not found with id " + req.params.studentId
			});
            return res.status(404).send({
                message: "Student not found with id " + req.params.studentId
            });                
        }
		logger.log({
				level: 'error',
				message: "Could not delete student with id " + req.params.studentId
			});
        return res.status(500).send({
            message: "Could not delete student with id " + req.params.studentId
        });
    });
};