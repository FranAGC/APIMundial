const express = require('express');
const resultService = require('./../services/resultService');

const router = express.Router();
const service = new resultService();


router.get('/', service.find);

router.get('/:id', service.finOne);

router.post('/', service.create);

router.put('/:id', service.update);

router.delete('/:id', service.delete);



module.exports = router;


