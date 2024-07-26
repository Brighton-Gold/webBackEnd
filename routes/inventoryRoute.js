const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require('../utilities');
const classValidate = require('../utilities/invValidation.js');

// Route to build inventory by classification view
router.get("/type/:classificationId/:classificationName", invController.buildByClassificationId);

// Route to build individual car details view
router.get("/car/:inv_id", invController.buildCarById);

router.get("/management", invController.renderManagementView)

router.get("/add-inventory", invController.renderAddInventoryView)
router.get("/add-classification", invController.renderNewClassificationView)
router.get("/getInventory/:classification_id", invController.getInventoryJSON);

router.get("/edit-inventory/:inv_id", invController.editInventoryView)
router.get("/delete-inventory/:inv_id", invController.deleteInventory)
router.get("/edit-classification/:classification_id", invController.editClassificationView)

router.post(
    "/add-classification",
    classValidate.classificationRules(),
    classValidate.checkClassData,
    invController.addClassification,
    invController.renderNewClassificationView
)

router.post(
    "/add-inventory",
    classValidate.inventoryRules(),
    classValidate.checkInvData,
    invController.addInventory,
    invController.renderAddInventoryView
)

router.post(
    "/edit-inventory",
    classValidate.inventoryRules(),
    classValidate.checkUpdateInvData, 
    invController.updateInventory

)

router.post(
    "/delete-inventory", 
    invController.deleteInventory,
    invController.renderManagementView
)

module.exports = router;