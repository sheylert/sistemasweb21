'use strict'

var app = require('./app'); 
var models = require('./models');
var path = require('path');
var http = require('http');

var port = process.env.PORT || 3789;

models.sequelize.sync().then(runserver);

function runserver(){

var httpServer = http.createServer(app);
    httpServer.listen(port, function(){
    console.log('Servidor Node y Express está corriendo en el puerto' + port);

      //perfiles por defecto

    const promise = new Promise((resolve,rejected) => {

      models.Profile.findAll().then( function(profiles) { 
        if (profiles) {
           if (profiles.length == 0){
           models.Profile.create({name : 'SUPER', slug: 'SUPER_ADMIN' });
           models.Profile.create({name : 'EMPRESA', slug: 'ENTERPRISE' });
           models.Profile.create({name : 'EMPRESA BASICA', slug: 'ENTERPRISE_BASIC' });
           models.Profile.create({name : 'ESCUELA', slug: 'ADMIN_SCHOOL' });
           models.Profile.create({name : 'ESCUELA BASICA', slug: 'ADMIN_SCHOOL_BASIC' });
           models.Profile.create({name : 'RESPONSABLE', slug: 'RESPONSABLE' });
           models.Profile.create({name : 'PROFESOR', slug: 'TEACHER' });
           resolve()
          }
          else
          {
            resolve() 
          }
        } 
      })
    })
      
    promise.then(result => {

      return new Promise((resolve,reject) => {
        
        models.Teaching.findAll().then( function(teachings) { 
          if (teachings) 
          {
             if (teachings.length == 0){
               models.Teaching.create({name : 'PRIMARIA', slug: 'PRIMARIA' });
               models.Teaching.create({name : 'MEDIA', slug: 'MEDIA' });
               models.Teaching.create({name : 'PREESCOLAR', slug: 'PREESCOLAR' });
               resolve()
             }
             else
             {
              resolve()
             }
          } 
        }) // fin operacion
      
      }) // fin promesa
    
    }).then(result => {

      return new Promise((resolve, reject) => {
        
        models.Client.findAll().then( function(Clients) { 
          if (Clients) {
             if (Clients.length == 0)
             {

                models.Client.create({rbd : 'rbd', name: 'sistema', address: 'address', email: 'pronota@pronota.com',
                      phone: '999999999', ree : 'ree', membership: 'membership', services: true, profile_id: 1, admin : 1}
                )
                 resolve()
             }
             else
             {
              resolve()
             }
          } 
        }) // fin operacion

      }) // fin promsesa
    }).then(result => {


        models.User.findAll().then( function(users) { 
          if (users) {
             if (users.length == 0){

             models.User.create({name : 'USUARIO', address: 'address', email: 'pronota@pronota.com', 
                                 password :'$2a$10$Y8Gx8QjJFFH3zIf8556pSeUieZWus.QfariG3PVg6wPyv90GpFDNy',
                                 state:true, phone: '999999999', services: true, profile_id: 1, admin : 1, 
                                 school: 1, validatePass: false});
             }
          } 

        });
       
    })
        
  })
}
