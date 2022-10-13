const AppError = require("../utils/appError");
const sql = require("./db.js");



function calcPunteo(req) {
  const customPromise = new Promise((resolve, reject) => {
    sql.query(`SELECT puntosT_tablaP, partidosJ_tablaP, partidosG_tablaP, partidosE_tablaP, 
        partidosP_tablaP, golesF_tablaP, golesC_tablaP
        FROM tb_tablaposiciones
        WHERE id_pais in (?,?)`,[req.params.id_p1,req.params.id_p2], function (err, result, fields) {
        if (err) throw err;
        //console.log(result);
        resolve(result);
    })

  })
  return customPromise
  
}



class ResultService {

  constructor(){
  }

  update = async (req, res, next) => {

    let result = [];
    await calcPunteo(req).then(paises => {
      if(req.body.golesp1_resultados > req.body.golesp2_resultados)
      {
          paises[0].puntosT_tablaP += 3;
          paises[0].partidosJ_tablaP += 1;
          paises[0].partidosG_tablaP += 1;
          paises[1].partidosJ_tablaP += 1;
          paises[1].partidosP_tablaP += 1;
      }
      else if(req.body.golesp1_resultados < req.body.golesp2_resultados)
      {
          paises[0].partidosJ_tablaP += 1;
          paises[0].partidosP_tablaP += 1;
          paises[1].puntosT_tablaP += 3;
          paises[1].partidosJ_tablaP += 1;
          paises[1].partidosG_tablaP += 1;
      }
      else {
          paises[0].puntosT_tablaP += 1;
          paises[0].partidosJ_tablaP += 1;
          paises[0].partidosE_tablaP += 1;
          paises[1].puntosT_tablaP += 1;
          paises[1].partidosJ_tablaP += 1;
          paises[1].partidosE_tablaP += 1;
      }
      paises[0].golesF_tablaP += req.body.golesp1_resultados;
      paises[0].golesC_tablaP += req.body.golesp2_resultados;
      paises[1].golesF_tablaP += req.body.golesp2_resultados;
      paises[1].golesC_tablaP += req.body.golesp1_resultados;
      //console.log(data)
      result = paises;
    }).catch(err => {
      console.log(err)
  })
    
  
  console.log(result);
    sql.query(`UPDATE tb_tablaposiciones
      SET puntosT_tablaP = ?, partidosJ_tablaP = ?, partidosG_tablaP = ?, partidosE_tablaP = ?,
      partidosP_tablaP = ?, golesF_tablaP = ?, golesC_tablaP = ?
      WHERE id_pais = ?`, [result[0].puntosT_tablaP, result[0].partidosJ_tablaP, result[0].partidosG_tablaP, result[0].partidosE_tablaP,
      result[0].partidosP_tablaP, result[0].golesF_tablaP, result[0].golesC_tablaP, req.params.id_p1], function (err, data, fields) {
          if (err) return next(new AppError(err, 500));
    });
    sql.query(`UPDATE tb_tablaposiciones
      SET puntosT_tablaP = ?, partidosJ_tablaP = ?, partidosG_tablaP = ?, partidosE_tablaP = ?,
      partidosP_tablaP = ?, golesF_tablaP = ?, golesC_tablaP = ?
      WHERE id_pais = ?`, [result[1].puntosT_tablaP, result[1].partidosJ_tablaP, result[1].partidosG_tablaP, result[1].partidosE_tablaP,
      result[1].partidosP_tablaP, result[1].golesF_tablaP, result[1].golesC_tablaP, req.params.id_p2], function (err, data, fields) {
          if (err) return next(new AppError(err, 500));
    });
    res.status(201).json({
      status: "success",
      message: "Resultado actualizado!",
    });
  };


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
    });
  };


  find = (req, res, next) => {
      sql.query(`SELECT puntosT_tablaP, partidosJ_tablaP, partidosG_tablaP, partidosE_tablaP,
      partidosP_tablaP, golesF_tablaP, golesC_tablaP, p.nombre_pais, g.nombre_grupo
      FROM tb_tablaposiciones as pos
      INNER JOIN tb_paises AS p ON pos.id_pais = p.id_pais
      LEFT JOIN tb_grupos AS g ON p.id_grupo = g.id_grupo
      ORDER BY pos.id_pais ASC`, function (err, data, fields) {
        if(err) return next(new AppError(err))
        res.status(200).json(data);
      });
      };


  finOne = (req, res, next) => {
    if (!req.params.id) {
      return next(new AppError("No todo id found", 404));
    }
    sql.query(`SELECT puntosT_tablaP, partidosJ_tablaP, partidosG_tablaP, partidosE_tablaP,
    partidosP_tablaP, golesF_tablaP, golesC_tablaP, p.nombre_pais, g.nombre_grupo
    FROM tb_tablaposiciones as pos
    INNER JOIN tb_paises AS p ON pos.id_pais = p.id_pais
    LEFT JOIN tb_grupos AS g ON p.id_grupo = g.id_grupo
    WHERE pos.id_pais = ?`,
      [req.params.id],
      function (err, data, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(200).json(data);
      }
    );
  }; 


  
      

  delete = (req, res, next) => {
    if (!req.params.id) {
      return next(new AppError("No todo id found", 404));
    }
    sql.query(`DELETE FROM tb_resultados WHERE id_resultados = ?`, req.params.id,
      function (err, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(201).json({
          status: "success",
          message: "resultado eliminado!",
        });
      }
    );
  }
}

module.exports = ResultService;






