import { Pool } from "pg";

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

export default async function dbConnect() {
    try {
        const client = await pool.connect();
        console.log('Database connected successfully');
        client.release();
        return pool;
    } catch (err) {
        console.error('Database connection error:', err);
        throw new Error('Failed to connect to database');
    }
}