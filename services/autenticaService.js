const AppError = require("../utils/appError");
const sql = require("./db.js");
var jwt = require('jsonwebtoken');
require('dotenv').config();

const sendMailService = require('./../services/sendMailService');

const service = new sendMailService();


class autenticaService{

  constructor(){
  }

  userToken = (req, res) => {
    var nombre = req.body.nombre
    var correo = req.body.correo

    var tokenData = {
      username: nombre
    }
  
    var token = jwt.sign(tokenData, process.env.usertoken, {
        expiresIn: 60 * 60 * 24 * 30 //Token valido para un mes
    })
    console.log(nombre);
    sql.query("INSERT INTO tb_usuariosapi VALUES (0,?,?,?,NOW())",[nombre, correo, token], 
      function (err, result) {
          if (err) return next(new AppError(err, 500));
          console.log ("Usuario Creado");
          console.log(result.insertId);
      })
    service.enviarmail(token, correo);
    res.send({token});
  }
     

  adminToken = (user) => {
  
    var tokenData = {
      username: user
    }
    var token = jwt.sign(tokenData, process.env.admintoken, {
       expiresIn: 60 * 60 * 1 //token duracion de una hora
    })

    return token
  }

  verificar = (token) => {
    const customPromise = new Promise((resolve, reject) => {
      if(!token){
        resolve(false);
      }
      token = token.replace('Bearer ', '')

      jwt.verify(token, process.env.usertoken, function(err, user) {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
      })
    })
    return customPromise
  }

  adminVerificar = (token) => {
  const customPromise = new Promise((resolve, reject) => {
    if(!token){
      resolve(false);
    }
    token = token.replace('Bearer ', '')

    jwt.verify(token, process.env.admintoken, function(err, user) {
    if (err) {
      resolve(false);
    } else {
      resolve(true);
    }
    })
  })
  return customPromise
 }



 valToken = async (req, res, next) => {
  var token = req.headers['authorization']
  if(!token){
      res.status(401).send({
        error: "No hay token"
      })
      return
  }

  token = token.replace('Bearer ', '')

  jwt.verify(token, process.env.admintoken, function(err, user) {
    if (err) {
      res.status(401).send({
        error: 'Token inválido'
      })
    } else {
      res.send({
        message: 'Validacion de token exitosa'
      })
    }
  })
};


}  

module.exports = autenticaService;



