'use strict'

// modulos
var bcrypt = require('bcrypt-nodejs');

// modelos
var Teacher = require('../models/teacher');
var models = require('../models');

//funcion
var Util     = require('../util/function')
// services
var jwt = require('../services/jwt');

function saveTeacher(req, res) {
  // recogemos parametros
  var params = req.body;

  params.school =  req.user.sub;  //
  // crear objeto profesor
   models.Teacher.create(params).then( function(insertarteachers) { 

        if (!insertarteachers) {
          res.status(404).send({ message: 'No se ha guardado el profesor' });
        } else {
          res.status(200).send({ teacher: insertarteachers });
        }

    })  
}

function getTeachers(req, res) {

  var params = req.body;
  //req.user.sub
  models.Teacher.findAll( { where: { school: req.user.sub }} ).then( function(teachers) { 
     
     if (!teachers) {
          res.json([]);
        } else {
          if (teachers) {
              res.json(teachers)
          } 
        }     
  }).catch(err => res.status(500).json({ message : "Ha ocurrido un error buscando  a los profesores"}))
}


function updateTeacher(req, res) {

 // revisar en la parte de update y el id y la ruta del front_end
  // recogemos parametros
  var params = req.body;

  params.school = req.user.sub
  // crear objeto profesor
   models.Teacher.update(params).then( function(updateteachers) { 

        if (!updateteachers) {
          res.status(500).send({ message: 'No se a podido actualizar profesor!' });
        } else {
          res.status(200).send({ teacher: updateteachers });
        }

    }).catch( err => 'Ha ocurrido un error inesperado modificando el profesor')

}

module.exports = {
  saveTeacher,
  getTeachers,
  updateTeacher
}