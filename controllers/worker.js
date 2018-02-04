'use strict'

// modulos
var bcrypt = require('bcrypt-nodejs');

// modelos
var Worker = require('../models/worker');
var models = require('../models');

//funcion
var Util     = require('../util/function')
// services
var jwt = require('../services/jwt');

var validator  = require('email-validator');

function saveWorker(req, res) {
  // recogemos parametros
  var params = req.body;
  params.school =  1;  //req.user.sub
  // crear objeto profesor
   var validar =  validator.validate(params.email)
    if (validar) {

    models.Worker.create(params).then( function(insertarworkers) { 

        if (!insertarworkers) {
          res.status(500).send({ message: 'No se ha guardado del Trabajador' });
        } else {

           models.Worker.update({ _id: insertarworkers.id }, 
            {where: { id: insertarworkers.id }, returning: true }).then( result => {

            res.status(200).json({ worker: result[1][0] });
        })     
        }
    })    
  

 } else
  {
  res.status(500).send({ message: 'Error Escriba Email con formato correcto' });

  }  
}

function getWorkers(req, res) {

  var params = req.body;
  //req.user.sub
  models.Worker.findAll( { where: { school: 1 }} ).then( function(workers) { 
     
     if (!workers) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (workers) {
              
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
            res.status(200).send(workers);
          } 
        }     
  });
}


function updateWorker(req, res) {
  // revisar en la parte de update y el id y la ruta del front_end
  // recogemos parametros
  var params = req.body;
   var validar =  validator.validate(params.email)
    if (validar) {

   models.Worker.update( params, 
                         {where: { id: params._id } }).then( function(updateworkers) { 

        if (!updateworkers) {
          res.status(500).send({ message: 'No se a podido actualizar profesor!' });
        } else {
          res.status(200).send({ worker: updateworkers });
        }
    }) 

    } else
  {
  res.status(500).send({ message: 'Error Escriba Email con formato correcto' });

  }                     
}



function deleteWorker(req, res) {
  // recogemos parametros
  var userId = req.params.id;
        // bulk destroy
      models.Worker.destroy({ where: { id: userId } })
        .then(function(deleteworkers){
           res.status(200).send({ worker: deleteworkers });   
        })
    }                   


module.exports = {
  saveWorker,
  getWorkers,
  updateWorker,
  deleteWorker
}