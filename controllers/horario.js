'use strict'
// modelos
var Bloque = require('../models/bloque');

var Horariomanana = require('../models/horariomanana');

// services
var jwt = require('../services/jwt');
var models = require('../models');

function getBloque(req, res) {

    console.log("--------------")+req.params.turno;

     models.Bloque.findAll( { where: { turno: 1 }} ).then( function(bloquem) { 
        if (!bloquem) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (bloquem) {
            res.status(200).send(bloquem);
          } 
      } 
    });
}

function getSchedule(req, res) {

    console.log("..............");
    
    var params = req.body;

    params.school = req.user.sub;
    params.id_curso = 1;

    //turno: 1 condicional

     models.Horariomanana.findAll( { where: { school: params.school, id_curso: params.id_curso }} ).then( function(horariom) { 
        if (!horariom) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (horariom) {
            res.status(200).send(horariom);
          } 
      } 
    });
}


function saveSchedule(req, res) 
{
    var params = req.body;

    var horariosobj = new Object();

    horariosobj.school = req.user.sub;
    horariosobj.id_curso = params.course;
    horariosobj.id_dia = params.dia;
    horariosobj["I"+params.block] = params.hora_inicio;
    horariosobj["B"+params.block] = params.subject;

    models.Horariomanana.findOne( { where: { school: req.user.sub, id_curso: params.course,
    id_dia: params.dia  }}).then( function(horarios) { 
    
      if (horarios) {
         
        models.Horariomanana.update( horariosobj, 
              {where: { id: horarios.id } }).then( function(updatehorarios) { 

        if (!updatehorarios) {
          res.status(500).send({ message: 'No se a podido actualizar Notas!' });
        } else {
          res.status(200).send({ Horariomanana: updatehorarios });
        }
    }) 
      }else
      {  
        models.Horariomanana.create(horariosobj).then( function(insertarHorarios) 
        { 
          if (!insertarHorarios) {
            res.status(500).send({ message: 'Error al guardar Notas' });
          } else { 
             res.status(200).send({ Horariomanana: insertarHorarios });
          }
        })    
      } //else
   })// fin one
 }

module.exports = {
     getBloque,
     saveSchedule,
     getSchedule
}