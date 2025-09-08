import { pool } from "../../../DB/connection.js";

export const sendUserMessage = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { message } = req.body;

    const result = await pool.query(
      `INSERT INTO tbl_chats (user_id, sender, message) 
       VALUES ($1, 'user', $2) RETURNING *`,
      [userId, message]
    );

    res.json({ success: true, chat: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const sendAIResponse = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { jsonResponse } = req.body;

    const result = await pool.query(
      `INSERT INTO tbl_chats (user_id, sender, json_response) 
       VALUES ($1, 'ai', $2::jsonb) RETURNING *`,
      [userId, JSON.stringify(jsonResponse)]
    );

    res.json({ success: true, chat: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `SELECT * FROM tbl_chats 
        WHERE user_id = $1 
        ORDER BY created_at ASC`,
      [userId]
    );

    res.json({ success: true, chats: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

