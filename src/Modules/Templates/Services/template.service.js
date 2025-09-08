import { pool } from "../../../DB/connection.js";

// Add Template
export const addTemplate = async (req, res) => {
  try {
    const { name, content } = req.body;

    // First check if a template with this name already exists
    const checkQuery = `
      SELECT id FROM tbl_templates WHERE name = $1
    `;
    const checkResult = await pool.query(checkQuery, [name]);

    if (checkResult.rows.length > 0) {
      return res.status(409).json({ 
        error: "Template with this name already exists" 
      });
    }

    // If name doesn't exist, proceed with insertion
    const insertQuery = `
      INSERT INTO tbl_templates 
        (name, content)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [name, content];
    const result = await pool.query(insertQuery, values);

    res.json({
      message: "Template added successfully!",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllTemplates = async (req, res) => {
  const query = `select id , name from tbl_templates`;

  const result = await pool.query(query);
  try {
    res.json({ message: "fetching data successfully", data: result.rows });
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const getSpecificTemplate = async (req, res) => {

  const {id} = req.params;


  const query = `
  select * from tbl_templates where id = ($1)
  `;

  const value = [id];

  const result = await pool.query(query,value)

  try {
    res.json({message : 'success' , data : result.rows[0]})
  } catch (error) {
    res.json({error : error.message})
  }


};
