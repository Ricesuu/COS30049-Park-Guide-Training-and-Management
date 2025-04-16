import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost', // Replace with your database host
  user: 'root', // Replace with your MySQL username
  password: 'root', // Replace with your MySQL password
  database: 'park_guide_management', // Replace with your database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

export default connection;