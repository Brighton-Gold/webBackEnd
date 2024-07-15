const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const { validateClassificationName } = require('../utilities/validation');

// Route to build inventory by classification view
router.get("/type/:classificationId/:classificationName", invController.buildByClassificationId);

// Route to build individual car details view
router.get("/car/:inv_make/:inv_model/:inv_year", invController.buildCarById)

router.get("/management", invController.renderManagementView)

router.get("/add-inventory", invController.renderAddInventoryView)
router.get("/new-classification", utilities.validateClassificationName, invController.renderNewClassificationView)
module.exports = router;