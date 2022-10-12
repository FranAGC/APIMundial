const { json } = require("body-parser");
const util = require('util');
const AppError = require("../utils/appError");
const sql = require("./db.js");
//const query = 

class CalendarioService {

  constructor(){
  }

  getJornadas = (req, res, next) => {
    const jornadas = [];
    for(var i = 1; i <= 8; i++){
      sql.query(`SELECT c.id_calendario, e.nombre_estadio, p.nombre_pais as pais1, p2.nombre_pais as pais2, j.nombre_jornada, c.hora_calendario
      FROM tb_calendario as c
      INNER JOIN tb_estadios AS e ON c.id_estadio = e.id_estadio
      INNER JOIN tb_paises AS p ON c.id_pais1 = p.id_pais
      INNER JOIN tb_paises AS p2 ON c.id_pais2 = p2.id_pais
      INNER JOIN tb_jornadas AS j ON c.id_jornada = j.id_jornada
      WHERE c.id_jornada = ?
      ORDER BY id_calendario ASC`, [i], function (err, result) {
        if (err) return next(new AppError(err, 500));
        jornadas.push(result);
        if(jornadas.length == 8)
        {
          //console.log(jornadas)
          res.status(200).json(jornadas);
        }
      });
    };
  }

  create = (req, res, next) => {
    if (!req.body) return next(new AppError("No form data found", 404));
    const values = req.body;
    sql.query(
      "INSERT INTO tb_calendario SET ?",
      values,
      function (err, data, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(201).json({
          status: "success",
          message: "Partido Creado!",
        });
    });
  };



  finOne = (req, res, next) => {
    if (!req.params.id) {
      return next(new AppError("No todo id found", 404));
    }
    sql.query(`SELECT c.id_calendario, e.nombre_estadio, p.nombre_pais as pais1, p2.nombre_pais as pais2, j.nombre_jornada, c.hora_calendario
    FROM tb_calendario as c
    INNER JOIN tb_estadios AS e ON c.id_estadio = e.id_estadio
    INNER JOIN tb_paises AS p ON c.id_pais1 = p.id_pais
    INNER JOIN tb_paises AS p2 ON c.id_pais2 = p2.id_pais
    INNER JOIN tb_jornadas AS j ON c.id_jornada = j.id_jornada
    WHERE id_calendario = ?`,
      [req.params.id],
      function (err, data, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(200).json(data);
      }
    );
  };


  update = (req, res, next) => {
    const body = req.body;  
    if (!req.params.id) {
      return next(new AppError("Id no encontrado", 404));
    }
    sql.query(`UPDATE tb_calendario SET id_estadio = ?, id_pais1 = ?, id_pais2 = ?, 
    id_jornada = ?, hora_calendario = ? WHERE id_calendario = ?`, 
        [body.id_estadio, body.id_pais1, body.id_pais2, body.id_jornada, body.hora_calendario, req.params.id],
      function (err, data, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(201).json({
          status: "success",
          message: "Partido actualizado!",
        });
      }
    );
  };

      
  delete = (req, res, next) => {
    if (!req.params.id) {
      return next(new AppError("No todo id found", 404));
    }
    sql.query(`DELETE FROM tb_calendario WHERE id_calendario = ?`, req.params.id,
      function (err, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(201).json({
          status: "success",
          message: "Partido eliminado!",
        });
      }
    );
  }
}

module.exports = CalendarioService;
//module.exports = getJornadas;