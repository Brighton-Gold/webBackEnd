const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();

    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build individual car details view
 * ************************** */
invCont.buildCarById = async function (req, res, next) {
  try {
    const inv_make = req.params.inv_make;
    const inv_model = req.params.inv_model;
    const inv_year = req.params.inv_year;
    const data = await invModel.getCarById(inv_make, inv_model, inv_year);
    const detail = await utilities.buildCarDetail(data);
    let nav = await utilities.getNav();
    res.render("./inventory/car", {
      title: inv_make + " " + inv_model,
      nav,
      car: data,
      detail,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Render Inventory Management View
 * ************************** */
invCont.renderManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let list = await utilities.buildManagementGrid();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/inventoryManagement", {
      title: "Manage Inventory",
      nav,
      list,
      classificationSelect,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

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
      errors: req.flash("errors"),
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Render Add New Classification View
 * ************************** */
invCont.renderNewClassificationView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let form = utilities.buildAddClassificationForm();
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      form,
      messages: req.flash("info"),
      errors: req.flash("errors"),
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Add New Classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    const data = await invModel.addClassification(classification_name);
    if (data) {
      req.flash("info", "Classification added successfully");
    } else {
      req.flash("errors", "Failed to add classification");
    }
    res.redirect("./add-classification");
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Add New Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;
    const data = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    );
    if (data) {
      req.flash("info", "inventory added successfully");
    } else {
      req.flash("errors", "Failed to add inventory");
    }
    res.redirect("./add-inventory");
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Render Edit Inventory View
 * ************************** */
invCont.renderEditInventoryView = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  const invData = await invModel.getInventoryById(inv_id);
  const classificationList = await utilities.buildClassificationList();
  const form = utilities.buildEditInventoryForm(invData, classificationList);
  res.render("./inventory/edit-inventory", {
    title: "Edit Inventory",
    nav: await utilities.getNav(),
    form,
    messages: req.flash("info"),
    errors: req.flash("errors"),
  });
};

module.exports = invCont;
