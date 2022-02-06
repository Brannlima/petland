const employeesController = require('../../controller/employees.controller');
const saveEmployee = require('./saveEmployee');

saveEmployee.getEmployee();

function getAvailableTime(req, res) {
    employeesController.getEmployees(doc => {
        let canStartsAt = doc.employees[0].startsAt;
        let canFinishesAt = doc.employees[0].finishesAt;
        let availableTime = [];

        for (let i = 0; i < doc.employees.length; i++) {
            if (canStartsAt > doc.employees[i].startsAt) canStartsAt = doc.employees[i].startsAt;
            if (canFinishesAt < doc.employees[i].finishesAt) canFinishesAt = doc.employees[i].finishesAt;
        }

        for (let i = canStartsAt; i <= canFinishesAt; i += 30) {
            for (let j = 0; j < doc.employees.length; j++) {
                if (doc.employees[j].startsAt <= i && doc.employees[j].finishesAt >= i) {
                    availableTime.push(i);
                }
            }

        }

        for (let i = 0; i < doc.employees.length; i++) {
            let businessTime = recursivilyFunc(doc.employees[i]);
            for (let j = 0; j < businessTime.length; j++) {
                let index = availableTime.indexOf(businessTime[j])
                availableTime.splice(index, 1);
            }
        }

        for (let i = 0; i < availableTime.length; i++) {
            let item = availableTime[i];
            availableTime = availableTime.filter(function (item, i, availableTime) {
                return availableTime.indexOf(item) == i;
            });
        }

        intToHour(availableTime);
        res.status(200).json({ availableTime: availableTime })
    });
}

function intToHour(availableTime) {
    for (let i = 0; i < availableTime.length; i++) {
        if (availableTime[i] % 60 == 0) {
            availableTime[i] /= 60;
            availableTime[i] = availableTime[i].toString() + ":" + '00';
        } else {
            availableTime[i] /= 60;
            let min = availableTime[i] - Math.trunc(availableTime[i]);
            min *= 60;
            availableTime[i] = Math.trunc(availableTime[i]).toString() + ":" + min.toString();
        }
    }
}

function recursivilyFunc(employee) {
    let busiTime = [];
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
            busiTime.push(j);
        }
    }

    return busiTime;
}

module.exports = getAvailableTime;