const AppError = require("../utils/appError");
const sql = require("./db.js");
const autenticaService = require('./autenticaService');
const autoken = new autenticaService();

class PaisesService {

  constructor(){
  }


  create = (req, res, next) => {
    if (!req.body) return next(new AppError("No form data found", 404));
    const values = req.body;
    sql.query(
      "INSERT INTO tb_paises SET ?",
      values,
      function (err, data, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(201).json({
          status: "success",
          message: "todo created!",
        });
      }
    );
  };


  find = async (req, res, next) => {
    var token = req.headers['authorization'];

    await autoken.verificar(token).then(result => {
      console.log(result);
      if(result)
      {
        sql.query(`SELECT id_pais, nombre_pais, codigo_pais, ranking_pais, copas_pais, bandera_pais, g.nombre_grupo, r.nombre_region
        FROM tb_paises
        INNER JOIN tb_grupos AS g ON tb_paises.id_grupo = g.id_grupo
        INNER JOIN tb_regiones AS r ON tb_paises.id_region = r.id_region
        ORDER BY id_pais ASC`, function (err, data, fields) {
          if(err) return next(new AppError(err))
          res.status(200).json(data);
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


  findOne = async (req, res, next) => {
    var token = req.headers['authorization'];

    await autoken.verificar(token).then(result => {
      console.log(result);
      if(result) {

        if (req.params.id > 32) {
          return next(new AppError("País no encontrado", 404));
        }
        sql.query(`SELECT id_pais, nombre_pais, codigo_pais, ranking_pais, copas_pais, bandera_pais, g.nombre_grupo, r.nombre_region
        FROM tb_paises
        INNER JOIN tb_grupos AS g ON tb_paises.id_grupo = g.id_grupo
        INNER JOIN tb_regiones AS r ON tb_paises.id_region = r.id_region
        WHERE id_pais = ?`, [req.params.id],
          function (err, data, fields) {
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


  update = (req, res, next) => {
    const body = req.body;  
    if (!req.params.id) {
      return next(new AppError("Id no encontrado", 404));
    }
    sql.query(`UPDATE tb_paises SET nombre_pais = ?, codigo_pais = ?, ranking_pais = ?, 
    copas_pais = ?, bandera_pais = ?, id_grupo = ?, id_region = ? WHERE id_pais = ?`, 
        [body.nombre_pais, body.codigo_pais, body.ranking_pais, body.copas_pais, body.bandera_pais, body.id_grupo, body.id_region, req.params.id],
      function (err, data, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(201).json({
          status: "success",
          message: "Pais actualizado!",
        });
      }
    );
  };

      
  delete = (req, res, next) => {
    if (!req.params.id) {
      return next(new AppError("No todo id found", 404));
    }
    sql.query(`DELETE FROM tb_paises WHERE id_pais = ?`, req.params.id,
      function (err, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(201).json({
          status: "success",
          message: "Pais eliminado!",
        });
      }
    );
  }
}

module.exports = PaisesService;