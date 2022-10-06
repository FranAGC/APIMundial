const paisesRouter = require('./paisesRouter');
const stadiumsRouter = require('./stadiumsRouter');
const calendarRouter = require('./calendarRouter');
const tbpositionsRouter = require('./tbpositionsRouter');
const resultsRouter = require('./resultsRouter');
const express = require('express');
//const userRouter = require('./userRouter');

function routerAPI(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/paises', paisesRouter);
    router.use('/estadios', stadiumsRouter);
    router.use('/calendario', calendarRouter);
    router.use('/tbposiciones', tbpositionsRouter);
    router.use('/resultados', resultsRouter);
}

module.exports = routerAPI;
