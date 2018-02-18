'use strict'
// modelos
var Bloque = require('../models/bloque');

var Horariomanana = require('../models/horariomanana');
var Horariotarde = require('../models/horariotarde');
var Horarionoche = require('../models/horarionoche');

// services
var jwt = require('../services/jwt');
var models = require('../models');

function getBloque(req, res) {

     models.Bloque.findAll( { where: { turno: req.params.turno }} ).then( function(bloquem) { 
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

    var params = new Object();
    params.school = req.user.sub;
    params.id_curso = req.query.curso;
 
    if (req.params.turno == 1){

     models.Horariomanana.findAll( { where: { school: req.user.sub, id_curso: params.id_curso}} ).then( function(horariom) { 
        if (!horariom) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (horariom) {
            res.status(200).send(horariom);
          } 
      } 
    });
   }

    if (req.params.turno == 2){

     models.Horariotarde.findAll( { where: { school: req.user.sub, id_curso: params.id_curso}} ).then( function(horariom) { 
        if (!horariom) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (horariom) {
            res.status(200).send(horariom);
          } 
      } 
    });
   }

    if (req.params.turno == 3){

     models.Horarionoche.findAll( { where: { school: req.user.sub, id_curso: params.id_curso}} ).then( function(horariom) { 
        if (!horariom) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (horariom) {
            res.status(200).send(horariom);
          } 
      } 
    });
   }
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

    if (params.remover == true)
      {
        horariosobj["I"+params.block] = null;
        horariosobj["B"+params.block] = null;
      }


    if (params.turno == true){
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

    }// fin turno 1


    if (params.turno == 2){
    models.Horariotarde.findOne( { where: { school: req.user.sub, id_curso: params.course,
    id_dia: params.dia  }}).then( function(horarios) { 
    
      if (horarios) {
         
        models.Horariotarde.update( horariosobj, 
              {where: { id: horarios.id } }).then( function(updatehorarios) { 

        if (!updatehorarios) {
          res.status(500).send({ message: 'No se a podido actualizar Notas!' });
        } else {
          res.status(200).send({ Horariotarde: updatehorarios });
        }
    }) 
      }else
      {  
        models.Horariotarde.create(horariosobj).then( function(insertarHorarios) 
        { 
          if (!insertarHorarios) {
            res.status(500).send({ message: 'Error al guardar Notas' });
          } else { 
             res.status(200).send({ Horariotarde: insertarHorarios });
          }
        })    
      } //else
    })// fin one

    }// fin turno 2


      if (params.turno == 3){
    models.Horarionoche.findOne( { where: { school: req.user.sub, id_curso: params.course,
    id_dia: params.dia  }}).then( function(horarios) { 
    
      if (horarios) {
         
        models.Horarionoche.update( horariosobj, 
              {where: { id: horarios.id } }).then( function(updatehorarios) { 

        if (!updatehorarios) {
          res.status(500).send({ message: 'No se a podido actualizar Notas!' });
        } else {
          res.status(200).send({ Horarionoche: updatehorarios });
        }
    }) 
      }else
      {  
        models.Horarionoche.create(horariosobj).then( function(insertarHorarios) 
        { 
          if (!insertarHorarios) {
            res.status(500).send({ message: 'Error al guardar Notas' });
          } else { 
             res.status(200).send({ Horarionoche: insertarHorarios });
          }
        })    
      } //else
    })// fin one

    }// fin turno 3
 }

module.exports = {
     getBloque,
     saveSchedule,
     getSchedule
}