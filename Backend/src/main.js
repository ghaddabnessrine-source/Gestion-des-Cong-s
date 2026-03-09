import pg from "pg";
import dotenv from "dotenv";
import "./Server.js";

dotenv.config({ quiet: true });

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
