const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
    port: 3306
});


module.exports = connection;