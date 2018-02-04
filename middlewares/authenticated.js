'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_sistema_proNotas';


exports.ensureAuth = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La petición no tiene cabecera de autorización' });
    }

    // token con postman
    //var token = req.headers.authorization.replace(/['"]+/g, '');
  // token para servidor
  var token = req.headers.authorization.split(' ')[1];
  

    // token para servidor
    /*var token = req.headers.authorization;
    console.log(`token ${token}`)
    console.log(`secret ${secret}`)
    console.log(`headers ${req.headers.authorization}`)*/
    
    try {
        var payload = jwt.decode(token, secret);
        if (payload.ext <= moment().unix()) {
            return res.status(401).send({ message: 'El token ha expirado!' });
        }
    } catch (ex) {
        return res.status(404).send({ message: 'El token no es valido!' });
    }
    //consulta
    req.user = payload;

    next();
}