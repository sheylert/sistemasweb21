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

  params.school =  1;  //req.user.sub
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
  models.Teacher.findAll( { where: { school: 1 }} ).then( function(teachers) { 
     
     if (!teachers) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (teachers) {
              
           /*   teachers = teachers.map((e,i) => {
                  
                  console.log(e.dataValues.profile,'aquii')
                  console.log(e.dataValues,'aquii111')

                  models.Profile.findOne( { where: { id: e.dataValues.profile}}).then( function(profileStoraged) { 

                  if (profileStoraged) {    
                    e.dataValues.profile = Util.ejecutar_arreglo(profileStoraged);
                  }
                  else
                  {
                    return e
                  } 
              });  
              
              })

              */ 

              //.Profile.findOne( { where: { id: teachers.profile}}).then( function(profileStoraged) { 

                  // if (profileStoraged) {

                   //console.log("sssssss");

                 //  teachers.profile = Util.ejecutar_arreglo(profileStoraged);
             //  } 
             // });  
            //teachers.responsable = Util.ejecutar_arreglo(teachers);
            //console.log(teachers)
            res.status(200).send(teachers);
          } 
        }     
  });
}


function updateTeacher(req, res) {

 // revisar en la parte de update y el id y la ruta del front_end
  // recogemos parametros
  var params = req.body;

  params.school =  1;  //req.user.sub
  // crear objeto profesor
   models.Teacher.update(params).then( function(updateteachers) { 

        if (!updateteachers) {
          res.status(404).send({ message: 'No se a podido actualizar profesor!' });
        } else {
          res.status(200).send({ teacher: updateteachers });
        }

    })  

}

module.exports = {
  saveTeacher,
  getTeachers,
  updateTeacher
}