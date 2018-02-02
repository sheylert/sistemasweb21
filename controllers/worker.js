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


/*
api.put('/worker/:id', mdAuth.ensureAuth,WorkerController.updateWorker);
api.post('/worker', mdAuth.ensureAuth,WorkerController.saveWorker);
api.get('/worker', mdAuth.ensureAuth,WorkerController.getWorkers);
*/

function saveWorker(req, res) {
  // recogemos parametros
  var params = req.body;

  params.school =  1;  //req.user.sub
  // crear objeto profesor
   models.Worker.create(params).then( function(insertarworkers) { 

        if (!insertarworkers) {
          res.status(404).send({ message: 'No se ha guardado del Trabajador' });
        } else {

           models.Worker.update({ _id: insertarworkers.id }, 
            {where: { id: insertarworkers.id } }).then(() => {
        })     
          res.status(200).send({ worker: insertarworkers });
        }

    })  
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

  params.school =  1;  //req.user.sub //hacer en el id
  // crear objeto profesor
   models.Worker.update({ params }, 
                         {where: { id: params.id } }).then( function(updateworkers) { 

        if (!updateworkers) {
          res.status(404).send({ message: 'No se a podido actualizar profesor!' });
        } else {
          res.status(200).send({ worker: updateworkers });
        }

    }) 

    /*
    models.Profile.update({ _id: insertarProfiles.id }, 
                         {where: { id: insertarProfiles.id } }).then(() => {
        })
           res.status(200).send({ message: 'Exito!' }); 
           */

}

module.exports = {
  saveWorker,
  getWorkers,
  updateWorker
}