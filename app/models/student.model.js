const mongoose = require('mongoose');

const Students = mongoose.Schema({
    name : { type : String },
	department : { type : String, required:true},
	rollno : { type : Number , unique : true, required : true},
	cgpa : {type:Number, min: [60, 'Not eligible'], max:100, required:true},
	emailid : { type : String , unique : true, required : true}
});

module.exports = mongoose.model('Student', Students);