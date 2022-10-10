const express = require('express');
const tbposService = require('./../services/tbposicionesService');

const router = express.Router();
const service = new tbposService();


router.get('/', service.find);

router.get('/:id', service.finOne);

router.post('/', service.create);

router.patch('/:id_p1/:id_p2', service.update);

router.delete('/:id', service.delete);



module.exports = router;


