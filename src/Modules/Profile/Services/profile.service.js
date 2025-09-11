import CryptoJS from "crypto-js";
import { pool } from "../../../DB/connection.js";




export const getProfile = async (req, res) => {
  try {
  const userID = req.user.user_id;
  const query = `
    SELECT name, phone, plan_name, job_title, email, typeOfUser, business_name, business_sector, created_at
    FROM tbl_users inner join tbl_plans on fk_plan_id = plan_id 
    WHERE user_id = $1
  `;
  const values = [userID];
  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { phone, ...userWithoutPhone } = result.rows[0];

  let decryptedPhone = null;
  if (phone) {
    decryptedPhone = CryptoJS.AES.decrypt(phone, process.env.CRYPTO_SECRET)
      .toString(CryptoJS.enc.Utf8);
  }

  res.status(200).json({
    message: 'Data fetched successfully',
    data: { ...userWithoutPhone, phone: decryptedPhone } // keep phone inside data
  });
} catch (error) {
  res.status(500).json({ message: error.message });
}


}