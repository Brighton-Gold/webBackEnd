const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const classification_name = req.params.classificationName;
    const data = await invModel.getInventoryByClassificationId(classification_id);

    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();

    res.render("./inventory/classification", {
      title: classification_name + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error building classification view:", error); // Log error for debugging
    next(error);
  }
};



/* ***************************
 *  Build individual car details view
 * ************************** */
invCont.buildCarById = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    console.log("inv_id = ", inv_id);
    const data = await invModel.getCarById(inv_id);

    const detail = utilities.buildCarDetail(data);
    console.log("all details are ", detail);
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
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
    })
  }
}

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
invCont.editInventoryView = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getCarById(inv_id);
  const classificationList = await utilities.buildClassificationList();
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  //console.log(itemData)
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory
 * ************************** */  
invCont.updateInventory = async (req, res, next) => {
  const {
    inv_id,
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
  } = req.body;
  const data = await invModel.updateInventory(
    inv_id,
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
    req.flash("info", "Inventory updated successfully");
  } else {
    req.flash("errors", "Failed to update inventory");
  }
  res.redirect("/inv/management");
} 

module.exports = invCont;
