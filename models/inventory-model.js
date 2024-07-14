const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get car details by ID
 * ************************** */
async function getCarById(inv_make, inv_model, inv_year) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_make = $1 AND inv_model = $2 AND inv_year = $3`,
      [inv_make, inv_model, inv_year]
    )
    console.log(data.rows[0])
    return data.rows[0]
  } catch (error) {
    console.error("getCarById error " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getCarById};
