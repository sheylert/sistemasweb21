'use strict'


var Setting = require('../models/setting');

// services
var jwt = require('../services/jwt');

var models = require('../models');

var fs = require('fs');

const chalk = require('chalk');

// Mostrar setting
// GET http://localhost:3789/setting
function showAllSettings(req, res) { 
    //school: req.user.sub

  models.Setting.findAll({ where: { school: req.user.sub }}).then( function(settings) { 
        if (!settings) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (settings) {
            res.status(200).send(settings);
          } 
      } 
   })
}
// Registrar setting
// POST http://localhost:3789/setting
function saveSetting(req, res) {
    var params = req.body;
    console.log(params)

    // validar tipo de archivo
    
    if(req.file)
    {
        if (req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/png") {
            var path = "./public/uploads/" + req.file.filename
            fs.exists(path, function(err) {
                console.log(`nombre del archivo ${ path }`)
                // renombrado imagen
                fs.rename(path, path + '.jpg', function(err) {
                    console.log(`archivo renombrado exitosamente:`);
                    // validar otros parámetros
                    save_params(req,res,params,path,false)
                })
            })
        } else {
            res.status(500).send({ message: "Tipo de archivo no soportado o imagen no cargada" });
        }
    }
    else
    {
        save_params(req,res,params,null,false)
    }
        

}

function getDateLimitConfig(req, res) {
    Settings.find().select('dateLimitConfig').exec((err, result) => {
        if (err) {
            res.status(500).send({ message: "Error en la petición" });
        }
        res.status(200).send(result);
    })
}

function updateSetting (req,res) {
    // body... 

    var params = req.body;

    //console.log(`tipo de archivo ${ req.file.mimetype }`)
    // validar tipo de archivo
    if(req.file)
    {
        if (req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/png") {
            var path = "./public/uploads/" + req.file.filename
            fs.exists(path, function(err) {
                console.log(`nombre del archivo ${ path }`)
                // renombrado imagen
                fs.rename(path, path + '.jpg', function(err) {
                    console.log(`archivo renombrado exitosamente:`);
                    // validar otros parámetros
                    save_params(req,res,params,path,true)
                })
            })
        } else {
            res.status(500).send({ message: "Tipo de archivo no soportado o imagen no cargada" });
        }
    }
    else
    {
        save_params(req,res,params,null,true)
    }
}

function save_params (req,res,params, path = null, edit = null) 
{

    if(edit)
    {
        // editar ===============================**
        
        const id = req.params.id;
        console.log(id)
        

        if (params.dateLimitConfig && params.periodo &&
                params.yearCurrent && params.dateInit1 &&
                params.dateEnd1 && params.dateInit2 &&
                params.dateEnd2) 
        {

             models.Setting.findOne( { where: { id: id} }).then( function(result) {     
                
                if(path)
                {
                    fs.unlinkSync(result.dataValues.nameLogo) //revisar
                }

                var setting = new Object;

                setting.dateLimitConfig = params.dateLimitConfig
               
                setting.nameLogo = path ? path+'.jpg' : null;
                setting.periodo = params.periodo
                setting.yearCurrent = params.yearCurrent
                setting.dateInit1 = params.dateInit1
                setting.dateEnd1 = params.dateEnd1
                setting.dateInit2 = params.dateInit2
                setting.dateEnd2 = params.dateEnd2
                setting.lapso = params.lapso
                setting.school = req.user.sub

                if(params.codeNumber)
                {
                    setting.codeNumber = params.codeNumber
                }
                
        models.Setting.update(setting, 
                         {where: { id: id } }).then( function(updateSetting) { 

        if (!updateSetting) {
          res.status(500).send({ message: 'No se a podido actualizar Setting!' });
        } else {
          res.status(200).send({ setting: updateSetting });
        }
    })    
            })
        }
        else
        {
            res.status(500).send({ message: "Por farvor Introduzca todos los parametros necesarios " });            
        }
    }
    else
    {
        // guardar ===============================**

        if (params.dateLimitConfig && params.periodo &&
                params.yearCurrent && params.dateInit1 &&
                params.dateEnd1 && params.dateInit2 &&
                params.dateEnd2) 
            {

                console.log(chalk.green('datos validados...'))

                var setting = new Object;
               
                setting.dateLimitConfig = params.dateLimitConfig
               
                setting.nameLogo = path ? path+'.jpg' : null;
                setting.periodo = params.periodo
                setting.yearCurrent = 2  //params.yearCurrent revisar             
                setting.dateInit1 = params.dateInit1
                setting.dateEnd1 = params.dateEnd1
                setting.dateInit2 = params.dateInit2
                setting.dateEnd2 = params.dateEnd2
                setting.lapso = params.lapso
                setting.school = req.user.sub

                if(params.codeNumber)
                {
                    setting.codeNumber = params.codeNumber
                }
       
                   models.Setting.create(setting).then( function(settingStorage) { 

                    if (!settingStorage) {
                      res.status(500).send({ message: 'Error al guarda perfil' });
                    } else {
                          res.status(200).send( {resu: settingStorage});
                    }
                });
            } else {
                res.status(500).send({ message: "Por farvor Introduzca todos los parametros necesarios " });

            }        
    }
        
}

module.exports = {
    showAllSettings,
    saveSetting,
    getDateLimitConfig,
    updateSetting
}