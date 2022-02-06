const employeesController = require('../../controller/employees.controller');
const saveEmployee = require('./saveEmployee');

saveEmployee.getEmployee();

function getAvailableTime(req, res) {
    employeesController.getEmployees(doc => {
        let employees = [];
        doc.employees.sort((a, b) => {
            return a.id - b.id;
        });

        for (let i = 0; i < doc.employees.length; i++) {
            let employeeHour = {
                availableTime: []
            }

            for (let j = doc.employees[i].startsAt; j <= doc.employees[i].finishesAt; j += 30) {
                employeeHour.availableTime.push(j);
            }

            employeeHour.id = doc.employees[i].id;
            employeeHour.name = doc.employees[i].name;
            employees.push(employeeHour)
        }

        employees.sort((a, b) => {
            return a.id - b.id;
        });

        for (let i = 0; i < doc.employees.length; i++) {
            let businessTime = recursivilyFunc(doc.employees[i]);
            for (let j = 0; j < businessTime.appointments.length; j++) {
                let index = employees[i].availableTime.indexOf(businessTime.appointments[j])
                employees[i].availableTime.splice(index, 1);
            }
            intToHour(employees[i].availableTime)
        }

        res.status(200).json({ employeeAvailableTime: employees })
    });
}

function intToHour(employeeAvailableTime) {
    for (let i = 0; i < employeeAvailableTime.length; i++) {
        if (employeeAvailableTime[i] % 60 == 0) {
            employeeAvailableTime[i] /= 60;
            employeeAvailableTime[i] = employeeAvailableTime[i].toString() + ":" + '00';
        }
        else {
            employeeAvailableTime[i] /= 60;
            let min = employeeAvailableTime[i] - Math.trunc(employeeAvailableTime[i]);
            min *= 60;
            employeeAvailableTime[i] = Math.trunc(employeeAvailableTime[i]).toString() + ":" + min.toString();
        }
    }
}

function recursivilyFunc(employee) {
    let employeeAppointments = {
        id: employee.id,
        name: employee.name,
        appointments: []
    }

    for (let i = 0; i < employee.appointment.length; i++) {
        if ((employee.appointment[i].startsAt % 60 != 0) && (employee.appointment[i].startsAt % 60 != 30)) {
            employee.appointment[i].startsAt -= 1;
            recursivilyFunc(employee);
        }

        if ((employee.appointment[i].finishesAt % 60 != 0) && (employee.appointment[i].finishesAt % 60 != 30)) {
            employee.appointment[i].finishesAt += 1;
            recursivilyFunc(employee);
        }

        for (let j = employee.appointment[i].startsAt; j <= employee.appointment[i].finishesAt; j += 30) {
            employeeAppointments.appointments.push(j);
        }
    }

    return employeeAppointments;
}

module.exports = getAvailableTime;