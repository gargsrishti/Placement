const mongoose = require('mongoose');

const Company = mongoose.Schema({
    name : String,
	salary : Number,
	dateofvisit: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Company', Company);