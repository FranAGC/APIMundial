const AppError = require("../utils/appError");
const sql = require("./db.js");
const autenticaService = require('./autenticaService');
const autoken = new autenticaService();


function calcPunteo(body) {
  const customPromise = new Promise((resolve, reject) => {
    sql.query(`SELECT puntosT_tablaP, partidosJ_tablaP, partidosG_tablaP, partidosE_tablaP, 
        partidosP_tablaP, golesF_tablaP, golesC_tablaP
        FROM tb_tablaposiciones
        WHERE id_pais in (?,?)`,[body.id_pais1, body.id_pais2], function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        resolve(result);
    })
  })
  return customPromise
}



class ResultService {

  constructor(){
  }

  upRes = async (body) => {
    let result = [];
    await calcPunteo(body).then(paises => {
      if(body.golesp1_resultados > body.golesp2_resultados)
      {
          paises[0].puntosT_tablaP += 3;
          paises[0].partidosJ_tablaP += 1;
          paises[0].partidosG_tablaP += 1;
          paises[1].partidosJ_tablaP += 1;
          paises[1].partidosP_tablaP += 1;
      }
      else if(body.golesp1_resultados < body.golesp2_resultados)
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
      paises[0].golesF_tablaP += parseInt(body.golesp1_resultados); 
      paises[0].golesC_tablaP += parseInt(body.golesp2_resultados);
      paises[1].golesF_tablaP += parseInt(body.golesp2_resultados);
      paises[1].golesC_tablaP += parseInt(body.golesp1_resultados);
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
      result[0].partidosP_tablaP, result[0].golesF_tablaP, result[0].golesC_tablaP, body.id_pais1], function (err, data, fields) {
          if (err) return next(new AppError(err, 500));
    });
    sql.query(`UPDATE tb_tablaposiciones
      SET puntosT_tablaP = ?, partidosJ_tablaP = ?, partidosG_tablaP = ?, partidosE_tablaP = ?,
      partidosP_tablaP = ?, golesF_tablaP = ?, golesC_tablaP = ?
      WHERE id_pais = ?`, [result[1].puntosT_tablaP, result[1].partidosJ_tablaP, result[1].partidosG_tablaP, result[1].partidosE_tablaP,
      result[1].partidosP_tablaP, result[1].golesF_tablaP, result[1].golesC_tablaP, body.id_pais2], function (err, data, fields) {
          if (err) return next(new AppError(err, 500));
    });

  };


  create = async (req, res, next) => {
    var token = req.headers['authorization'];
    const values = req.body;
    await autoken.adminVerificar(token).then(result => {
      console.log(result);
      if(result) {
        sql.query("INSERT INTO tb_resultados SET ?", values,
        function (err, data, fields) {
          if (err) return next(new AppError(err, 500));
          res.status(201).json({
            status: "success",
            message: "todo created!"
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


  find = async (req, res, next) => {
    var token = req.headers['authorization'];

    await autoken.verificar(token).then(result => {
      console.log(result);
      if(result) {
          const grupos = [];
          for(var i = 1; i <= 8; i++){
            sql.query(`SELECT pos.id_pais, puntosT_tablaP, partidosJ_tablaP, partidosG_tablaP, partidosE_tablaP,
            partidosP_tablaP, golesF_tablaP, golesC_tablaP, p.nombre_pais, g.nombre_grupo
            FROM tb_tablaposiciones as pos
            INNER JOIN tb_paises AS p ON pos.id_pais = p.id_pais
            LEFT JOIN tb_grupos AS g ON p.id_grupo = g.id_grupo
            WHERE g.id_grupo = ?`, [i], function (err, result, fields) {
              if (err) return next(new AppError(err, 500));
              console.log(result);
              grupos.push(result);
              if(grupos.length == 8)
              {
                res.status(200).json(grupos);
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
        if (req.params.id > 32) {
          return next(new AppError("No todo id found", 404));
        }
        sql.query(`SELECT pos.id_pais, puntosT_tablaP, partidosJ_tablaP, partidosG_tablaP, partidosE_tablaP,
        partidosP_tablaP, golesF_tablaP, golesC_tablaP, p.nombre_pais, g.nombre_grupo
        FROM tb_tablaposiciones as pos
        INNER JOIN tb_paises AS p ON pos.id_pais = p.id_pais
        LEFT JOIN tb_grupos AS g ON p.id_grupo = g.id_grupo
        WHERE pos.id_pais = ?`, [req.params.id], function (err, data, fields) {
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
        sql.query(`UPDATE tb_tablaposiciones
        SET puntosT_tablaP = ?, partidosJ_tablaP = ?, partidosG_tablaP = ?, partidosE_tablaP = ?,
        partidosP_tablaP = ?, golesF_tablaP = ?, golesC_tablaP = ?
        WHERE id_pais = ?`, [body.puntosT_tablaP, body.partidosJ_tablaP, body.partidosG_tablaP, body.partidosE_tablaP,
          body.partidosP_tablaP, body.golesF_tablaP, body.golesC_tablaP, req.params.id], 
          function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
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




  delete = async (req, res, next) => {
    var token = req.headers['authorization'];
  
    await autoken.adminVerificar(token).then(result => {
      console.log(result);
      if(result) {
        if (!req.params.id) {
          return next(new AppError("Pais no encontrado!", 404));
        }
        sql.query(`DELETE FROM tb_resultados WHERE id_resultados = ?`, req.params.id,
        function (err, fields) {
          if (err) return next(new AppError(err, 500));
          res.status(201).json({
            status: "success",
            message: "Pais eliminado de la tabla!"
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

module.exports = ResultService;






