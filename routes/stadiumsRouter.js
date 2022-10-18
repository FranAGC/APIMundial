const express = require('express');
const StadiumsService = require('./../services/stadiumService');

const router = express.Router();
const service = new StadiumsService();




router.get('/', service.find);

router.get('/:id', service.findOne);

router.post('/', service.create);

router.put('/:id', service.update);

router.delete('/:id', service.delete);



module.exports = router;


