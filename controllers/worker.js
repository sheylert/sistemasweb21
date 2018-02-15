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
  params.school = req.user.sub

   var cadena = params.birth_date,
                separador = "-", // un espacio en blanco
                arregloDeSubCadenas = cadena.split(separador);
                params.birt_date = arregloDeSubCadenas[2]+"/"+ arregloDeSubCadenas[1]+"/"+ arregloDeSubCadenas[0];

  // crear objeto profesor
   var validar =  validator.validate(params.email)
    if (validar) {

    models.Worker.create(params).then( function(insertarworkers) { 

        if (!insertarworkers) {
          res.status(500).send({ message: 'No se ha guardado del Trabajador' });
        } else {
            res.status(200).json({ worker: insertarworkers });
        }
    })    
  

 } else
  {
  res.status(500).send({ message: 'Error Escriba Email con formato correcto' });

  }  
}

function getWorkers(req, res) {

  var params = req.body;
  models.Worker.findAll( { where: { school: req.user.sub }} ).then( function(workers) { 
     
     if (!workers) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (workers) {
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


        var cadena = params.birth_date,
                    separador = "-", // un espacio en blanco
                    arregloDeSubCadenas = cadena.split(separador);

                params.birth_date = arregloDeSubCadenas[2]+"/"+ arregloDeSubCadenas[1]+"/"+ arregloDeSubCadenas[0];
   
      
   models.Worker.update( params, 
                         {where: { id: params.id } }).then( function(updateworkers) { 

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

function getWorker(req,res){
  // Buscar un trabajador en especifico

  const id = req.params.id
  let filtro = {
    school : req.user.sub,
    id
  }

  models.Worker.findOne({ where : filtro }).then( result => {
    if(result)
    {
      res.json(result)
    }
    else
    {
      res.status(500).json({ message:  "No se ha encontrado ningún trabajador con ese id"})
    }
  }).catch(err => res.status(500).json({ message:  "Ha ocurrido un error al intentar encontrar el trabajador"}) )
}


module.exports = {
  saveWorker,
  getWorkers,
  updateWorker,
  deleteWorker,
  getWorker
}