const AppError = require("../utils/appError");
const sql = require("./db.js");
const autenticaService = require('./autenticaService');
const autoken = new autenticaService();

class CalendarioService {

  constructor(){
  }


  find = async (req, res, next) => {
    var token = req.headers['authorization'];

    await autoken.verificar(token).then(result => {
      console.log(result);
      if(result) {
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
            res.status(200).json(jornadas);
          }
        });
      };
      }else {
        console.log(result);
        res.status(401).send({
        error: 'Token inválido'
        });
      }
    }).catch(err => {
      console.log(err);
    })
  };


  findOne = async (req, res, next) => {
    var token = req.headers['authorization'];

    await autoken.verificar(token).then(result => {
      console.log(result);
      if(result) {
        if (!req.params.id) {
          return next(new AppError("No todo id found", 404));
        }
        sql.query(`SELECT c.id_calendario, e.nombre_estadio, p.nombre_pais as pais1, p2.nombre_pais as pais2, j.nombre_jornada, c.hora_calendario
        FROM tb_calendario as c
        INNER JOIN tb_estadios AS e ON c.id_estadio = e.id_estadio
        INNER JOIN tb_paises AS p ON c.id_pais1 = p.id_pais
        INNER JOIN tb_paises AS p2 ON c.id_pais2 = p2.id_pais
        INNER JOIN tb_jornadas AS j ON c.id_jornada = j.id_jornada
        WHERE id_calendario = ?`, [req.params.id], function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(200).json(data);
          }
        );
      }else {
        console.log(result);
        res.status(401).send({
        error: 'Token inválido'
        });
      }
    }).catch(err => {
      console.log(err);
    })
  };


  create = async (req, res, next) => {
    var token = req.headers['authorization'];
    const values = req.body;
    await autoken.adminVerificar(token).then(result => {
      console.log(result);
      if(result) {
        sql.query("INSERT INTO tb_calendario SET ?", values, function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(201).json({
              status: "success",
              message: "Partido Creado!",
            });
        });
      }else {
        console.log(result);
        res.status(401).send({
        error: 'Token inválido'
        });
      }
    }).catch(err => {
      console.log(err);
    })
  };


  update = async (req, res, next) => {
    var token = req.headers['authorization'];
  
    await autoken.adminVerificar(token).then(result => {
      console.log(result);
      if(result) {
        if (!req.body) {
          return next(new AppError("No form data found", 404));
        }
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
      }else {
        console.log(result);
        res.status(401).send({
        error: 'Token inválido'
        });
      }
    }).catch(err => {
      console.log(err);
    })
  };


  delete = async (req, res, next) => {
    var token = req.headers['authorization'];
  
    await autoken.adminVerificar(token).then(result => {
      console.log(result);
      if(result) {
        if (!req.params.id) {
          return next(new AppError("Partido no encontrado!", 404));
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
      }else {
        console.log(result);
        res.status(401).send({
        error: 'Token inválido'
        });
      }
    }).catch(err => {
      console.log(err);
    })
  };


}

module.exports = CalendarioService;