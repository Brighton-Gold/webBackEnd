const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Add new classification data
 * ************************** */
async function addClassification(classification_name) {
  try {
    const data = await pool.query(
      `INSERT INTO public.classification (classification_name) VALUES ($1)`,
      [classification_name]
    )
    return data
  } catch (error) {
    console.error("addClassification error " + error)
  }

}

 /* **********************
 *   Check for existing classification name
 * ********************* */
 async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
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

module.exports = {getClassifications, getInventoryByClassificationId, getCarById, addClassification, checkExistingClassification};
