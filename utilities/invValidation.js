const classModel = require('../models/inventory-model');
const utilities = require('./index');
const { body, validationResult } = require("express-validator")
const view = require('../controllers/invController');
const validate = {}

/* ***************************
*  Rules for adding classification
* ************************** */
validate.classificationRules = () => {
    return [
        body('classification_name')
            .trim()
            .isLength({ min: 3 }).withMessage('Classification must be at least 3 characters long')
            .matches(/^[a-zA-Z\s]*$/).withMessage('Classification can only be made with letters')
            .notEmpty().withMessage('Classification is required')

    ]
}

/* ***************************
*  Rules for adding inventory
* ************************** */
validate.inventoryRules = () => {
    return [
      body('inv_make')
        .trim()
        .isLength({ min: 2 }).withMessage('Make must be at least 2 characters long')
        .matches(/^[a-zA-Z\s]*$/).withMessage('Make can only contain letters and spaces')
        .notEmpty().withMessage('Make is required'),
  
      body('inv_model')
        .trim()
        .isLength({ min: 1 }).withMessage('Model must be at least 1 character long')
        .matches(/^[a-zA-Z0-9\s]*$/).withMessage('Model can only contain letters, numbers, and spaces')
        .notEmpty().withMessage('Model is required'),
  
      body('inv_description')
        .trim()
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long')
        .notEmpty().withMessage('Description is required'),
  
      body('inv_price')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number')
        .notEmpty().withMessage('Price is required'),
  
      body('inv_year')
        .isInt({ min: 1886, max: new Date().getFullYear() + 1 }).withMessage('Year must be a valid year')
        .notEmpty().withMessage('Year is required'),
  
      body('inv_miles')
        .isInt({ min: 0 }).withMessage('Mileage must be a positive integer')
        .notEmpty().withMessage('Mileage is required'),
  
      body('inv_color')
        .trim()
        .matches(/^[a-zA-Z\s]*$/).withMessage('Color can only contain letters and spaces')
        .notEmpty().withMessage('Color is required')
    ];
  };
  
/* ******************************
* Check classification data and return errors or adds
* ***************************** */
validate.checkClassData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    let form = utilities.buildAddClassificationForm()
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            form,
            messages: "Could not add new Classification",
            title: "Add New Classification",
            nav,
        })
        return
    }
    next()
}

/* ******************************
* Check inventory data and return errors or adds
* ***************************** */
validate.checkInvData = async (req, res, next) => {
    let errors = validationResult(req);
    let formData = req.body;
    let classificationList = await utilities.buildClassificationList();
    let form = utilities.buildAddInventoryForm(formData, classificationList);

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-inventory", {
            errors: errors.array(),
            form,
            messages: req.flash("could not add inventory"),
            title: "Add New Inventory",
            nav,
        });
        return;
    }
    next();
};

/* ******************************
* Check updated inventory data and return errors or adds
* ***************************** */
validate.checkUpdateInvData = async (req, res, next) => {
    let errors = validationResult(req);
    let formData = req.body;
    let inv_id = req.body.inv_id;
    let classificationList = await utilities.buildClassificationList();
    let form = utilities.buildAddInventoryForm(formData, classificationList);

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/edit-inventory", {
            errors: errors.array(),
            form,
            messages: req.flash("could not update inventory"),
            title: "Edit Inventory Item",
            nav,
            inv_id,
        });
        return;
    }
    next();
};

/* ******************************
* Check updated classification data and return errors or adds
* ***************************** */
validate.checkUpdateClassData = async (req, res, next) => {
    let errors = validationResult(req);
    let formData = req.body;
    let classification_id = req.body.classification_id;
    let form = utilities.buildAddClassificationForm(formData);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/edit-classification", {
            errors: errors.array(),
            form,
            messages: req.flash("could not update classification"),
            title: "Edit Classification",
            nav,
            inv_id,
        });
        return;
    }
    next();
};

validate.updateInventoryRules = () => {
    return [
        // Existing validation rules for other fields
        body('inv_make')
            .trim()
            .isLength({ min: 2 }).withMessage('Make must be at least 2 characters long')
            .matches(/^[a-zA-Z\s]*$/).withMessage('Make can only contain letters and spaces')
            .notEmpty().withMessage('Make is required'),

        body('inv_model')
            .trim()
            .isLength({ min: 1 }).withMessage('Model must be at least 1 character long')
            .matches(/^[a-zA-Z0-9\s]*$/).withMessage('Model can only contain letters, numbers, and spaces')
            .notEmpty().withMessage('Model is required'),

        body('inv_description')
            .trim()
            .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long')
            .notEmpty().withMessage('Description is required'),

        body('inv_price')
            .isFloat({ min: 0 }).withMessage('Price must be a positive number')
            .notEmpty().withMessage('Price is required'),

        body('inv_year')
            .isInt({ min: 1886, max: new Date().getFullYear() + 1 }).withMessage('Year must be a valid year')
            .notEmpty().withMessage('Year is required'),

        body('inv_miles')
            .isInt({ min: 0 }).withMessage('Mileage must be a positive integer')
            .notEmpty().withMessage('Mileage is required'),

        body('inv_color')
            .trim()
            .matches(/^[a-zA-Z\s]*$/).withMessage('Color can only contain letters and spaces')
            .notEmpty().withMessage('Color is required'),

        body('inv_image')
            .trim()
            .isURL().withMessage('Image must be a valid URL')
            .optional({ checkFalsy: true }), // Optional, but if present must be a valid UR

         body('inv_thumbnail')
             .trim()
             .isURL().withMessage('Thumbnail must be a valid URL')
             .optional({ checkFalsy: true }) // Optional, but if present must be a valid URL
    ];
}


module.exports = validate;
