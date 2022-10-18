const AppError = require("../utils/appError");
const sql = require("./db.js");
var jwt = require('jsonwebtoken');
require('dotenv').config();


class autenticaService{

    constructor(){
    }

    prueba = () => {
     console.log('Prueba desde autentica');
    }

    autenticar = (req, res) => {
        var username = req.body.user
        var password = req.body.password
      
        var tokenData = {
          username: username
          // ANY DATA
        }
      
        var token = jwt.sign(tokenData, process.env.passtoken, {
           expiresIn: 60 * 60 * 24 * 30 // expires one month
        })
      
        res.send({
          token
        });
      }


  secure = (req, res) => {
    var token = req.headers['authorization']
    if(!token){
        res.status(401).send({
          error: "Es necesario el token de autenticación"
        })
        return
    }

    token = token.replace('Bearer ', '')

    jwt.verify(token, 'Secret Password', function(err, user) {
      if (err) {
        res.status(401).send({
          error: 'Token inválido'
        })
      } else {
        res.send({
          message: 'Awwwww yeah!!!!'
        })
      }
    })
  }
     

  verificar = (token) => {
    const customPromise = new Promise((resolve, reject) => {

      if(!token){
        resolve(false);
      }
      token = token.replace('Bearer ', '')

      jwt.verify(token, 'Secret Password', function(err, user) {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
      })
    })
    return customPromise
    
  }

}  

module.exports = autenticaService;

