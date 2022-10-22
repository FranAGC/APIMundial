const express = require('express');
const AppError = require("../utils/appError");
const errorHandler = require("../utils/errorHandler");
const paisesRouter = require('./paisesRouter');
const stadiumsRouter = require('./stadiumsRouter');
const calendarRouter = require('./calendarRouter');
const tbpositionsRouter = require('./tbpositionsRouter');
const resultsRouter = require('./resultsRouter');
const autenticaRouter = require('./autenticaRouter');
const loginRouter = require('./loginRouter');

function routerAPI(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/paises', paisesRouter);
    router.use('/estadios', stadiumsRouter);
    router.use('/calendario', calendarRouter);
    router.use('/tbposiciones', tbpositionsRouter);
    router.use('/resultados', resultsRouter);
    router.use('/autenticacion', autenticaRouter);
    router.use('/login', loginRouter);

    app.all("*", (req, res, next) => {
        next(new AppError(`The URL ${req.originalUrl} does not exists`, 404));
       });

    app.use(errorHandler);
}

module.exports = routerAPI;

