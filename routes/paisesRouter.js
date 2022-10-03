const express = require('express');
const mysql = require('mysql');

const router = express.Router();


const conexion = mysql.createConnection({
    host:'localhost',
    database: 'mundialqatar',
    user: 'root',
    password: ''
});

router.get('/', function (req, res) {
    //conexion.connect();  
   
    conexion.query('SELECT * FROM tb_paises', function(err, rows, fields)   
    {  
        //conexion.end();
        if (err) throw err;  
        res.json(rows); 
    });
  });








module.exports = router;





