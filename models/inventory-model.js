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
      `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING classification_id`,
      [classification_name]
    )
    //console.log(data)
    return data
  } catch (error) {
    console.error("addClassification error " + error)
  }
}

/* ***************************
 *  Add new inventory data
 * ************************** */
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const data = await pool.query(
      `INSERT INTO public.inventory (
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING inv_id`,
      [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]
    )
    //console.log(data)
    return data
  } catch (error) {
    console.error("addInventory error " + error)
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
 *  Get inventory by classification ID
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error", error);
  }
}


/* ***************************
 *  Get car details by ID Old version
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
 * ************************** */


/* ***************************
 *  Get car details by ID
 * ************************** */
async function getCarById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getCarById error " + error);
  }
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  // inv_image,
  // inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
      const sql =
          "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_price = $4, inv_year = $5, inv_miles = $6, inv_color = $7, classification_id = $8 WHERE inv_id = $9 RETURNING *"
      const data = await pool.query(sql, [
          inv_make,
          inv_model,
          inv_description,
          // inv_image,
          // inv_thumbnail,
          inv_price,
          inv_year,
          inv_miles,
          inv_color,
          classification_id,
          inv_id
      ])
      console.log("data being returned: " + data.rows[0])
      return data.rows[0]
  } catch (error) {
      console.error("model error: " + error)
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getCarById, addClassification, checkExistingClassification, addInventory, updateInventory};
