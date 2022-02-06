const e = require('express');
const fs = require('fs');
let writeJSON = require('../helper/helper');
let filename = './data/employees.json'

let objEmployees = {
    employees: []
};

function getEmployees(callback) {
    fs.readFile(filename, 'utf8', (err, doc) => {
        if (err) {
            callback({
                message: 'no Employees available',
                status: 202
            })
            return;
        };
        callback(JSON.parse(doc));
    });
}

function addEmployees(newEmployee) {
    fs.readFile(filename, 'utf8', (err, doc) => {
        if (err) {
            objEmployees.employees.push(newEmployee);
            writeJSON(filename, objEmployees);
            return;
        }
        let data = JSON.parse(doc)
        for(let i = 0; i < data.employees.length; i++){
            if(newEmployee.id == data.employees[i].id){
                return;
            }
        }
        objEmployees.employees.push(newEmployee);
        writeJSON(filename, objEmployees);
    });
}

module.exports = {
    getEmployees,
    addEmployees,
}