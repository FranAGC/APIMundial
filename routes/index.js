const paisesRouter = require('./paisesRouter');
const stadiumsRouter = require('./stadiumsRouter');
const express = require('express');
//const userRouter = require('./userRouter');

function routerAPI(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/paises', paisesRouter);
    router.use('/estadios', stadiumsRouter);
}

module.exports = routerAPI;
