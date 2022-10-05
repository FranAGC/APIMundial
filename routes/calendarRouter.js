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
    conexion.query(`SELECT c.id_calendario, e.nombre_estadio, p.nombre_pais, p2.nombre_pais, g.nombre_grupo, j.nombre_jornada, c.hora_calendario
    FROM tb_calendario as c
    INNER JOIN tb_estadios AS e ON c.id_estadio = e.id_estadio
    INNER JOIN tb_paises AS p ON c.id_pais1 = p.id_pais
    INNER JOIN tb_paises AS p2 ON c.id_pais2 = p2.id_pais
    INNER JOIN tb_grupos AS g ON c.id_grupo = g.id_grupo
    INNER JOIN tb_jornadas AS j ON c.id_jornada = j.id_jornada 
    WHERE id_calendario = ?`, id, function(err, rows, fields)   
    {
        if (err) throw err;  
        if(id <= 64 && id > 0) {
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
    conexion.query(`SELECT c.id_calendario, e.nombre_estadio, p.nombre_pais, p2.nombre_pais, g.nombre_grupo, j.nombre_jornada, c.hora_calendario
    FROM tb_calendario as c
    INNER JOIN tb_estadios AS e ON c.id_estadio = e.id_estadio
    INNER JOIN tb_paises AS p ON c.id_pais1 = p.id_pais
    INNER JOIN tb_paises AS p2 ON c.id_pais2 = p2.id_pais
    INNER JOIN tb_grupos AS g ON c.id_grupo = g.id_grupo
    INNER JOIN tb_jornadas AS j ON c.id_jornada = j.id_jornada
    ORDER BY id_calendario ASC`, function(err, rows, fields)   
    {  
        //conexion.end();
        if (err) throw err;  
        res.json(rows); 
    });
  });


router.post('/', (req, res) => {
    const body = req.body;
    conexion.query('INSERT INTO tb_calendario SET ?', body, function (error, results, fields) {
    if (error) throw error;
        // Neat!
    });
    
    res.status(201).send(body);
});


router.patch('/:id', (req, res) => {
    const {id} = req.params;
    const body = req.body;
    conexion.query(`UPDATE tb_calendario SET hora_calendario = ? 
    WHERE id_calendario = ?`, [body.foto_estadio, id], function (error, results, fields) {
    if (error) throw error;
        // Neat!
    });
    
    res.status(200).send(body);
});


router.delete('/:id', (req, res) => {
    const {id} = req.params;
    conexion.query(`DELETE FROM tb_calendario 
    WHERE id_calendario = ?`, id, function (error, results, fields) {
    if (error) throw error;
        // Neat!
    });
    
    res.status(200).send(`Registro: ${id} borrado`);
});


module.exports = router;

