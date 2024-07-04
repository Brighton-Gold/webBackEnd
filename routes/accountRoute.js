
const express = require("express")

const router = new express.Router()

const accountController = require("../controllers/accountsController")

const utilities = require("../utilities")



router.get("/login", accountController.buildLogin)

router.get("/register", accountController.buildRegister)

router.post("/register", accountController.registerAccount)


router.use(async (req, res, next) => {
  next({status: 404, message: 'Unexpected Error'})
})
module.exports = router;