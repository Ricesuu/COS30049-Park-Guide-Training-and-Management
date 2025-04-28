// lib/db.js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    connectionLimit: 10,
});

export async function getConnection() {
    return await pool.getConnection();
}

// Temporary test:
async function testConnection() {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute("SELECT 1 + 1 AS result");
        console.log("Database connection test successful:", rows);
    } catch (error) {
        console.error("Database connection test failed:", error);
    } finally {
        if (connection) connection.release();
    }
}

testConnection();

export default pool;
