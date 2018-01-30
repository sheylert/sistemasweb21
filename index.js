'use strict'

var app = require('./app'); 
var models = require('./models');
var path = require('path');
var http = require('http');

var port = process.env.PORT || 3789;

models.sequelize.sync().then(runserver);

function runserver(){

var httpServer = http.createServer(app);
    httpServer.listen(port, function(){
    console.log('Servidor Node y Express está corriendo en el puerto ' + port);
});

};
