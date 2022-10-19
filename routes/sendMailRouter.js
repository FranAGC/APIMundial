const express = require('express');
const sendMailService = require('./../services/sendMailService');

const router = express.Router();
const service = new sendMailService();


router.get('/', service.enviarmail);



module.exports = router;



