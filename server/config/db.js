const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "Admin@123",
    database: process.env.DATABASE_NAME || "learning_project_db"
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

module.exports = connection;
