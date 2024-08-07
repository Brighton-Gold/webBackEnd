const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountsController");
const utilities = require("../utilities");
const home = require("../controllers/baseController");
const regValidate = require('../utilities/account-validation');

// Route to build the login view
router.get("/login", accountController.buildLoginView);

// Route to build the registration view
router.get("/register", accountController.buildRegistrationView);

// Route to check if logged in
router.get("/", 
  utilities.checkLogin, 
  utilities.checkAccountLevel,
  accountController.buildAccountManagementView
);


// Route to handle registration
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  accountController.registerAccount
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(), 
  regValidate.checkLoginData,
  accountController.accountLogin
);


// Route to handle logout
router.get('/logout', accountController.accountLogout);



// Catch all for unexpected errors
router.use((req, res, next) => {
  next({ status: 404, message: 'Unexpected Error' });
});

module.exports = router;
