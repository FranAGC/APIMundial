const express = require('express');
const loginService = require('./../services/loginService');

const router = express.Router();
const service = new loginService();


router.post('/crearusuario', service.create);
router.post('/', service.login);

module.exports = router;
