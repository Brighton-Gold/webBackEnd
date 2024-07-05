
const express = require("express")

const router = new express.Router()

const accountController = require("../controllers/accountsController")

const utilities = require("../utilities")

const regValidate = require('../utilities/account-validation')

router.get("/login", accountController.buildLogin)

router.get("/register", accountController.buildRegister)

router.post("/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  accountController.registerAccount
)


router.use(async (req, res, next) => {
  next({ status: 404, message: 'Unexpected Error' })
})

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;