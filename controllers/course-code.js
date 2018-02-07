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

   		res.json(courseCodeStorage)

    }).catch(err => res.status(500).send({ message: 'No se ha poodido guardar el grado' }) )  
}

function getCourseCode(req, res) {
      models.CourseCode.findAll().then( function(coursecodes) { 
        res.status(200).send(coursecodes);
      }).catch(err => res.status(500).send({ message: 'Error en la petición' }) )
}


module.exports = {
    saveCourseCode,
    getCourseCode
}