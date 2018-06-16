const mongoose = require('mongoose');
const Student = require('./student.model.js');
const Company = require('./company.model.js');

const register = mongoose.Schema({
    studentId : {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
	companyId : {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
});
register.index({studentId: 1, companyId: 1}, {unique: true});
module.exports = mongoose.model('register', register);