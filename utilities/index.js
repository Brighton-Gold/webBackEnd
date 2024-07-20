const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();

  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      "/" +
      row.classification_name +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};
/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = "";  // Initialize the grid variable

  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li style="list-style-type: none;">';
      grid +=
        '<a href="/car/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="/car/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';  // Initialize the grid variable when data is empty
  }
  return grid;
};

/* **************************************
 * Build the individual view HTML
 * ************************************ */
Util.buildCarDetail = function (car) {
  let detail = '<div class="car-detail">';
  detail +=
    '<img src="' +
    car.inv_image +
    '" alt="Image of ' +
    car.inv_make +
    " " +
    car.inv_model +
    '">';
  detail +=
    "<p>Price: $" +
    new Intl.NumberFormat("en-US").format(car.inv_price) +
    "</p>";
  detail += "<p>Description: " + car.inv_description + "</p>";
  detail += "<p>Year: " + car.inv_year + "</p>";
  detail +=
    "<p>Mileage: " +
    new Intl.NumberFormat("en-US").format(car.inv_miles) +
    " miles</p>";
  detail += "<p>Color: " + car.inv_color + "</p>";
  detail += "</div>";
  return detail;
};

/* **************************************
 * Build the management view HTML
 * ************************************ */
Util.buildManagementGrid = async function (req, res, next) {
  let list = "<div class = 'management'><ul>";
  list += "<p><a href=/inv/add-classification>Add New Classification</a></p>";
  list += "<p><a href=/inv/add-inventory>Add New Inventory</a></p>";
  list += "</ul></div>";
  list += "<h2>Current Inventory</h2>";
  list += "<table id=inventoryDisplay></table>";
  list += "<noscript>JavaScript must be enabled to use this page.</noscript>";
  return list;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    res.locals.loggedin = false;

    next();
  }
};

/* ****************************************
 * Middleware to check classification name validity
 **************************************** */
Util.validateClassification = async (req, res, next) => {
  let classification_name = req.body.classification_name;
  let data = await invModel.getClassifications();
  let classificationList = data.rows;
  let classificationNames = classificationList.map((classification) => {
    return classification.classification_name;
  });
  if (classificationNames.includes(classification_name)) {
    req.flash("notice", "Classification already exists.");
    return res.redirect("/inv/add-classification");
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  Check Classifications
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 *  Add inventory Form
 * ************************************ */
Util.buildAddInventoryForm = function (formData = {}, classificationList) {
  let form = '<div class="inventory-container">';

  form +=
    '<form action="/inv/add-inventory" method="POST" id="addInventoryForm">';

  form += '<label for="classification_id">Classification</label>';
  form += classificationList;

  form += '<label for="inv_make">Make</label>';
  form += `<input type="text" id="inv_make" name="inv_make" value="${
    formData.inv_make || ""
  }" required>`;

  form += '<label for="inv_model">Model</label>';
  form += `<input type="text" id="inv_model" name="inv_model" value="${
    formData.inv_model || ""
  }" required>`;

  form += '<label for="inv_description">Description</label>';
  form += `<textarea id="inv_description" name="inv_description" required>${
    formData.inv_description || ""
  }</textarea>`;

  form += '<label for="inv_image">Image Path</label>';
  form += `<input type="text" id="inv_image" name="inv_image" value="${
    formData.inv_image || "/images/no-image.png"
  }" required>`;

  form += '<label for="inv_thumbnail">Thumbnail Path</label>';
  form += `<input type="text" id="inv_thumbnail" name="inv_thumbnail" value="${
    formData.inv_thumbnail || "/images/no-image-thumbnail.png"
  }" required>`;

  form += '<label for="inv_price">Price</label>';
  form += `<input type="number" id="inv_price" name="inv_price" value="${
    formData.inv_price || ""
  }" required>`;

  form += '<label for="inv_year">Year</label>';
  form += `<input type="number" id="inv_year" name="inv_year" value="${
    formData.inv_year || ""
  }" required>`;

  form += '<label for="inv_miles">Mileage</label>';
  form += `<input type="number" id="inv_miles" name="inv_miles" value="${
    formData.inv_miles || ""
  }" required>`;

  form += '<label for="inv_color">Color</label>';
  form += `<input type="text" id="inv_color" name="inv_color" value="${
    formData.inv_color || ""
  }" required>`;

  form += '<button type="submit">Add Vehicle</button>';
  form += "</form>";

  form += "</div>";

  return form;
};

/* ****************************************
 *  Add New Classification Form
 * ************************************ */
Util.buildAddClassificationForm = function (formData = {}) {  
  let form = '<div class="classification-container">';
  form +=
    '<form action="/inv/add-classification" method="POST" id="addClassificationForm">';
  form += '<label for="classification_name">Classification Name</label>';
  form += `<input type="text" id="classification_name" name="classification_name" value="${
    formData.classification_name || ""
  }" required>`;
  form += '<button type="submit">Add Classification</button>';
  form += "</form>";
  form += "</div>";
  return form;
} 


module.exports = Util;
