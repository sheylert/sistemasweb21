'use strict'


var SettingWorker = require('../models/settingWorker');

// services
var jwt = require('../services/jwt');

var models = require('../models');

var fs = require('fs');

const chalk = require('chalk');

// Mostrar setting
// GET http://localhost:3789/setting
function showAllSettings(req, res) { 
    //school: req.user.sub

  models.SettingWorker.findAll({ where: { school: req.user.sub }}).then( function(settings) { 
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

    //console.log(`tipo de archivo ${ req.file.mimetype }`)

    // validar tipo de archivo
    
    if(req.file)
    {
        if (req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/png") {

            var path = "./public/uploads/" + req.file.filename
            var name = process.env.API_URL+"/public/uploads/"+req.file.filename+req.file.originalname

            fs.exists(path, function(err) {
                console.log(`nombre del archivo ${ path }`)
                // renombrado imagen
                fs.rename(path, path + req.file.originalname, function(err) {
                    console.log(`archivo renombrado exitosamente:`);
                    // validar otros parámetros
                    save_params(req,res,params,path,false,name)
                })
            })
        } else {
            res.status(500).send({ message: "Tipo de archivo no soportado o imagen no cargada" });
        }
    }
    else
    {
        save_params(req,res,params,null,false,null)
    }
        

}

function getDateLimitConfig(req, res) {
    SettingWorker.find().select('dateLimitConfig').exec((err, result) => {
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
            var name = process.env.API_URL+"/public/uploads/"+req.file.filename+req.file.originalname

            fs.exists(path, function(err) {
                console.log(`nombre del archivo ${ path }`)
                // renombrado imagen
                fs.rename(path, path + req.file.originalname, function(err) {
                    console.log(`archivo renombrado exitosamente:`);
                    // validar otros parámetros
                    save_params(req,res,params,path,true,name)
                })
            })
        } else {
            res.status(500).send({ message: "Tipo de archivo no soportado o imagen no cargada" });
        }
    }
    else
    {
        save_params(req,res,params,null,true,null)
    }
}

function save_params (req,res,params, path = null, edit = null,nameImage=null) 
{

    if(edit)
    {
        // editar ===============================**
        
        const id = req.params.id;

        if (params.codeNumber) 
        {

             models.SettingWorker.findOne( { where: { id: id} }).then( function(result) {     
                
                if(path)
                {
                    fs.unlinkSync(result.dataValues.nameLogo) //revisar
                }

                var setting = new Object;

                 setting.nameLogo = nameImage ? nameImage : null;
                      
                setting.school = req.user.sub

                if(params.codeNumber)
                {
                    setting.codeNumber = params.codeNumber
                }
                
                models.SettingWorker.update(setting, {where: { id: id } }).then( function(updateSetting) { 

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

        if (params.codeNumber) 
            {

                console.log(chalk.green('datos validados...'))

                var setting = new Object;
                     
                setting.nameLogo = nameImage ? nameImage : null;
                setting.school = req.user.sub

                if(params.codeNumber)
                {
                    setting.codeNumber = params.codeNumber
                }
       
                   models.SettingWorker.create(setting).then( function(settingStorage) { 

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