import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


export const database_connection = async () => {
  try {
    await pool.connect();
    console.log("PostgreSQL Connected Successfully");
  } catch (error) {
    if (error.code === 'ECONNRESET') {
      console.log('Database connection reset, reconnecting...');
    }
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
