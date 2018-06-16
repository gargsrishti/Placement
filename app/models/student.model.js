const mongoose = require('mongoose');
const Company = require('./company.model.js');

const Students = mongoose.Schema({
    name : { type : String },
	department : { type : String},
	rollno : { type : Number , unique : true, required : true},
	cgpa : {type:Number, min: [60, 'Not eligible'], max:100},
	emailid : { type : String , unique : true, required : true},
	companyRegister : [
		{type: mongoose.Schema.Types.ObjectId, ref: 'Company'}
	]
});

module.exports = mongoose.model('Student', Students);