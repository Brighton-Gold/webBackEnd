const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")


const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build individual car details view
 * ************************** */
invCont.buildCarById = async function (req, res, next) {
  const inv_make = req.params.inv_make
  const inv_model = req.params.inv_model
  const inv_year = req.params.inv_year
  const data = await invModel.getCarById(inv_make, inv_model, inv_year)
  const detail = await utilities.buildCarDetail(data)
  let nav = await utilities.getNav()
  res.render("./inventory/car", {
    title: inv_make + " " + inv_model,
    nav,
    car: data,
    detail,
  })
}

/* ***************************
 *  Render Inventory Management View
 * ************************** */
invCont.renderManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let list = await utilities.buildManagementGrid()
  res.render("./inventory/management", {
      title: "Manage Inventory",
      nav,
      list,
      errors: null
  })
}

/* ***************************
 *  Render Add New Inventory View
 * ************************** */
invCont.renderAddInventoryView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    let formData = req.body || {};
    let form = utilities.buildAddInventoryForm(formData, classificationList);
    
    res.render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      form,
      messages: req.flash("info"),
      errors: req.flash("errors")
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont