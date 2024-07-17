const classModel = require('../models/inventory-model');
const utilities = require('./index');
const { body, validationResult } = require("express-validator")
const view = require('../controllers/invController');
const validate = {}

validate.classificationRules = () => {
    return [
        body('classification_name')
            .trim()
            .isLength({ min: 3 }).withMessage('Classification must be at least 3 characters long')
            .matches(/^[a-zA-Z\s]*$/).withMessage('Classification can only be made with letters')
            .notEmpty().withMessage('Classification is required')
            .custom(async (classification) => {
                const classExist = await classModel.v(classification);
                if (classExist) {
                    throw new Error("That Classification is already in use");
                }
            })
    ]
}

/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    let form = utilities.buildAddClassificationForm()
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            form,
            //add if statement to checif added successfully
            messages: "Successfully added new Classification",
            title: "Add New Classification",
            nav,
        })
        return
    }
    next()

}

module.exports = validate;
