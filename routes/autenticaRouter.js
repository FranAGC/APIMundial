const express = require('express');
const autenticaService = require('../services/autenticaService');

const router = express.Router();
const service = new autenticaService();



router.post('/', service.userToken);
router.get('/', service.valToken);
router.get('/admin', service.valTokenAdmin);




module.exports = router;
