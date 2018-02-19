'use strict'

// modulos
var bcrypt = require('bcrypt-nodejs');

// modelos
var Departament = require('../models/departament');
var models = require('../models');

//funcion
var Util     = require('../util/function')
// services
var jwt = require('../services/jwt');

var validator  = require('email-validator');


function getDepartament(req, res) {

  let filtro = {
    school_id : req.user.sub
  }

  models.Departament.findAll({ where : filtro }).then( result => {
    if(result)
    {
      res.json(result)
    }
    else
    {
      res.status(500).json({ message:  "No se ha encontrado ningún Departamento"})
    }
  }).catch(err => res.status(500).json({ message:  "Ha ocurrido un error al intentar encontrar el Departamento"}) )
}


function getDepartamentId(req, res) {
 
   let filtro = {
    school_id : req.user.sub,
    id : req.params.id
  }

  models.Departament.findOne({ where : filtro }).then( result => {
    if(result)
    {
      res.json(result)
    }
    else
    {
      res.status(500).json({ message:  "No se ha encontrado ningún Departamento"})
    }
  }).catch(err => res.status(500).json({ message:  "Ha ocurrido un error al intentar encontrar el Departamento"}) )
}


function updateDepartament(req, res) {
  
  var params = req.body;

   models.Departament.update( params, 
                         {where: { id: params.id } }).then( function(updatedepartaments) { 
        if (!updatedepartaments) {
          res.status(500).send({ message: 'No se a podido actualizar Departamento!' });
        } else {
          res.status(200).send({ departament: updatedepartaments });
        }
    }).catch(err => res.status(500).send({ message: 'Ha ocurrido un error al actualizar el departamento' }))
  
} 


function updateDepartamentWorker(req, res) {

var params = req.body;

const id_departament = req.params.id
let worker =  []

  models.Departament.findOne({ where : { id: id_departament } }).then(result => {
      
      worker = result.workers_id

    })


if (params.remover == true)
      {
        //remover del arreglo
      }else
      {
        //agregar al arreglo
      }

   models.Departament.update( params, 
                         {where: { id: params.id } }).then( function(updatedepartaments) { 
        if (!updatedepartaments) {
          res.status(500).send({ message: 'No se a podido actualizar Departamento!' });
        } else {
          res.status(200).send({ departament: updatedepartaments });
        }
    }).catch(err => res.status(500).send({ message: 'Ha ocurrido un error al remover del departamento' }) )
}  


function saveDepartament(req,res){ 
 var params = req.body;
     params.school_id = req.user.sub;
     params.workers_id = params.workers_id.value

  // crear nuevo perfil
   models.Departament.create(params).then( function(insertarDepartaments) { 
        if (!insertarDepartaments) {
          res.status(500).send({ message: 'Error al guardar departamento' });
        } else {
           res.status(200).send(insertarDepartaments);
        }
    }).catch(err => res.status(500).json({message: 'Ha ocurrido un error grabando el departamento',err}))
}


function deleteDepartament(req,res){

 var departaId = req.params.id;
        // bulk destroy
      models.Departament.destroy({ where: { id: departaId } })
        .then(function(deletedepartaments){
           res.status(200).send({ departament: deletedepartaments });   
        }).catch(err => res.status(500).json({ message: "Ha ocurrido un error al borrar el departamento"}) )
 
}


function workerNotInDepartament(req,res)
{
  const id_departament = req.params.id
  let worker =  []

  models.Departament.findOne({ where : { id: id_departament } }).then(result => {
      
      worker = result.workers_id

      if(worker.length > 0)
      {
        models.sequelize.query('SELECT * FROM worker WHERE id not in (:variable) and school = :variable2',
          { replacements: { variable: result.workers_id, variable2: req.user.sub }, type: models.sequelize.QueryTypes.SELECT }
        ).then(result => {
           res.status(200).send(result);
        })
      }
      else
      {
          models.Worker.findAll({ where: { school: req.user.sub }} ).then(result => {
            res.status(200).send(result);
          }).catch(err => res.status(500).json({ message: 'Error al buscar todas los trabajadores de un departamento'}) )
      }
  }).catch( err => res.status(500).json({ message: "Ha ocurrido un error al buscar los trabajadores que no están en el departamento"} ))      
}

module.exports = {
  getDepartament,
  getDepartamentId,
  updateDepartament,
  saveDepartament,
  deleteDepartament,
  workerNotInDepartament,
  updateDepartamentWorker
}
