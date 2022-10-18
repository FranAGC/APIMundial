const express = require('express');
const paisesService = require('./../services/paisesService');

const router = express.Router();
const service = new paisesService();


router.get('/', service.find);

router.get('/:id', service.findOne);

router.post('/', service.create);

router.put('/:id', service.update);

router.delete('/:id', service.delete);



module.exports = router;


