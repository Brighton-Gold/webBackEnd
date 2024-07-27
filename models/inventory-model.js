const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}


/**************************
 * Get one classification
 *************************/
async function getClassificationById(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.classification WHERE classification_id = $1`,
      [classification_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getClassificationById error " + error);
  }
}

/* ***************************
 *  Add new classification data
 * ************************** */
async function addClassification(classification_name) {
  try {
    const data = await pool.query(
      `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING classification_id`,
      [classification_name]
    );
    //console.log(data)
    return data;
  } catch (error) {
    console.error("addClassification error " + error);
  }
}

/* ***************************
 *  Add new inventory data
 * ************************** */
async function addInventory(
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
) {
  try {
    const data = await pool.query(
      `INSERT INTO public.inventory (
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING inv_id`,
      [
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
      ]
    );
    return data;
  } catch (error) {
    console.error("addInventory error " + error);
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
    return data.rows; // This should be an array
  } catch (error) {
    console.error("getInventoryByClassificationId error", error);
    return []; // Return an empty array in case of an error
  }
}


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
 *  Update Classification Data
 * ************************** */
async function updateClassification(classification_id, classification_name) {
  try {
    const data = await pool.query(
      "UPDATE public.classification SET classification_name = $1 WHERE classification_id = $2 RETURNING *",
      [classification_name, classification_id]
    );

    return data.rows[0];
  } catch (error) {
    console.error("Error updating classification: " + error);
    throw error;
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
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
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
      inv_id,
    ]);
    console.log("data being returned: " + data.rows[0]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const data = await pool.query(
      "DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *",
      [inv_id]
    );

    return data.rows[0];
  } catch (error) {
    console.error("Error deleting inventory item: " + error);
    throw error;
  }
}

/* ***************************
  *  Delete Inventory by Classification Data Didn't work
  * ************************** */
async function deleteInventoryByClassification(classification_id) {
  try {
    const data = await pool.query(
      "DELETE FROM public.inventory WHERE classification_id = $1 RETURNING *",
      [classification_id]
    );

    return data.rows[0];
  } catch (error) {
    console.error("Error deleting inventory item: " + error);
    throw error;
  }
}


/* ***************************
 *  Delete Classification Data
 * ************************** */
async function deleteClassification(classification_id) {
  try {
    deleteInventoryByClassification(classification_id);
    const data = await pool.query(
      "DELETE FROM public.classification WHERE classification_id = $1 AND DELETE FROM public.classification WHERE classification_id = $1 RETURNING *",
      [classification_id],
    );

    return data.rows[0];
  } catch (error) {
    console.error("Error deleting inventory item: " + error);
    throw error;
  }
}


module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getCarById,
  addClassification,
  addInventory,
  updateClassification,
  updateInventory,
  deleteInventory,
  deleteClassification,
  getClassificationById,
  deleteInventoryByClassification

};
