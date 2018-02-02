'use strict'

// modulos
var bcrypt = require('bcrypt-nodejs');

// modelos
var Client = require('../models/client');
var User = require('../models/user');
var Profile = require('../models/profile');

// ojoooooooooooo    const TotalSms = require('../models/totalSms')

// services
var jwt = require('../services/jwt');
var models = require('../models');



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


    console.log("ssssssssssssssss cliente");

var params = req.body;

    params.services = false;
    params.code_setting = null;
    params.code_school = null;


  // crear nuevo perfil
   models.Client.create(params).then( function(insertarClients) { 
        if (!insertarClients) {
          res.status(500).send({ message: 'Error al guarda perfil' });
        } else {
         models.Client.update({ _id: insertarClients.id }, 
            {where: { id: insertarClients.id } }).then(() => {
        })
           res.status(200).send({ message: 'Exito!' });


           //registro de usuario

                    var user = new User();
                    user.name = client.name;
                    user.address = client.address;
                    user.phone = client.phone;
                    user.school = client.id;
                    user.email = client.email;
                    user.type = 1;
                    user.state = true;

                    console.log("ssssssssssssssss1111--->"+user.id);





        }
    })  


/*
    // crear objeto profesor
    var client = new Client();

    // recogemos parametros
    var params = req.body;

    client.rbd = params.rbd;
    client.name = params.name;
    client.address = params.address;
    client.email = params.email;
    client.phone = params.phone;
    client.ree = params.ree;
    client.membership = params.membership;
    client.services = false;
    client.code_setting = null;
    client.code_school = null;

    if (client) {
        client.save((err, clientStorage) => {
            if (err) {
                res.status(500).send({ message: 'Error al guarda cliente' });
            } else {
                if (!clientStorage) {
                    res.status(404).send({ message: 'No se ha guardado el cliente' });
                } else {

                    let totalSmsObject = {
                        school: clientStorage._id
                    }

                    let totalSmsSave = new TotalSms(totalSmsObject)
                    totalSmsSave.save((err,result) => {
                        if(err) console.log(err)
                    })

                    var user = new User();
                    user.name = client.name;
                    user.address = client.address;
                    user.phone = client.phone;
                    user.school = clientStorage._id;
                    user.email = client.email;
                    user.type = 1;
                    user.state = true;

                    Profile.findOne({ slug: 'ADMIN_SCHOOL' }, (err, profile) => {
                        user.profile = profile._id;

                        User.findOne({ email: user.email.toLowerCase() }, (err, issetUser) => {
                            if (err) {
                                res.status(500).send({ message: 'Error al comprobar usuario' });
                            } else {
                                if (!issetUser) {
                                    // ciframos contraseña
                                    bcrypt.hash(client.email, null, null, function(err, hash) {
                                        user.password = hash;

                                        user.save((err, userStored) => {
                                            if (err) {
                                                res.status(500).send({ message: 'Error al guarda usuario' });
                                            } else {
                                                if (!userStored) {
                                                    res.status(404).send({ message: 'No se ha registrado el usuario' });
                                                } else {
                                                    console.log('adming');
                                                    console.log(clientStorage);
                                                    clientStorage.admin = userStored;
                                                    console.log(clientStorage);
                                                    res.status(200).send({ client: clientStorage });
                                                }
                                            }
                                        });
                                    });
                                } else {
                                    res.status(400).send({ message: 'Usuario ya existe!' });
                                }
                            }
                        });
                    });
                }
            }
        });
    }



*/




}


function getClients(req, res) {


    models.Client.findAll().then( function(clients) { 
        if (!clients) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (clients) {
            res.status(200).send(clients);
          } 
      } 
    });





/*    
  
    Client.find().populate([{
        path: 'code_setting',
        model: 'Setting'
    }, ]).exec((err, clients) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición', err: err })
        } else {
            if (!clients) {
                res.status(200).send([])
            } else {
                var promises = [];
                clients.forEach((element, _i) => {
                    promises.push(
                        User.findOne({ school: element._id })
                        .then((data) => {
                            element.admin = data;
                            return element;
                        })
                        .catch((error) => {
                            res.status(500).send({
                                message: 'Error al entregar cliente!'
                            })
                        })
                    );
                });

                Promise.all(promises).then((responses) => {
                    res.status(200).send(responses);
                });
            }
        }
    });

*/


}

function updateClient(req, res) {
    const clientId = req.params.id;
    const update = req.body;

    Client.findByIdAndUpdate(clientId, update, { new: true }, (err, clientUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'Error al actualziar cliente!'
            })
        } else {
            if (!clientUpdated) {
                res.status(404).send({ message: 'No se a podido actualizar cliente!' });
            } else {
                res.status(200).send({ client: clientUpdated });
            }
        }
    });
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

module.exports = {
    saveClient,
    getClients,
    updateClient,
    saveProfile,
    saveClientSetting,
    saveClientSchool
}