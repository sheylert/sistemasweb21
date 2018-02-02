'use strict'

// modulos
var bcrypt = require('bcrypt-nodejs');

// modelos
var CourseCode = require('../models/course-code');

var models = require('../models');

// services
var jwt = require('../services/jwt');

function saveCourseCode(req, res) {
 var params = req.body;

   models.CourseCode.create(params).then( function(courseCodeStorage) { 

        if (!courseCodeStorage) {
          res.status(404).send({ message: 'No se ha guardado código' });
        } else {
          res.status(200).send({ CorseCode: courseCodeStorage });
        }
    })  
}

function getCourseCode(req, res) {
      models.CourseCode.findAll().then( function(coursecodes) { 
        if (!coursecodes) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (coursecodes) {
            res.status(200).send(coursecodes);
          } 
      } 
  })
}


module.exports = {
    saveCourseCode,
    getCourseCode
}