const express = require('express');
const tbposService = require('./../services/tbposicionesService');

const router = express.Router();
const service = new tbposService();


router.get('/', service.find);

router.get('/:id', service.findOne);

router.get('/pais/:id', service.pais);

router.post('/', service.create);

router.patch('/:id', service.update);

router.delete('/:id', service.delete);



module.exports = router;


