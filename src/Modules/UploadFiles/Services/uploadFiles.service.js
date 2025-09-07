import { pool } from "../../../DB/connection.js";

// Upload File
export const uploadFile = async (req, res) => {
  const { jsonData, fileName, summary, analysis } = req.body;
  const userId = req.user.user_id;

  try {
    if (!fileName) {
      return res.status(400).json({
        status: "error",
        message: "fileName is required",
      });
    }

    // 1. Get user plan and upload limit
    const planResult = await pool.query(
      `SELECT p.number_of_uploads
        FROM tbl_users u
        JOIN tbl_plans p ON u.fk_plan_id = p.plan_id
        WHERE u.user_id = $1`,
      [userId]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User plan not found",
      });
    }

    const uploadLimit = planResult.rows[0].number_of_uploads;

    // 2. Count how many files user has uploaded
    const countResult = await pool.query(
      `SELECT COUNT(*) AS file_count
        FROM tbl_files
        WHERE user_id = $1`,
      [userId]
    );

    const fileCount = parseInt(countResult.rows[0].file_count, 10);

    if (fileCount >= uploadLimit) {
      return res.status(403).json({
        status: "error",
        message: `Upload limit reached. Your plan allows only ${uploadLimit} uploads.`,
      });
    }

    // 3. Insert file if within limit
    const result = await pool.query(
      `INSERT INTO tbl_files 
        (file_name, user_id, original_version, last_edits_version, summary, analysis)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING file_id, file_name, original_version, createdat, summary, analysis`,
      [fileName, userId, jsonData, null, summary, analysis]
    );

    res.status(201).json({
      status: "success",
      message: "Saved successfully",
      data: {
        fileId: result.rows[0].file_id,
        fileName: result.rows[0].file_name,
        originalVersion: result.rows[0].original_version,
        createdAt: result.rows[0].createdat,
        summary: result.rows[0].summary,
        analysis: result.rows[0].analysis,
      },
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to save file",
    });
  }
};



// Update File
export const updateFile = async (req, res) => {
  const { fileId } = req.params;
  const { jsonData, summary, analysis} = req.body;
  const userId = req.user.user_id; // if using JWT middleware

  try {
    const fileCheck = await pool.query(
      `SELECT file_id FROM tbl_files 
        WHERE file_id = $1 AND user_id = $2`,
      [fileId, userId]
    );

    if (fileCheck.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "File not found or unauthorized",
      });
    }

    const result = await pool.query(
  `UPDATE tbl_files 
    SET 
      last_edits_version = $1,
      summary = COALESCE($2, summary),  -- update only if provided
      updatedat = CURRENT_TIMESTAMP,
      analysis = COALESCE($5, analysis)  
    WHERE file_id = $3 AND user_id = $4
    RETURNING file_id, file_name, last_edits_version ,summary, analysis, updatedat`,
  [jsonData, summary, fileId, userId, analysis]
);

    res.status(200).json({
      status:"success",
      message: "Refined successfully",
      data: {
        fileId: result.rows[0].file_id,
        fileName: result.rows[0].file_name,
        refinedVersion: result.rows[0].last_edits_version,
        summary: result.rows[0].summary,
        analysis: result.rows[0].analysis,
        updatedAt: result.rows[0].updatedat,
      },
    });
  } catch (err) {
    console.error("Database error:", err);

    if (err.code === "22P02") {
      return res.status(400).json({
        status: "error",
        message: "Invalid JSON data format",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Failed to update file",
      details:
        process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};



export const getAllContracts = async (req, res) => {
  try {
    const query = `
  SELECT 
    f.file_id,
    f.file_name,
    f.createdat,
    f.updatedat,
    f.original_version,
    f.last_edits_version,
    f.summary,
    f.analysis,
    u.user_id,
    u.name AS user_name
  FROM tbl_files f
  INNER JOIN tbl_users u ON f.user_id = u.user_id
  ORDER BY f.createdat ASC
`;

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No contracts found" });
    }

    res.status(200).json({
      status: "success",
      message:"Data fetched successfully",
      count: result.rowCount,
      data: result.rows,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch contracts",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};




export const deleteFile = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if file exists and belongs to user
    const fileCheck = await pool.query(
      `SELECT file_id FROM tbl_files WHERE file_id = $1`,
      [id]
    );

    if (fileCheck.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "File not found or unauthorized",
      });
    }

    // Delete the file
    const result = await pool.query(
      `DELETE FROM tbl_files WHERE file_id = $1 RETURNING file_id, file_name`,
      [id]
    );

    res.status(200).json({
      status: "success",
      message: "File deleted successfully",
      deletedFile: result.rows[0],
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to delete file",
      details:
        process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
