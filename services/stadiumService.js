const AppError = require("../utils/appError");
const sql = require("./db.js");
const autenticaService = require('./autenticaService');
const { listenerCount } = require("./db.js");
const autoken = new autenticaService();


function lastID() {
  const customPromise = new Promise((resolve, reject) => {
    sql.query("SELECT * FROM tb_estadios ORDER BY id_estadio DESC LIMIT 1",
    function (err, result) {
        if (err) throw err;
        resolve(result[0].id_estadio);
    })
  })
  return customPromise
}


class StadiumsService {

  constructor(){
  }

  create = async (req, res, next) => {
    var token = req.headers['authorization'];
    const values = req.body;
    await autoken.adminVerificar(token).then(result => {
      if(result) {
        sql.query("INSERT INTO tb_estadios SET ?", values,
          function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(201).json({
              status: "success",
              message: "Estadio creado!"
            });
          }
        );
      }else {
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
    let lID = [];
    await lastID().then(lres => {
      lID = lres;
    }).catch(err => {
      console.log(err)
    })

    await autoken.verificar(token).then(result => {
      
      if(result) {
        if (req.params.id > lID) {
          return next(new AppError("Estadio no encontrado", 404));
        }
        sql.query("SELECT * FROM tb_estadios WHERE id_estadio = ?", [req.params.id],
          function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(200).json(data);
          }
        );
      }else {
        res.status(401).send({
        error: 'Token inválido'
        });
      }
    }).catch(err => {
      console.log(err);
    })
  };

  find = async (req, res, next) => {
    var token = req.headers['authorization'];

    await autoken.verificar(token).then(result => {
      console.log(result);
      if(result) {
        sql.query("SELECT * FROM tb_estadios", function (err, data, fields) {
          if(err) return next(new AppError(err))
          res.status(200).json(data);
        });
      }else {
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
        /*if (!req.params.id) {
          return next(new AppError("Id no encontrado", 404));
        }*/
        sql.query(`UPDATE tb_estadios SET nombre_estadio = ?, capacidad_estadio = ?, ciudad_estadio = ?, 
        descripcion_estadio = ?, foto_estadio = ? WHERE id_estadio = ?`, [body.nombre_estadio, body.capacidad_estadio, body.ciudad_estadio, body.descripcion_estadio, body.foto_estadio, req.params.id],
          function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(201).json({
              status: "success",
              message: "Estadio actualizado!"
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
          return next(new AppError("Estadio no encontrado!", 404));
        }
        sql.query(`DELETE FROM tb_estadios WHERE id_estadio = ?`, req.params.id,
          function (err, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(201).json({
              status: "success",
              message: "Estadio eliminado!",
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

module.exports = StadiumsService;