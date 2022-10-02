const paisesRouter = require('./paisesRouter');
//const userRouter = require('./userRouter');

function routerAPI(app) {
    app.use('/paises', paisesRouter );
}

module.exports = routerAPI;
