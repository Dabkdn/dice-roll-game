const router = require('express').Router()
const weatherController = require('../controllers/api/weather.controller')

router.post('/get-weather', weatherController.getWeather)

module.exports = router