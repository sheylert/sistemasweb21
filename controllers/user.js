'use strict'

// modulos
//var bcrypt = require('bcrypt-nodejs');
var bcrypt = require('bcrypt');

var nodemailer = require('nodemailer');
var https = require('http');
var request = require('request');

var models = require('../models');

// modelos
var User = require('../models/user');
var Student = require('../models/student');
var Responsable = require('../models/responsable');
var Client = require('../models/client');
var Profile = require('../models/profile');
//var Sms = require('../models/sms');
//var ListSms = require('../models/listSms')
var Template = require('../models/template');
//var Settings = require('../models/setting');
var Util     = require('../util/function')
var UtilPrueba     = require('../util/functionPrueba')
// services
var jwt = require('../services/jwt');



function saveUser(req, res) {
 
   var user = new Object();

   var params = req.body;

  if (params.name && params.address && params.phone && params.email) {

    user.name = params.name;
    user.address = params.address;
    user.phone = params.phone;
    user.school = req.user.sub;
    user.profile_id = params.profile_id;
    user.services = true;
    user.email = params.email;
    user.password = params.password;
    user.state = params.state == 1 ? true : false;
    user.validatePass = false;

     models.User.findOne( { where: { email: user.email.toLowerCase() }}).then( function(users) { 
   
       if (users) {
          //res.status(500).send({ message: 'Error al comprobar usuario' });
          res.status(500).send({ message: 'Usuario ya existe!' });
        } else {
          if (!users) {

            user.password = bcrypt.hashSync(user.password, 10);

                models.User.create(user).then( function(insertarUser) 
              { 

                    if (!insertarUser) {
                      res.status(404).send({ message: 'No se ha guardado correctamente' });
                    } else 
                    {

                    models.User.update({ _id: insertarUser.id }, 
                        {where: { id: insertarUser.id }, returning: true }).then( result => {

                         res.status(200).send({ user: insertarUser });
                       });     
                   }     

            });
         } //if (!users) 

       }
      }); 

  } else {
    res.status(400).send({ message: 'Ingresa los datos correctos para poder registrar al usuario' });
  }
}

function putUser(req, res) {

var userId = req.params.id;
var updaterecord = req.body;

updaterecord.school = updaterecord.school.id;
var password;

  models.User.findOne( { where: { id: userId }}).then( function(users) { 
    if (users) {
         password = users.password;
    }
  });

  bcrypt.compare(password, updaterecord.password, function(err, respuesta) {
            if (!respuesta) {
                updaterecord.password = bcrypt.hashSync(updaterecord.password, 10);
            }
    });   

  models.User.update( updaterecord, 
                         {where: { id: userId } }).then( function(updateuser) { 

        if (!updateuser) {
          res.status(500).send({ message: 'No se a podido actualizar Usuario!' });
        } else {
          res.status(200).send({ user: updateuser });
        }
    }) 
} 


function login(req, res) {
  // recogemos parametros de petición
  var params = req.body;
  var email = params.email;
  var password = params.password;
 
 models.User.findOne( {
      where: { email: email.toLowerCase() },
      include: [{
        model: models.Client,
        as : 'clientes'
      },{
        model: models.Profile,
        as : 'perfiles'
      }]
})
 .then( function(user) {

        if (!user) {
          res.status(500).send({ message: 'Error al comprobar usuario' });
        } else {
          if (user) {

            if (user.state) {

          bcrypt.compare(password, user.password, function(err, respuesta) {
          // models.User.findOne( { where: { password: password, id: user.id }} ).then( function(check) {
            if (!respuesta) {
                 res.status(404).send({ message: 'El usuario no ha podido loguearse correctamente!' });
             }
             else
             {

              user.dataValues.profile  = user.dataValues.perfiles.dataValues

              //-----------------------------------------------------
              if (user.school) {

                 models.Client.findOne( { where: { id: user.school }} ).then( function(schoolStoraged) {

                    user.dataValues.services = schoolStoraged.dataValues.services;

                    if (schoolStoraged) {
                      if (user.dataValues.school) {

                        user.dataValues.school = user.dataValues.clientes.dataValues
                        res.status(200).send({
                          user: user.dataValues,
                          token: jwt.createToken(user.dataValues)
                        });
                      } else {
                       
                        res.status(200).send({
                          user: user.dataValues,
                          token: jwt.createToken(user.dataValues)
                        });
                      }
                    }
                  });
                } else {
                  if (params.getToken) {
                    if (user.school) {
                      res.status(200).send({
                        user: user,
                        token: jwt.createToken(user.dataValues)
                      });
                    } else {
                      res.status(200).send({
                        user: user,
                        token: jwt.createToken(user.dataValues)
                      });
                    }
                  } else {
                    res.status(200).send({ user  : user.dataValues, token: jwt.createToken(user.dataValues) });
                  }
                }
             }
            });

           } else {
         res.status(500).send({ message: 'Usuario desactivado' });
            }
          }

           else {
            res.status(404).send({ message: 'Usuario no existe!' });
          }
        }
      });
}

function sendSmsMasiveNewApi(req,res){
  /** =======================================================================================
        Función para enviar mensajes masivos a varios apoderado, recibe el id del estudiante y el 
        id del template.... \\ prueba nueva api \\
        
      ====================================================================================== **/

  let arregloConsultas = [];
  let arregloSmsMasive = [];
  let number = '';

  var params = req.body,
    mensaje = '',
    idTemplate = '',
    typeSms = params.type == 1 ? true : false,
    aviso = '',
    total_estudiantes = params.estudiante.length,
    quantityErrorCount = 0,
    quantitySuccessCount = 0
  // buscamos el template
  Template.findOne({ _id: params.template }).exec((err, template) => {
    if (err) {
      res.status(500).send({ message: "Error al buscar el template" })
    }
    else {
      if (!template) {
        res.status(200).send({ message: "No se encontro ningún template" })
      }
      else {
        mensaje = template.template_text
        idTemplate = template._id
      }
    }

    // iteramos por cada estudiante
    params.estudiante.forEach(function (ele, index) {
      arregloConsultas.push(Student.findOne({ _id: ele }).populate('responsable').exec((err, student) => {
        /*Settings.findOne( {school: student.school} ).select('codeNumber').exec((err,setting) => {
          
        })*/
        
      })) // fin carga de promesas y función para buscar los estudiantes
    });// fin foreach student

    Promise.all(arregloConsultas).then(responsePromise => {

      let objetoPorEstudiante = {
            typeSms : typeSms,
            templateId :idTemplate,
            totalEstudiantes : total_estudiantes,
            labsmobileResponse: {},
            aviso,
            estudiante: {}
          }
      
      responsePromise.forEach( function(element, index) {
        
        let labsmobileResponse = {
          statusResponseApi : null,
          statusMessageApi  : null,
          quantitySuccess: 1,
          quantityError  : 1
        }

        if(typeSms)
        {
          number = '56'+element.responsable.phone

          let anotherUrl = `https://platform.clickatell.com/messages/http/send?apiKey=-bcLQqdjQ0OJV-vI8l_HJA==&to=${number}&content=${mensaje}`

          request({
            url: anotherUrl,
            method: 'GET',
            headers: {
            'Access-Control-Allow-Origin': '*'
            }
          }, function (error, response, body) {
            
            var body = JSON.parse(body)

            if (error) 
            {
              // si hubo un error en al enviar la mensajeria
              aviso = 'Ha ocurrido un error al enviar la mensajería, es posible que se haya quedado sin creditos'
              labsmobileResponse.statusResponseApi = 500
              labsmobileResponse.statusMessageApi  = null

              

              arregloSmsMasive.push(Object.assign({}, objetoPorEstudiante, {
                labsmobileResponse: labsmobileResponse,
                estudiante: element
              }))

              if(index + 1 == total_estudiantes)
              {
                setTimeout(() => {
                  UtilPrueba.storedSmsMasive(req,res,arregloSmsMasive)
                }, 500)
              }
            }
            else 
            {
              
              labsmobileResponse.statusResponseApi = body.messages[0].accepted ? 200 : 500
              labsmobileResponse.statusMessageApi  = body.messages[0].error

              arregloSmsMasive.push(Object.assign({}, objetoPorEstudiante, {
                labsmobileResponse: labsmobileResponse,
                estudiante: element
              })) 

              if(index + 1 == total_estudiantes)
              {
                setTimeout(() => {
                  UtilPrueba.storedSmsMasive(req,res,arregloSmsMasive)
                }, 500)
              }
            } // fin si no hubo error*/
          }) // fin funcion request*/
        } // aquii
        else
        {
          assingObjet.labsmobileResponse.statusResponseApi = 200

          arregloSmsMasive.push(Object.assign({}, objetoPorEstudiante, {
                labsmobileResponse: labsmobileResponse,
                estudiante: element
          }))

          if(index + 1 == total_estudiantes)
          {
            setTimeout(() => {
              UtilPrueba.storedSmsMasive(req,res,arregloSmsMasive)
            }, 500)
          }
        } //fin si es una notificación
      });
      
    }).catch(reject => {
        console.log(reject)
        res.status(400).send({ message: "Ha ocurrido un error al enviar la mensajería, es posible que se haya quedado sin creditos" })
    })
  })// fin función buscar template
}

function sendSmsMasive(req, res) {
  /* =========================================================================================================
    Función para el envio masivo de sms, recibe un array llamado sms por el que se itera y el id del template
    a buscar.. \\ Vieja Api \\
   ========================================================================================================= */

  let arregloConsultas = [];
  let numbers = '';

  var params = req.body,
    mensaje = '',
    idTemplate = '',
    typeSms = params.type == 1 ? true : false,
    aviso = '',
    total_estudiantes = params.estudiante.length,
    quantityErrorCount = 0,
    quantitySuccessCount = 0,
    codigoPais = 56;
  // buscamos el template
  models.Template.findOne({ where : { _id: params.template } }).then( template => {
    
    if (!template) {
      res.status(200).send({ message: "No se encontro ningún template" })
      return false
    }
    else 
    {
      mensaje = template.template_text
      idTemplate = template._id
    }
    if(req.user.profile.slug.indexOf('ENTERPRISE') === -1)
    {
      models.Setting.findOne( { where :{ school: req.user.sub } } ).then(setting => {

          if(setting) 
            {
              codigoPais = setting.codeNumber
            }

      }).catch(err => console.log('error al buscar las configuraciones', err))
    }
    else
    {
      models.SettingWorker.findOne( { where :{ school: req.user.sub } } ).then(setting => {

          if(setting) 
            {
              codigoPais = setting.codeNumber
            }

      }).catch(err => console.log('error al buscar las configuraciones', err)) 
    }
      
    

    // iteramos por cada estudiante
    params.estudiante.forEach(function (ele, index) {

      if(req.user.profile.slug.indexOf('ENTERPRISE') === -1)
      {
        arregloConsultas.push(models.Student.findOne({ where: { _id: ele } }).populate('responsable').exec((err, student) => {
          models.Settings.findOne( { where :{school: ele.school} }).select('codeNumber').exec((err,setting) => {
            
          })
          numbers = index === 0 ? `56${student.responsable.phone}` : `${numbers},56${student.responsable.phone}`;
          quantityErrorCount++;
          quantitySuccessCount++;
          
        })) // fin carga de promesas y función para buscar los estudiantes
      }
      else
      {

        arregloConsultas.push(models.Worker.findOne({ where: { _id: ele } }).then(worker => {
          
          // buscamos en la configuración el código de tlf internacional para agg como prefijo al tlf

          
            numbers = index === 0 ? `${codigoPais}${worker.phone}` : `${numbers},${codigoPais}${worker.phone}`;
            quantityErrorCount++;
            quantitySuccessCount++;
            return worker
          
        }).catch(err => console.log('el id del trabajador es incorrecto'))) // fin carga de promesas y función para buscar los estudiantes 
      }
    });// fin foreach student

    Promise.all(arregloConsultas).then(responsePromise => {

      let labsmobileResponse = {
        statusResponseApi : 200,
        statusMessageApi  : 'Ok',
        quantitySuccess: quantityErrorCount,
        quantityError  : quantitySuccessCount
      }
      if(typeSms)
      {
        let urlRequest = 'https://api.labsmobile.com/get/send.php?username=contactopronotas@gmail.com&password=kf94rd36&msisdn=' + numbers + '&message=' + mensaje + '&sender=56999415041'
        request({
          url: urlRequest,
          method: 'GET',
        }, function (error, response, body) {
        if (response) 
          {
            // si hubo un error en al enviar la mensajeria
            aviso = 'Ha ocurrido un error al enviar la mensajería, es posible que se haya quedado sin creditos'
            labsmobileResponse.statusResponseApi = response.statusCode
            labsmobileResponse.statusMessageApi  = response.statusMessage
            Util.storedSmsMasive(req,res,responsePromise,idTemplate,typeSms,labsmobileResponse,total_estudiantes,aviso,numbers)
          }
          else 
          {
            aviso = 'Mensajería Enviada con Éxito'
            labsmobileResponse.statusResponseApi = response.statusCode
            labsmobileResponse.statusMessageApi  = response.statusMessage
            Util.storedSmsMasive(req,res,responsePromise,idTemplate,typeSms,labsmobileResponse,total_estudiantes,aviso,numbers)

          } // fin si no hubo error
        }) // fin funcion request*/
      
      }// aquii
      else
      {
        aviso = "Notificaciónes guardadas con éxito"
        Util.storedSmsMasive(req,res,responsePromise,idTemplate,typeSms,labsmobileResponse,total_estudiantes,aviso,numbers)
      } //fin si es una notificación*/
        
    }).catch(reject => {
        console.log(reject)
        res.status(400).send({ message: "Ha ocurrido un error al enviar la mensajería, es posible que se haya quedado sin creditos" })
    })
  })// fin función buscar template
} // aquii

function sendSmsSingle(req, res) {

  /** =======================================================================================
        Función para enviar un solo mensaje a un apoderado, recibe el id del estudiante y el 
        id del template
      ====================================================================================== **/

  var params = req.body,
    number = '',
    mensaje = '',
    idTemplate = '',
    typeSms = params.type == 1 ? true : false,
    aviso = ''

    models.Template.findOne({ where : { _id: params.template } }).then( template => {
    
    if (!template) {
      res.status(200).send({ message: "No se encontro ningún template" })
      return false
    }
    else 
    {
      mensaje = template.template_text
      idTemplate = template._id
    }


    models.Student.findOne( {
      where: { _id: params.estudiante },
          include: [{
            model: models.Responsable,
            as : 'responsableStudent'
          }]
    })
     .then( function(student) {

        number = `56${student.responsable.phone}`
        mensaje = mensaje.indexOf(':responsable') != -1 ? mensaje.replace(':responsable', student.responsable.name + student.responsable.lastname) : mensaje
        mensaje = mensaje.indexOf(':estudiante') != -1 ? mensaje.replace(':responsable', student.name + student.lastname) : mensaje

        let labsmobileResponse = {
            statusResponseApi : null,
            statusMessageApi  : null,
            quantityError : 1,
            quantitySuccess: 1
        }

        if (typeSms) 
        {  
          // si es un sms lo que hay que enviar
          request({
            url: 'http://api.labsmobile.com/get/send.php?username=contactopronotas@gmail.com&password=kf94rd36&msisdn=' + number + '&sender=SENDER&message=' + mensaje,
            method: 'GET',
          }, function (error, response, body) {
            if (error) {
              // si hubo un error en al enviar la mensajeria
              aviso = 'Ha ocurrido un error al enviar la mensajería, es posible que se haya quedado sin créditos'

              labsmobileResponse.statusResponseApi = response.statusCode
              labsmobileResponse.statusMessageApi  = response.statusMessage

              Util.storedSmsSingle(req,res,student,idTemplate,typeSms,labsmobileResponse,aviso)
            }
            else 
            {

              aviso = 'Mensajería Enviada con Éxito'

              labsmobileResponse.statusResponseApi = response.statusCode
              labsmobileResponse.statusMessageApi  = response.statusMessage

              Util.storedSmsSingle(req,res,student,idTemplate,typeSms,labsmobileResponse,aviso)

            } // fin si no hubo error al enviar el sms
          }) // fin funcion request
        } // si no es un sms
        else 
        {
          aviso = 'Notificación guardada con éxito'
          Util.storedSmsSingle(req,res,student,idTemplate,typeSms,labsmobileResponse,aviso)
          
        } // fin if si no es un sms lo que hay que enviar
       // })fin busqueda de numero país en settings
    })// fin find Student function
  }) // fin función buscar template


}

function getUsers(req, res) {

   let filtro = {}

   // filtro = {school : req.user.sub}

   if (req.user.profile.slug !== "SUPER_ADMIN"){
    filtro = {school : req.user.sub}
   }
 
// var school = req.user.sub; //revisar el school que esta cableado
  //models.User.findAll({ where: filtro })

   models.User.findAll( {
      where:  filtro,
      include: [{
        model: models.Client,
        as : 'clientes'
      },{
        model: models.Profile,
        as : 'perfiles'
      }]
})
 .then( function(user) { 

     if (!user) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (user) { 
                 res.status(200).send(user);
          } 
        }     
  });
}

function overwritePass(req, res) {
  // función para sobreescribir el pass por defecto y validar que ya hizo session por primera vez (Solo para apoderados)
  let update = {
    validatePass: true,
    password: req.body.password
  }
      update.password = bcrypt.hashSync(update.password, 10);

      models.User.update( update, 
                         {where: { id: req.user.userId } }).then( function(updatepass) { 

        if (!updatepass) {
          res.status(500).send({ message: 'Error al intentar modificar el usuario' });
        } else {
          res.status(200).send(updatepass);
        }
    }) 
}

function recoveryPassword(req, res) {
  // funcioón para recuperar contraseña mandando la contraseña al correo

  User.findOne({ email: req.body.email }).exec((err, user) => {

    var Service = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'pronotas7@gmail.com',
        pass: 'asdQWE123'
      }
    });

    var mailOptions = {
      from: '"Pronotas" <pronotas7@gmail.com>',
      to: req.body.email,
      subject: 'Recuperación de Contraseña',
      text: 'Tú contraseña es ' + user.password
    };

    Service.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500)({ message: "Error al enviar el correo" });
      } else {
        res.status(200).send({ message: "Su contraseña fue enviada a su correo electrónico" });
      }
    })

  })
}

module.exports = {
  saveUser,
  login,
  sendSmsMasive,
  sendSmsMasiveNewApi,
  sendSmsSingle,
  getUsers,
  putUser,
  overwritePass,
  recoveryPassword
}