'use strict'

// modulos
var bcrypt = require('bcrypt');

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

             models.Profile.findOne({ where: { slug: 'TEACHER' }}).then( profile => {

               if(profile)
                {                   
                  var user={}; 
                                                user.name = params.name +' '+params.secondname;
                                                user.phone = params.phone;
                                                user.school = req.user.sub;
                                                user.profile_id = profile.id;
                                                user.email = params.email;
                                                user.password = bcrypt.hashSync(params.email, 10);
                                                user.state = true;
                                                user.services = true;
                                                user.validatePass = false;
                                                         
                                                models.User.create(user).then( function(userStore) { 

                                                    if (!userStore) {                              
                                                        res.status(500).send({ message: 'Error al guardar el usuario del responsable' });
                                                    } 
                                                    else 
                                                    {
                                                        res.status(200).send({ teacher: insertarteachers });  
                                                    }
                                                    
                              }).catch(err => 'No se a podido crear el usuario porque el correo ya esta en uso');
                
                 }else
                 {
                   res.status(404).send({ message: "No tiene registrado el permiso de TEACHER en perfiles" })
                 }
             }).catch(err => 'No se a podido revisar el perfiles');                      
    }).catch(err => res.status(404).send({ message: 'No se ha guardado el profesor' }) )
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
   models.Teacher.update(params,{where : {id: req.params.id}} ).then( function(updateteachers) { 

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