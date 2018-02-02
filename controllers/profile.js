'use strict'

// modelos
var Profile = require('../models/profile');

// services
var jwt = require('../services/jwt');
var models = require('../models');

function saveProfile(req, res) {
  var params = req.body;
  // crear nuevo perfil
   models.Profile.create(params).then( function(insertarProfiles) { 
        if (!insertarProfiles) {
          res.status(500).send({ message: 'Error al guarda perfil' });
        } else {
         models.Profile.update({ _id: insertarProfiles.id }, 
            {where: { id: insertarProfiles.id } }, {new : true}).then( result => {
           res.status(200).send( {resu: result});
        })
        }
    })  
}

function getProfiles(req, res) {
     models.Profile.findAll().then( function(profiles) { 
        if (!profiles) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (profiles) {
            res.status(200).send(profiles);
          } 
      } 
    });



/*
    Profile.find().exec((err, profiles) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' })
        } else {
            if (!profiles) {
                res.status(200).send([])
            } else {
                res.status(200).send(profiles);
            }
        }
    });
*/

}


module.exports = {
    saveProfile,
    getProfiles

}