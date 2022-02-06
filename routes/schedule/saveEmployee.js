const axios = require('axios');
const employeesController = require('../../controller/employees.controller');

function getEmployee() {
    getEmployerHour( doc => {
        let employees = doc.employees;
        
        getScheduler(employees, doc => {
            let employerTime = {
                id: doc.employerHour.id,
                name: doc.employerHour.name,
                startsAt: hourToInt(doc.employerHour.startsAt),
                finishesAt: hourToInt(doc.employerHour.finishesAt),
                appointment: doc.appointment
            }
            for(let i = 0; i < employerTime.appointment.length; i++){
                employerTime.appointment[i].startsAt = hourToInt(employerTime.appointment[i].startsAt);
                employerTime.appointment[i].finishesAt = hourToInt(employerTime.appointment[i].finishesAt);
            }
            employeesController.saveEmployees(employerTime);
        }); 
    });
}

function hourToInt(hours){
    hours = hours.split(":", 2);
    let min = parseInt(hours[1]);
    let hour = parseInt(hours[0]) * 60 + min;
    return hour;
}

function getEmployerHour(callback){
    axios.get('https://api-homolog.geracaopet.com.br/api/challenges/challenge1/employees')
    .then(response => {
        callback(response.data);
    })
    .catch(error => {
        callback(error);
    });
}

function getScheduler(employers, callback){
    for(let employer of employers){
        axios.get(`https://api-homolog.geracaopet.com.br/api/challenges/challenge1/employee/${employer.id}/appointments`)
        .then(response => {
            let employee = {
                employerHour: employer,
                appointment: response.data.appointments
            }
            callback(employee);
        })
        .catch(error => {
            callback(error);
        });
    } 
}

module.exports = {getEmployee, hourToInt};
