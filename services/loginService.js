const bcrypt = require("bcrypt")
const AppError = require("../utils/appError");
const sql = require("./db.js");
const autenticaService = require('./autenticaService');
const autoken = new autenticaService();


class loginService{

    constructor(){
    }

    create = async (req, res, next) => {
        const user = req.body.nombre_usuario;
        const hashedPassword = await bcrypt.hash(req.body.pass_usuario, 10);

        sql.query("SELECT * FROM tb_adminusers WHERE nombre_usuario = ?", [user],
            function (err, data, fields) {
              if (err) return next(new AppError(err, 500));
              console.log(data);
              
              if (data.length != 0) {
                console.log("Usuario ya existe")
                res.sendStatus(409) 
               }else{
                sql.query("INSERT INTO tb_adminusers VALUES (0,?,?)",[user, hashedPassword], 
                function (err, result) {
                    if (err) return next(new AppError(err, 500));
                    console.log ("Usuario Creado")
                    console.log(result.insertId)
                    res.sendStatus(201)
               })
              }
            }
        );
    }

    login = async (req, res, next) => {
        const user = req.body.nombre_usuario;
        const pass = req.body.pass_usuario;

        sql.query("SELECT * FROM tb_adminusers WHERE nombre_usuario = ?", [user],
        async function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            console.log(data);
              
            if (data.length == 0) {
                console.log("--> Usuario no existe")
                res.status(401).send("Usuario o contraseña incorrecta")
            }else {
                const hashedPassword = data[0].pass_usuario;
                //get the hashedPassword from result    
                if (await bcrypt.compare(pass, hashedPassword)) {
                    var token = autoken.adminToken(user);
                    console.log("----> Login Successful");
                    res.status(200).send({token});
                }else {
                    console.log("--> Password Incorrect")
                    res.status(401).send("Usuario o contraseña incorrecta")
                } //end of bcrypt.compare()  
            }//end of User exists i.e. results.length==0
            }
        );
    }


}


module.exports = loginService;



