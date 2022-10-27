const express = require('express');
const autenticaService = require('../services/autenticaService');

const router = express.Router();
const service = new autenticaService();



router.post('/', service.userToken);
router.get('/', service.verificar);
router.get('/admin', service.valToken);




module.exports = router;
