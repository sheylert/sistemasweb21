
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
require('dotenv').config()

//cargar rutas

// middlewares e body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configurar rutas
var routes = require('./routes/routes');

// congigurar CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// rutas base
app.use('/', routes);

module.exports = app;