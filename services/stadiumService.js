const AppError = require("../utils/appError");
const sql = require("./db.js");


class StadiumsService {

  constructor(){
  }


  create = (req, res, next) => {
    if (!req.body) return next(new AppError("No form data found", 404));
    const values = req.body;
    sql.query(
      "INSERT INTO tb_estadios SET ?",
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
      sql.query("SELECT * FROM tb_estadios", function (err, data, fields) {
        if(err) return next(new AppError(err))
        res.status(200).json(data);
      });
      };


  finOne = (req, res, next) => {
    if (req.params.id > 9) {
      return next(new AppError("No todo id found", 404));
    }
    sql.query(
      "SELECT * FROM tb_estadios WHERE id_estadio = ?",
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
    sql.query(`UPDATE tb_estadios SET nombre_estadio = ?, capacidad_estadio = ?, ciudad_estadio = ?, 
    descripcion_estadio = ?, foto_estadio = ? WHERE id_estadio = ?`, [body.nombre_estadio, body.capacidad_estadio, body.ciudad_estadio, body.descripcion_estadio, body.foto_estadio, req.params.id],
      function (err, data, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(201).json({
          status: "success",
          message: "Estadio actualizado!",
        });
      }
    );
  };

      
  delete = (req, res, next) => {
    if (!req.params.id) {
      return next(new AppError("No todo id found", 404));
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
  }
}

module.exports = StadiumsService;