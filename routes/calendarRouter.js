const express = require('express');
const calendarService = require('./../services/calendarService');

const router = express.Router();
const service = new calendarService();




router.get('/', service.find);

router.get('/:id', service.finOne);

router.post('/', service.create);

router.put('/:id', service.update);

router.delete('/:id', service.delete);



module.exports = router;


