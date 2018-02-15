'use strict'

// modelos
var models = require('../models');


function showAllSubjects(req, res) {

  // Función para buscar todas las asignaturas
   
   models.Subject.findAll({ where: { school_id: req.user.sub }} ).then(result => {
      res.status(200).send(result);
    }).catch(err => res.status(500).json({ message: 'Error al buscar todas las asignaturas de un curso'}))
}

function subjectNotInCourse(req,res)
{
  const id_course = req.params.id
  let subjects =  []

  models.Course.findOne({ where : { id: id_course } }).then(result => {
      
      subjects = result.code_subject

      if(subjects.length > 0)
      {
        models.sequelize.query('SELECT * FROM subjects WHERE id not in (:variable) and school_id = :variable2',
          { replacements: { variable: result.code_subject, variable2: req.user.sub }, type: models.sequelize.QueryTypes.SELECT }
        ).then(result => {
           res.status(200).send(result);
        })
      }
      else
      {
          models.Subject.findAll({ where: { school_id: req.user.sub }} ).then(result => {
            res.status(200).send(result);
          }).catch(err => res.status(500).json({ message: 'Error al buscar todas las asignaturas de un curso'}))
      }
  })      
}

function saveSubject(req, res) {

  // Función para guardar todas las asignaturas
  var params = req.body;
  params.school_id = req.user.sub

  models.Subject.create(params).then( result => {
      
      res.json({ subject: result })

  }).catch( err =>{
    res.status(500).json({ message: 'error al crear una asignatura'})
    console.log(err)
  })

}



function getSubject(req, res) {

  // Función para buscar la asignatura a modificar
  models.Subject.findById(req.params.id).then(result => {
      res.status(200).send(subject)
  }).catch(err => res.status(500).json({ message: "Ha ocurrido un error buscando la asignatura"}))
}

function updateSubject(req, res) {
  // Función para modificar la asignatura
  const subjectId = req.params.id;
  let update = req.body

  models.Subject.update(update, {where: { id: subjectId }} ).then(subjectUpdated => {
    
      if (!subjectUpdated) {
        res.status(404).send({ message: 'No se a podido actualizar asignatura!' });
      } else {
        res.status(200).send({ subject: subjectUpdated });
      }
  }).catch(err => res.status(500).json({ message: "Ha ocurrido un error al intentar actualizar la asignatura"}))

}

function deleteSubject(req, res) {
  // Función para eliminar la asignatura

  Note.find( {subjectId : req.params.id} ).exec(function(err,notes){
    if(err)
    {
      res.status(500).send({ message: 'Error al buscar las notas de esta asignatura' });
    }
    else
    {
      if(notes.length > 0)
      {
        res.status(200).send({ message: "No se puede eliminar esta asignatura por que tiene notas asignadas"})
      }
      else
      {
        Subject.findOneAndRemove({ _id: req.params.id }, (err) => {
          if (err) {
            res.status(500).send({ message: 'Error no se encuentra esa asignatura para ser eliminada' });
          }
          else {
            res.status(200).send({ message: 'Asignatura eliminada con Éxito' })
          }
        })
      }
    }
  })    
}


module.exports = {
  showAllSubjects,
  saveSubject,
  getSubject,
  updateSubject,
  deleteSubject,
  subjectNotInCourse
}