const express = require('express');
const routerAPI = require('./routes');
const app = express();
const puerto = 3000;

//app.use(express.json());

app.get('/', (req, res) => {
    res.send("Bienvenidos!");
});

app.listen(puerto, () => {
    console.log(`Servidor corriendo en el puerto ${puerto}`);
})


routerAPI(app);

