const mongoose = require('mongoose');
const Student = require('/student.model.js');

const register = mongoose.Schema({
    studentId : ObjectId,
	department : String,
	rollno : Number,
	cgpa : Number
});

module.exports = mongoose.model('Student', Students);