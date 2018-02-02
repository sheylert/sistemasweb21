'use strict'

// modulos
var bcrypt = require('bcrypt-nodejs');

// modelos
var Teaching = require('../models/teaching');

var models = require('../models');


// services
var jwt = require('../services/jwt');

function saveTeaching(req, res) {

  // crear objeto profesor
  var teaching = new Teaching();
  // recogemos parametros
  var params = req.body;

  teaching.name = params.name;
  teaching.slug = params.slug;

  if (teaching) {
    teaching.save((err, teachingStorage) => {
      if (err) {
        res.status(500).send({ message: 'Error al guarda enseñanza' });
      } else {
        if (!teachingStorage) {
          res.status(404).send({ message: 'No se ha guardado la enseñanza' });
        } else {
          res.status(200).send({ teaching: teachingStorage });
        }
      }
    });
  }
}

function getTeachings(req, res) {

  models.Teaching.findAll().then( function(teachings) { 
        if (!teachings) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (teachings) {
            res.status(200).send(teachings);
          } 
      } 
});
}  


module.exports = {
  saveTeaching,
  getTeachings
}