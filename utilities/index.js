const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li style = "list-style-type: none;">';
      grid +=
        '<a href="../../car/' +
        vehicle.inv_make +
        "/" +
        vehicle.inv_model +
        "/" +
        vehicle.inv_year +
        '" title="View ' +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
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
        '<a href="../../car/' +
        vehicle.inv_make +
        "/" +
        vehicle.inv_model +
        "/" +
        vehicle.inv_year +
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
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
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
  form += "<h1>Add New Inventory</h1>";

  form +=
    '<form action="/inv/add-inventory" method="POST" id="addInventoryForm">';

  form += '<label for="classification_id">Classification</label>';
  form += classificationList;

  form += '<label for="make">Make</label>';
  form += `<input type="text" id="make" name="make" value="${
    formData.make || ""
  }" required>`;

  form += '<label for="model">Model</label>';
  form += `<input type="text" id="model" name="model" value="${
    formData.model || ""
  }" required>`;

  form += '<label for="description">Description</label>';
  form += `<textarea id="description" name="description" required>${
    formData.description || ""
  }</textarea>`;

  form += '<label for="image_path">Image Path</label>';
  form += `<input type="text" id="image_path" name="image_path" value="${
    formData.image_path || "/images/no-image.png"
  }" required>`;

  form += '<label for="thumbnail_path">Thumbnail Path</label>';
  form += `<input type="text" id="thumbnail_path" name="thumbnail_path" value="${
    formData.thumbnail_path || "/images/no-image-thumbnail.png"
  }" required>`;

  form += '<label for="price">Price</label>';
  form += `<input type="number" id="price" name="price" value="${
    formData.price || ""
  }" required>`;

  form += '<label for="year">Year</label>';
  form += `<input type="number" id="year" name="year" value="${
    formData.year || ""
  }" required>`;

  form += '<label for="mileage">Mileage</label>';
  form += `<input type="number" id="mileage" name="mileage" value="${
    formData.mileage || ""
  }" required>`;

  form += '<label for="color">Color</label>';
  form += `<input type="text" id="color" name="color" value="${
    formData.color || ""
  }" required>`;

  form += '<button type="submit">Add Vehicle</button>';
  form += "</form>";

  form += "</div>";

  return form;
};

module.exports = Util;
