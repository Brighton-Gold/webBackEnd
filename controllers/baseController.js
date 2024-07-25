const utilities = require("../utilities")
const baseController = {}

baseController.buildHomeView = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

module.exports = baseController