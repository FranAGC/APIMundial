const mysql = require('mysql');
const fs = require('fs');
require('dotenv').config();


const serverCa = [fs.readFileSync("./services/BaltimoreCyberTrustRoot.crt.pem", "utf8")];

const connection = mysql.createConnection({
    host: "pjdw.mysql.database.azure.com",
    database: "mundialqatar",
    user: "desarrollowumg",
    password: "Dscnur65-/s34.",
    port: 3306,
    ssl : {
        rejectUnauthorized: true,
        ca: serverCa
    }
});


module.exports = connection;