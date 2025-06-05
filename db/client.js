import pg from "pg";
const db = new pg.Client(process.env.DATABASE_URL);
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();


export default db;
