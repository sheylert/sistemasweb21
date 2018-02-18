'use strict'

// modulos
var bcrypt = require('bcrypt-nodejs');

// modelos
//var Departament = require('../models/departament');
var models = require('../models');

//funcion
var Util     = require('../util/function')
// services
var jwt = require('../services/jwt');

var validator  = require('email-validator');


function getDepartament(req, res) {

console.log("holaaaaa");

  let filtro = {
    school : req.user.sub
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

function saveDepartament(req,res){
 
}

function deleteDepartament(req,res){
 
}*/


module.exports = {
  getDepartament,
  //getDepartamentsId,
  //updateDepartament,
  //saveDepartament,
  //deleteDepartament
}
