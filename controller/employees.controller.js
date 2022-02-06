employeesModel = require('../model/empolyees.model');

function saveEmployees(newEmployee){
    employeesModel.addEmployees(newEmployee);
}

function getEmployees(callback){
    employeesModel.getEmployees(callback);
}

module.exports = {getEmployees, saveEmployees}