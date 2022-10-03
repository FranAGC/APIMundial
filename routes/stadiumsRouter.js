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
    conexion.query('SELECT * FROM tb_estadios', function(err, rows, fields)   
    {  
        //conexion.end();
        if (err) throw err;  
        res.json(rows); 
    });
  });


router.post('/', (req, res) => {
    const body = req.body;
    conexion.query('INSERT INTO tb_estadios SET ?', body, function (error, results, fields) {
    if (error) throw error;
        // Neat!
    });
    
    res.status(200).send(body);
});


router.patch('/:id', (req, res) => {
    const {id} = req.params;
    const body = req.body;
    conexion.query(`UPDATE tb_estadios SET foto_estadio = ? 
    WHERE id_estadio = ?`, [body.foto_estadio, id], function (error, results, fields) {
    if (error) throw error;
        // Neat!
    });
    
    res.status(200).send(body);
});


router.delete('/:id', (req, res) => {
    const {id} = req.params;
    conexion.query(`DELETE FROM tb_estadios 
    WHERE id_estadio = ?`, id, function (error, results, fields) {
    if (error) throw error;
        // Neat!
    });
    
    res.status(200).send(`Registro: ${id} borrado`);
});


module.exports = router;





