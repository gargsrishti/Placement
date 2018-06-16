module.exports = (app) => {
    const register = require('../controllers/register.controller.js');

    // Create a new Register instance
    app.post('/register', register.create);

    // Retrieve all Entries
    app.get('/register', register.findAll);

    // Retrieve a single entry with registerId
    app.get('/register/:registerId', register.findOne);

    // Unregister
    app.delete('/register/:registerId', register.delete);
}