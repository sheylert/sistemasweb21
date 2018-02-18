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

/*function getDepartamentsId(req, res) {

}


function updateDepartament(req, res) {
 
}   

*/                

function saveDepartament(req,res){
 
 var params = req.body;
     params.school_id = req.user.sub;
  // crear nuevo perfil
   models.Departament.create(params).then( function(insertarDepartaments) { 
        if (!insertarDepartaments) {
          res.status(500).send({ message: 'Error al guardar departamento' });
        } else {
           res.status(200).send( {resu: insertarDepartaments});
        }
    })  
}

/*

function deleteDepartament(req,res){
 
}*/


module.exports = {
  getDepartament,
  //getDepartamentsId,
  //updateDepartament,
  saveDepartament,
  //deleteDepartament
}
