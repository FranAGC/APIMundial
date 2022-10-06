const express = require('express');
const mysql = require('mysql');
require('dotenv').config();

const router = express.Router();


const conexion = mysql.createConnection({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password
});

router.get('/:id', function (req, res) {
    const {id} = req.params;
    conexion.query(`SELECT id_pais, nombre_pais, codigo_pais, ranking_pais, copas_pais, bandera_pais, g.nombre_grupo, r.id_nombre
    FROM tb_paises
    INNER JOIN tb_grupos AS g ON tb_paises.id_grupo = g.id_grupo
    INNER JOIN tb_regiones AS r ON tb_paises.id_region = r.id_region
    WHERE id_pais = ?`, id, function(err, rows, fields)   
    {
        if (err) throw err;  
        if(id <= 33 && id > 0) {
            res.status(200).json(rows); 
            
        } else {
            res.status(404).json({
                message: "not found"
            });
        }
    });
  });


router.get('/', function (req, res) {
    //conexion.connect();
    conexion.query(`SELECT id_pais, nombre_pais, codigo_pais, ranking_pais, copas_pais, bandera_pais, g.nombre_grupo, r.id_nombre
    FROM tb_paises
    INNER JOIN tb_grupos AS g ON tb_paises.id_grupo = g.id_grupo
    INNER JOIN tb_regiones AS r ON tb_paises.id_region = r.id_region
    ORDER BY id_pais ASC`, function(err, rows, fields)   
    {  
        //conexion.end();
        if (err) throw err;  
        res.json(rows); 
    });
  });


router.post('/', (req, res) => {
    const body = req.body;
    conexion.query('INSERT INTO tb_paises SET ?', body, function (error, results, fields) {
    if (error) throw error;
        // Neat!
    });
    
    res.status(201).send(body);

    
});


router.patch('/:id', (req, res) => {
    const {id} = req.params;
    const body = req.body;
    conexion.query(`UPDATE tb_paises SET tb_paises = ? 
    WHERE id_pais = ?`, [body.foto_estadio, id], function (error, results, fields) {
    if (error) throw error;
        // Neat!
    });
    
    res.status(200).send(body);
});


router.delete('/:id', (req, res) => {
    const {id} = req.params;
    conexion.query(`DELETE FROM tb_paises 
    WHERE id_pais = ?`, id, function (error, results, fields) {
    if (error) throw error;
        // Neat!
    });
    
    res.status(200).send(`Registro: ${id} borrado`);
});


module.exports = router;

