const express = require('express');
const autenticaService = require('../services/autenticaService');

const router = express.Router();
const service = new autenticaService();



router.post('/', service.autenticar);
router.get('/', service.secure);




module.exports = router;
