const axios = require('axios')
class OpenWeather {
    
    static get BASE_URL() {
        return 'https://api.openweathermap.org/data/2.5';
    }

    constructor(appid) {
        this.appid = appid;
    }

    setCityName(cityName) {
        this.cityName = cityName;
    }
    getCityName() {
        return this.cityName;
    }
    getAppid() {
        return this.appid;
    }
    getUrl() {
        return `${OpenWeather.BASE_URL}/weather?q=${this.cityName}&appid=${this.appid}`;
    }
    
    getWeather(cityName) {
        return new Promise((resolve, reject) => {
            let url = `${OpenWeather.BASE_URL}/weather?q=${cityName}&appid=${this.appid}`;

            axios.get(url).then(res => {
                resolve({
                    temp: res.data.main.temp,
                    city: res.data.name
                })
            }).catch(err => {
                reject(err)
            })
        })  
    }
}
module.exports =  OpenWeather;