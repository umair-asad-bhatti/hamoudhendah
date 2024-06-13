const exporess = require('express')
const router = exporess.Router()
const test = require("../controllers/TestController")
const Auth = require("../controllers/AuthController")
const endPoints = require("../constants/endpoints")

// routes here
router.get(endPoints.test, test)
router.post(endPoints.signIn, Auth.signin)
router.post(endPoints.signUp, Auth.signup)
router.post(endPoints.verifyOTP, Auth.verifyOTP)



module.exports = router