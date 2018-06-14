const mongoose = require('mongoose');

const Students = mongoose.Schema({
    name : String,
	department : String,
	rollno : Number,
	cgpa : Number
});

module.exports = mongoose.model('Student', Students);