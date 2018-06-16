const mongoose = require('mongoose');

const Company = mongoose.Schema({
    name : { type : String , unique : true, required : true},
	salary : Number,
	dateofvisit: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Company', Company);