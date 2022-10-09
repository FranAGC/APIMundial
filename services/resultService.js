const AppError = require("../utils/appError");
const sql = require("./db.js");


class ResultService {

  constructor(){
  }


  create = (req, res, next) => {
    if (!req.body) return next(new AppError("No form data found", 404));
    const values = req.body;
    sql.query(
      "INSERT INTO tb_resultados SET ?",
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


  find = (req, res, next) => {
      sql.query(`SELECT res.id_resultados, res.id_calendario, res.golesp1_resultados, res.golesp2_resultados, p.nombre_pais as pais1, p2.nombre_pais as pais2
      FROM tb_resultados as res
      INNER JOIN tb_calendario AS c ON res.id_calendario = c.id_calendario
      LEFT JOIN tb_paises AS p ON c.id_pais1 = p.id_pais
      LEFT JOIN tb_paises AS p2 ON c.id_pais2 = p2.id_pais
      ORDER BY id_resultados ASC`, function (err, data, fields) {
        if(err) return next(new AppError(err))
        res.status(200).json({
          status: "success",
          length: data?.length,
          data: data,
        });
      });
      };


  finOne = (req, res, next) => {
    if (!req.params.id) {
      return next(new AppError("No todo id found", 404));
    }
    sql.query(`SELECT res.id_resultados, res.id_calendario, res.golesp1_resultados, res.golesp2_resultados, p.nombre_pais as pais1, p2.nombre_pais as pais2
    FROM tb_resultados as res
    INNER JOIN tb_calendario AS c ON res.id_calendario = c.id_calendario
    LEFT JOIN tb_paises AS p ON c.id_pais1 = p.id_pais
    LEFT JOIN tb_paises AS p2 ON c.id_pais2 = p2.id_pais
    WHERE id_resultados = ?`,
      [req.params.id],
      function (err, data, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(200).json({
          status: "success",
          length: data?.length,
          data: data,
        });
      }
    );
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

module.exports = ResultService;