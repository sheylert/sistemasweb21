'use strict'


// modulos
 //var bcrypt = require('bcrypt-nodejs');

 var bcrypt = require('bcrypt');

// modelos
var Client = require('../models/client');
var User = require('../models/user');
var Profile = require('../models/profile');

// ojoooooooooooo    const TotalSms = require('../models/totalSms')

// services


var jwt = require('../services/jwt');
var models = require('../models');
const Util = require('../util/function')



function saveProfile(req, res) {

    var profile = new Profile();
    var params = req.body;

    profile.name = params.name;
    profile.slug = params.slug;

    profile.save((err, profileStorage) => {
        if (err) {
            res.status(500).send({ message: 'Error al guarda cliente' });
        } else {
            res.status(200).send({ message: 'Exito!' })
        }
    });

}

function saveClient(req, res) {
    var params = req.body;

    params.code_setting = null;
    
    models.User.findOne( { where: { email: params.email.toLowerCase() }}).then( function(user) { 
    
      if (user) {
      res.status(500).send({ message: 'Error Correo registrado' });
      }else
      {   

  // crear nuevo perfil
   models.Client.create(params).then( function(insertarClients) { 
        if (!insertarClients) {
          res.status(500).send({ message: 'Error al guarda perfil' });
        } else {
                    var user={};
                    user.name = insertarClients.name;
                    user.address = insertarClients.address;
                    user.phone = insertarClients.phone;
                    user.email = insertarClients.email;

                    user.password = bcrypt.hashSync(insertarClients.email, 10);
                    user.validatePass = false;

                    user.school = insertarClients.id;
                    user.admin = insertarClients.id;
                    user.state = true;
                    user.profile_id = insertarClients.profile_id;
                    user.services = true;


                    models.User.create(user).then( function(insertarUser) { 

                    if (!insertarUser) {
                      res.status(404).send({ message: 'No se ha guardado correctamente' });
                    } else {

                    models.Client.update({ admin: insertarUser.id }, 
                        {where: { id: insertarClients.id }, returning: true }).then( result => {        

                         res.status(200).send({ client: insertarClients });
                       })     

                  }

                })  
               }            
            })
         }  
      })

}


function getClients(req, res) {

    models.Client.findAll( {
      include: [{
        model: models.User,
        as : 'users'
      },{
        model: models.Profile,
        as : 'perfiles'
      }]
}).then( function(clients) { 
        if (!clients) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (clients) {
            res.status(200).send(clients);
          } 
      } 
    });

}

function getClient(req,res)
{
  models.Client.findById(req.params.id).then(result => {
    res.json(result)
  }).catch(err => res.status(500).json({ message: "Ha ocurrido un error buscando el cliente a modificar"}) )
}

function updateClient(req, res) {

    const clientId = req.body.id;
    const update = req.body;  

 models.Client.update(update, 
                         {where: { id: clientId } }).then( function(updateclient) { 

        if (!updateclient) {
          res.status(500).send({ message: 'No se a podido actualizar Cliente!' });
        } else {

          res.status(200).send({ client: updateclient });
        }
    }) 

}

// Asignar Configuración a Cliente
// POST http://localhost:3789/client/:idClient/setting
function saveClientSetting(req, res) {
    var params = req.body;

    const idClient = req.params.idClient;

    if (params.idSetting && idClient) {
        Client.findById(idClient, function(err, client) {
            if (err) {
                return res.status(500).send({ message: 'Ha ocurrido un error en la búsqueda' });
            } else {
                if (client) {
                    client.code_setting = params.idSetting
                    client.save();
                    res.status(200).send(client)

                } else {
                    res.status(200).send({})
                }
            }
        });
    } else {
        res.status(400).send({ message: 'Ingresa los datos correctos para poder registrar al usuario' });
    }
}

// Asignar School a Cliente
// POST http://localhost:3789/client/:idClient/school
function saveClientSchool(req, res) {
    var params = req.body;

    const idClient = req.params.idClient
    const idSchool = params.idSchool

    if (idClient && idSchool) {
        Client.findById(idClient, function(err, client) {
            if (err) {
                return res.status(500).send({ message: 'Ha ocurrido un error en la búsqueda' });
            } else {
                if (client) {
                    client.code_school = params.idSchool
                    client.save();
                    res.status(200).send(client)

                } else {
                    res.status(200).send({})
                }
            }
        });
    } else {
        res.status(400).send({ message: 'Ingresa los datos correctos para poder registrar al usuario' });
    }
}

function updateSmsData (req,res) {
  
  const id = req.params.id

  Util.updateLastRegistersOfSms('SUCCESS',req)

  res.json({})

}

module.exports = {
    saveClient,
    getClients,
    updateClient,
    saveProfile,
    saveClientSetting,
    saveClientSchool,
    updateSmsData,
    getClient
}