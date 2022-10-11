const express = require('express');
var bodyParser = require('body-parser');
const routerAPI = require('./routes');
const cors = require('cors');
const app = express();
const puerto = 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json({limit:'10mb'}))


app.get('/', (req, res) => {
    res.send("Bienvenidos!");
});

app.listen(puerto, () => {
    console.log(`Servidor corriendo en el puerto ${puerto}`);
})


routerAPI(app);

