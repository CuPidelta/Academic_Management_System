const Mysql = require("mysql2");

const pool = Mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.getConnection((Err, connection) => {
  if (Err) {
    console.error("MySQL connection failed:", Err.message);
  } else {
    console.log(`Connected to MySQL database: ${process.env.DB_NAME}`);
    connection.release();
  }
});

module.exports = pool.promise();
