import { pool } from "../../../DB/connection.js";

// Add Template
export const addTemplate = async (req, res) => {
  try {
    const { name, content } = req.body;

    const query = `
      INSERT INTO tbl_templates 
        (name, content)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [name, content];
    const result = await pool.query(query, values);

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
