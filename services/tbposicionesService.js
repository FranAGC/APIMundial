const AppError = require("../utils/appError");
const sql = require("./db.js");



async function calculoPuntos(req) {
    console.log(req.params.id_p1, req.params.id_p2)
    let paises = null;
    await sql.query(`SELECT puntosT_tablaP, partidosJ_tablaP, partidosG_tablaP, partidosE_tablaP, 
        partidosP_tablaP, golesF_tablaP, golesC_tablaP
        FROM tb_tablaposiciones
        WHERE id_pais in (1,2)`, function (err, result, fields) {
        if (err) throw err;
        paises = result;
        console.log("prueba 1" + result);
    });

    /*if(req.body.golesp1_resultados > req.body.golesp2_resultados)
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
    paises[0].golesF_tablaP += req.body.golesp1_resultados;*/
    
    return paises;
}
  



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


  update = (req, res, next) => {
    let paises = calculoPuntos(req);
    console.log(paises);
    if (!req.params) {
      return next(new AppError("Id no encontrado", 404));
    }
    sql.query(`UPDATE tb_tablaposiciones
    SET puntosT_tablaP = ?, partidosJ_tablaP = ?, partidosG_tablaP = ?, partidosE_tablaP = ?,
    partidosP_tablaP = ?, golesF_tablaP = ?, golesC_tablaP = ?
    WHERE id_pais = ?`, [paises[0].puntosT_tablaP, paises[0].partidosJ_tablaP, paises[0].partidosG_tablaP, paises[0].partidosE_tablaP,
    paises[0].partidosP_tablaP, paises[0].golesF_tablaP, paises[0].golesC_tablaP, req.params.id_p1], function (err, data, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(201).json({
          status: "success",
          message: "Resultado actualizado!",
        });
    });
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






