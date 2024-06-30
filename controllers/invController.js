const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const classification_name = req.params.classificationName
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  res.render("./inventory/classification", {
    title: classification_name + " vehicles",
    nav,
    grid,
    classification_name,
    cars: data
  })
}

module.exports = invCont

