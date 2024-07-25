const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* **************************************
 * Navigation Functions
 * ************************************ */

/* Constructs the nav HTML unordered list */
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
 * Inventory Functions
 * ************************************ */

/* Build the classification view HTML */
Util.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li style="list-style-type: none;">';
      grid += '<a href="../../car/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make
        + ' on CSE Motors" /></a>';
      grid += '<div class="namePrice"><hr /><h2>';
      grid += '<a href="../../car/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' details">' + vehicle.inv_make + '</a>';
      grid += '</h2></div></li>';
    });
    grid += '</ul>';
  }
  return grid;
};

/* Build the individual view HTML */
Util.buildCarDetail = function (car) {
  let detail = '<div class="car-detail">';
  detail +=
    '<img src="' + car.inv_image +
    '" alt="Image of ' + car.inv_make + " " + car.inv_model + '">';
  detail += "<p>Price: $" + new Intl.NumberFormat("en-US").format(car.inv_price) + "</p>";
  detail += "<p>Description: " + car.inv_description + "</p>";
  detail += "<p>Year: " + car.inv_year + "</p>";
  detail +=
    "<p>Mileage: " + new Intl.NumberFormat("en-US").format(car.inv_miles) + " miles</p>";
  detail += "<p>Color: " + car.inv_color + "</p>";
  detail += "</div>";
  return detail;
};

/* Build the Add Inventory Form */
Util.buildAddInventoryForm = function (formData = {}, classificationList) {
  let form = '<div class="inventory-container">';
  form += '<form action="/inv/add-inventory" method="POST" id="addInventoryForm">';
  form += '<label for="classification_id">Classification</label>';
  form += classificationList;
  form += '<label for="inv_make">Make</label>';
  form += `<input type="text" id="inv_make" name="inv_make" value="${formData.inv_make || ''}" required>`;
  form += '<label for="inv_model">Model</label>';
  form += `<input type="text" id="inv_model" name="inv_model" value="${formData.inv_model || ''}" required>`;
  form += '<label for="inv_description">Description</label>';
  form += `<textarea id="inv_description" name="inv_description" required>${formData.inv_description || ''}</textarea>`;
  form += '<label for="inv_image">Image Path</label>';
  form += `<input type="text" id="inv_image" name="inv_image" value="${formData.inv_image || '/images/no-image.png'}" required>`;
  form += '<label for="inv_thumbnail">Thumbnail Path</label>';
  form += `<input type="text" id="inv_thumbnail" name="inv_thumbnail" value="${formData.inv_thumbnail || '/images/no-image-thumbnail.png'}" required>`;
  form += '<label for="inv_price">Price</label>';
  form += `<input type="number" id="inv_price" name="inv_price" value="${formData.inv_price || ''}" required>`;
  form += '<label for="inv_year">Year</label>';
  form += `<input type="number" id="inv_year" name="inv_year" value="${formData.inv_year || ''}" required>`;
  form += '<label for="inv_miles">Mileage</label>';
  form += `<input type="number" id="inv_miles" name="inv_miles" value="${formData.inv_miles || ''}" required>`;
  form += '<label for="inv_color">Color</label>';
  form += `<input type="text" id="inv_color" name="inv_color" value="${formData.inv_color || ''}" required>`;
  form += '<button type="submit">Add Vehicle</button>';
  form += "</form></div>";
  return form;
};

/* **************************************
 * Classification Functions
 * ************************************ */

/* Build the Classification List for Select */
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

/* Build Only Classification List */
Util.buildOnlyClassificationList = async function () {
  let data = await invModel.getClassifications();
  let form = '<div class="classification-container">';
  form += '<form action="/inv/edit-classification" method="POST">';
  for (let i = 0; i < data.rows.length; i++) {
    let classification = data.rows[i];  
    form += "<a href='/inv/edit-classification/" + classification.classification_id + "'>" + classification.classification_name + "</a>";
    console.log(classification);
  }
  form += "</form></div>";
  return form;
};

/* Build the Add Classification Form */
Util.buildAddClassificationForm = function (formData = {}) {
  let form = '<div class="classification-container">';
  form += '<form action="/inv/add-classification" method="POST" id="addClassificationForm">';
  form += '<label for="classification_name">Classification Name</label>';
  form += `<input type="text" id="classification_name" name="classification_name" value="${formData.classification_name || ""}" required>`;
  form += '<button type="submit">Add Classification</button>';
  form += "</form></div>";
  return form;
};

/* Build the Update Classification Form */
Util.buildEditClassificationForm = function (formData = {}) {
  let form = '<div class="classification-container">';
  form += '<form action="/inv/update-classification" method="POST" id="updateClassificationForm">';
  form += `<input type="hidden" id="classification_id" name="classification_id" value="${formData.classification_id || ""}">`;
  form += '<label for="classification_name">Classification Name</label>';
  form += `<input type="text" id="classification_name" name="classification_name" value="${formData.classification_name || ""}" required>`;
  form += '<button type="submit">Save Classification</button>';
  form += '</form>';
  form += '<form action="/inv/delete-classification" method="POST" id="deleteClassificationForm">';
  form += `<input type="hidden" id="classification_id" name="classification_id" value="${formData.classification_id || ""}">`;
  form += '<button type="submit">Delete Classification</button>';
  form += "</form></div>";
  return form;
};

/* **************************************
 * Middleware Functions
 * ************************************ */

/* Check JWT Token */
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

/* Check Login */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    console.log("Logged in");
    res.redirect("/");
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* Check Account Level */
Util.checkAccountLevel = async (req, res, next) => {
  let accountData = await invModel.getAccountData(res.locals.accountData.account_id);
  console.log("account data = ", accountData);
};

module.exports = Util;
