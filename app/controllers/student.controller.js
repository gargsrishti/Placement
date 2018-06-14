const Student = require('../models/student.model.js');
// Create and Save a new Student
exports.create = (req, res) => {
	// Validate request
    if(!req.body.name) {
        return res.status(400).send({
            message: "Student name is Mandatory"
        });
    }
	
	const student = new Student({
        name: req.body.name, 
        department: req.body.department || "Computer Science",
		rollno: req.body.rollno,
		cgpa: req.body.cgpa
    });

    // Save data in the database
    student.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the new student entry."
        });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
	Student.find()
    .then(students => {
        res.send(students);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving students data."
        });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
	Student.findById(req.params.studentId)
    .then(student => {
        if(!student) {
            return res.status(404).send({
                message: "Student not found with id " + req.params.studentId
            });            
        }
        res.send(student);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Student not found with id " + req.params.studentId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving student with id " + req.params.studentId
        });
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
	// Validate Request
    if(!req.body.name) {
        return res.status(400).send({
            message: "Student name can not be empty"
        });
    }

    // Find note and update it with the request body
    Student.findByIdAndUpdate(req.params.studentId, {
        name: req.body.name,
        department: req.body.department || "Computer Science",
		rollno: req.body.rollno,
		cgpa: req.body.cgpa
    }, {new: true})
    .then(student => {
        if(!student) {
            return res.status(404).send({
                message: "Student not found with id " + req.params.studentId
            });
        }
        res.send(student);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Student not found with id " + req.params.studentId
            });                
        }
        return res.status(500).send({
            message: "Error updating student with id " + req.params.studentId
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
	Student.findByIdAndRemove(req.params.studentId)
    .then(student => {
        if(!student) {
            return res.status(404).send({
                message: "Student not found with id " + req.params.studentId
            });
        }
        res.send({message: "Student deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Student not found with id " + req.params.studentId
            });                
        }
        return res.status(500).send({
            message: "Could not delete student with id " + req.params.studentId
        });
    });
};