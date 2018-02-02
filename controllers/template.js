'use strict'

// modelos
var Template = require('../models/template');

var models = require('../models');


// services
var jwt = require('../services/jwt');

function getAllTemplates(req, res) {
  // Función para buscar todos los templates

  // school: req.user.sub ---------------- ojo  
  var params = req.body;
  //req.user.sub
  models.Template.findAll( { where: { school: 1 }} ).then( function(templates) { 
     
     if (!templates) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (templates) {
            res.status(200).send(templates);
          } 
        }     
  });

}

function saveTemplate(req, res) {

  // Función para guardar todos los templates

  var params = req.body;

  params.school =  1;  //req.user.sub
  // crear objeto profesor
   models.Template.create(params).then( function(insertartemplate) { 

        if (!insertartemplate) {
          res.status(404).send({ message: 'No se ha guardado el profesor' });
        } else {
          res.status(200).send({ template: insertartemplate });
        }

    })
}

function getTemplate(req, res) {

  // Función para buscar el template seleccionado

  Template.findById(req.params.id, function (err, Template) {
    if (err) {
      res.status(500).send({ message: 'Ha ocurrido un error en la busqueda' });
    }
    else {
      if (Template) {

        res.status(200).send(Template)
      }
      else {
        res.status(200).send({})
      }
    }
  })
}

function updateTemplate(req, res) {
  // Función para modificar el template
  const templateId = req.params.id;
  const update     = req.body;
  update.school    = req.user.sub

  Template.findByIdAndUpdate(templateId, update, { new: true }, (err, templateUpdated) => {
    if (err) {
      res.status(500).send({ message: 'Ha ocurrido un error al tratar de modificar la plantilla' });
    }
    else {
      if (!templateUpdated) {
        res.status(404).send({ message: 'No se a podido actualizar plantilla!' });
      } else {
        res.status(200).send({ template: templateUpdated });
      }
    }

  })

}

module.exports = {
  getAllTemplates,
  saveTemplate,
  getTemplate,
  updateTemplate
}
