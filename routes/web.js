// packages
const router = require('express').Router()

// controllers
const {
    aboutController,
    contactController,
    homeController,
    loginController,
    weatherController,
    registerController,
    diceController
} = require('../controllers/web')

//middlewares
const {
    login,
    modifyResponse,
    register
    } = require('../middlewares')

router.use(modifyResponse)

router.get('/', homeController.home)

router.get('/contact', contactController.contact)

router.get('/about', aboutController.about)

router.get('/weather', login.requireLogin, weatherController.getWeather)

router.get('/login', login.isLogged, loginController.view)

router.post('/login', loginController.login)

router.get('/logout', login.requireLogin, loginController.logout)

router.get('/register', registerController.view)

router.post('/register', register.validateFromInput, register.validateFromDb, registerController.register)

router.get('/dice', login.requireLogin, diceController.view)

module.exports = router;