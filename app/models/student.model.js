const mongoose = require('mongoose');
const Company = require('./company.model.js');

const Students = mongoose.Schema({
    name : { type : String , required : true},
	department : { type : String , required : true},
	rollno : { type : Number , unique : true, required : true},
	cgpa : Number,
	emailid : { type : String , unique : true, required : true},
	companyRegister : [
		{type: mongoose.Schema.Types.ObjectId, ref: 'Company'}
	]
});

module.exports = mongoose.model('Student', Students);