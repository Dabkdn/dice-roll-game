const OpenWeather = require('@open-weather/index')
const getWeather = (req, res)  => {

    let openWeather = new OpenWeather(process.env.WEATHER_APPID);
    
    openWeather.getWeather(req.body.city)
    .then(data => {
        res.json(data)
    }).catch(err => {
        res.json({
            message: "not found"
        })
    })
}

module.exports = {
    getWeather
}