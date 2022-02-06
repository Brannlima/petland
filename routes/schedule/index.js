const router = require('express').Router()

const getAvailableTime = require('./getAvailableTime');
const getAvailableTimeArray = require('./getAvailableTimeArray');

router.get("/available-time", getAvailableTime)
router.get("/available-time-array", getAvailableTimeArray)

module.exports = router
