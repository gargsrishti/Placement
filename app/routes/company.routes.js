module.exports = (app) => {
    const company = require('../controllers/company.controller.js');

    // Create a new Company instance
    app.post('/company', company.create);

    // Retrieve all Companies
    app.get('/company', company.findAll);

    // Retrieve a single company data with companyId
    app.get('/company/:companyId', company.findOne);

    // Update a company with companyId
    app.put('/company/:companyId', company.update);

    // Delete a company with companyId
    app.delete('/company/:companyId', company.delete);
}