const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Admin@123",
    database: "learning_project_db"
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

module.exports = connection;
