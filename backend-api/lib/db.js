// lib/db.js
const mysql = require("mysql2/promise");

const config = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    connectionLimit: 10,
};

// Add password to config if it exists and is not blank
if (process.env.MYSQL_PASSWORD && process.env.MYSQL_PASSWORD !== "") {
    config.password = process.env.MYSQL_PASSWORD;
}

// Initialize the pool outside of the function so it's only created once
let pool;

// Debug function to log database configuration and connection status
const logDbConfig = () => {
    const sanitizedConfig = {
        ...config,
        password: config.password ? "******" : "[not set]",
    };
    console.log("Database configuration:", sanitizedConfig);
};

/**
 * Get a database connection from the pool
 * @returns {Promise<import('mysql2/promise').PoolConnection>}
 */
async function getConnection() {
    try {
        // Create pool if it doesn't exist
        if (!pool) {
            console.log("==== DATABASE CONNECTION INITIALIZATION ====");
            logDbConfig();
            console.log("Creating new database connection pool...");
            pool = mysql.createPool(config);

            // Test the connection
            const connection = await pool.getConnection();
            console.log(
                "Successfully created database connection pool and established test connection"
            );
            connection.release();
        }

        console.log("Requesting connection from pool...");
        const connection = await pool.getConnection();
        console.log("Successfully acquired connection from pool");

        return connection;
    } catch (error) {
        console.error("==== DATABASE CONNECTION ERROR ====");
        console.error("Failed to get database connection:", error);
        console.error("Connection details:", {
            host: config.host,
            port: config.port,
            database: config.database,
            user: config.user,
            hasPassword: !!config.password,
        });
        console.error("Error details:", {
            name: error.name,
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage,
        });
        console.error("==== END DATABASE ERROR LOG ====");
        throw error;
    }
}

module.exports = { getConnection };

// Run a test connection when the module is first loaded
(async () => {
    try {
        console.log("Testing database connection on module load...");
        const connection = await getConnection();
        const [rows] = await connection.execute("SELECT 1 + 1 AS result");
        console.log("Database connection test successful:", rows[0]);
        connection.release();
    } catch (error) {
        console.error("Database connection test failed on module load:", error);
    }
})();
