'use strict'
// modelos
var Bloquemanana = require('../models/horariomanana');

// services
var jwt = require('../services/jwt');
var models = require('../models');

function getBloque(req, res) {

     models.Bloquemanana.findAll().then( function(bloquem) { 
        if (!bloquem) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (bloquem) {
            res.status(200).send(bloquem);
          } 
      } 
    });
}

module.exports = {
     getBloque
}