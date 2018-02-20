'use strict'

var xlsx = require('node-xlsx'),
	fs   = require('fs')

var bcrypt = require('bcrypt');

// modelos
var Student = require('../models/student');
var Responsable = require('../models/responsable');
//var Note = require('../models/note');
var User = require('../models/user');
var Profile = require('../models/profile');

var models = require('../models');

// services
var jwt = require('../services/jwt');

var Util     = require('../util/function')
// librerias 
var emailValidator = require('email-validator')
var chalk = require('chalk')


function donwloadFile(req,res)
{
  // Función para descargar el archivo excel

  var file = './student_excel.xlsx'
  
  res.setHeader('Content-disposition', 'attachment; filename='+file)
  res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  
  res.download(file)
}

function masiveAssing(req,res)
{
	var arreglomasive = [{registro :''},{motivo:''}];

	var obj = arreglomasive;

	var ii = 0;
	let arrayErr = []
   //if(req.file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
   if(req.file.mimetype === 'application/octet-stream' || req.file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')	
      {      
      	var path = "./excel_import/"+req.file.filename

		fs.exists(path, function(exist)
		{
			if(exist)
			{
  				var obj = xlsx.parse('./excel_import/'+req.file.filename),
					con_g = 0,
					con_t = 0,
					con_r = 0,
					validate = false

					obj.forEach(function(elementGlobal, indexGlobal){ 
					    con_t = elementGlobal.data.length

					   	elementGlobal.data.forEach( function(element, index){

						    if(index > 0)
							{
								var rutced = element[2];
								var rutced1 = rutced.toString();

								models.Student.findOne({ where: { rut: rutced1 }}).then( result => {
								    if(!result)
								    {

								       	var student={};

						                student.name = element[0];
						                student.lastname = element[1];
						                student.rut =element[2];
						                // student.code_grade = params.code_grade
						                // student.code_teaching = params.code_teaching
						                // student.character = params.character
						                student.birth_date = (element[4] - (25567 + 2))*86400*1000 //element[4]  params.birth_date
						                student.age = element[5];
						                student.course = null
						                student.state = true
						                student.school = req.user.sub;

						                var rutcedres = element[8];
									    var rutced2 = rutcedres.toString();
				
										models.Responsable.findOne({ where: { rut: rutced2 }}).then( responsable => {
							                if(responsable)
							                {

						                        student.responsable_id = responsable.id
						                                         
						                        models.Student.create(student).then( function(studentStore) 
						                        { 
						                          if (!studentStore) 
						                              {
						                               res.status(404).send({ message: 'No se ha guardado el estudiante' });
						                              } 
						                        });   
							                }
							                else
						                	{
			                                	var respon={}; 

					                            respon.name = element[6]
					                            respon.lastname = element[7]
					                            respon.rut = element[8]
					                            respon.email = element[9]
					                            respon.phone = element[10]
						                        respon.address = element[11]

						                        if(element[10].length !== 9)
						                        {
						                        	var correo1 = element[0] +' '+element[1]+" rut "+element[2];

				                              	  	arrayErr.push({"registro": correo1, "motivo":"El telefono del responsable debe tener 9 caracteres"})
				                              	  	if(index + 1 === elementGlobal.data.length)
												  	{
														res.status(200).send({ message: 'Ha finalizado con éxito la carga de alumnos', errores: arrayErr } )
												  	}
				                              	  	
						                        }
						                        else
						           				{
						           					if (emailValidator.validate(respon.email)) 
						                              { 
						                              	models.Responsable.create(respon).then( function(responStore) { 

						                                    if (!responStore) {
						                                     res.status(500).send({ message: 'Error al guardar el responsable' });
						                                    } 
						                                    else 
						                                    {

						                                        models.Profile.findOne({ where: { slug:  'RESPONSABLE' }}).then( profile => {
						                                       
							                                        if(profile)
							                                        {
							                                        	student.responsable_id = responStore.id

						                                                var user={}; 

						                                                user.name = element[6] +' '+element[7];
						                                                user.address = element[11];
						                                                user.phone = element[10];
						                                                user.school = req.user.sub

						                                                user.profile_id = profile.id;
						                                                user.email = element[9];
						                                                user.password = bcrypt.hashSync(element[9], 10);
						                                                user.state = true;
						                                                user.services = true;
						                                                user.validatePass = false;
						                
						                                                user.responId = responStore.id
						                                                models.User.create(user).then( function(userStore) { 

							                                                if (!userStore) {
							                                                    
							                                                    res.status(500).send({ message: 'Error al guardar el usuario del responsable' });
							                              
							                                                } 
							                                                else 
							                                                {
						                                                	 	models.Student.create(student).then( function(studentStore) 
						                                                        { 

						                                                        	if (!studentStore) 
							                                                        {
							                                                          	res.status(404).send({ message: 'No se ha guardado el estudiante' });
							                                                        }
							                                                        else
							                                                        {
							                                                        	if(index + 1 === elementGlobal.data.length)
																						{
																							res.status(200).send({ message: 'Ha finalizado con éxito la carga de alumnos', errores: arrayErr } )
																						}
							                                                        }                                     
						                                                       });  
						                                                    }
					                                               		})	
							                                        }
							                                        else
					                                        		{
				                                        	 			res.status(404).send({ message: 'No Existe el perfil de RESPONSABLE' });
				                                        			}
				                                      			}) 	
				                                    		}   
				                                   		})     
					                              	}
					                              	else
					                              	{
					                              	  //el correo no es valido
					                              	  var correo1 = element[0] +' '+element[1]+" rut "+element[2];
					                              	  arrayErr.push({"registro": correo1, "motivo":"correo del responsable invalido"})
					                              	  if(index + 1 === elementGlobal.data.length)
													  {
														res.status(200).send({ message: 'Ha finalizado con éxito la carga de alumnos', errores: arrayErr } )
													  }

					                              	}
					                              } // fin validar 9 caracteres en el telfono
						                	}				
					            		})    	

							    	}
							    	else
							    	{

								    	 var estudiante1 = element[0] +' '+element[1] +' rut: '+ element[2];
								    	 arrayErr.push({"registro": estudiante1, "motivo":"Estudiante ya existe"})
							    		//el estudiante ya existe

							    		if(index + 1 === elementGlobal.data.length)
										{
											res.status(200).send({ message: 'Ha finalizado con éxito la carga de alumnos', errores: arrayErr } )
										}
							    	}     	 
	                          	})
								
							}//fin de index
							
						})	//fin del forEach	
			    })  //fin del forEach
			   // res.status(200).send({ message: 'Todos los alumnos han sido importados con éxito', repetidos: con_r, guardados: con_g, total: con_t -1 })
            }
            else
			{
				// si no existe el archivo
				res.status(500).send({ message: 'No existe el archivo solicitado'})
			}
       })
      } 
       else
	  {
		var path = "./excel_import/"+req.file.filename
		fs.unlink(path, function(err){
			if(err)
			{ res.status(500).send({ message: 'No se ha podido borrar el archivo '}) }
			else
			{ res.status(404).send({ message: "El archivo no es de tipo excel por ende no se puede procesar" }) }
		})
	  }	

} //fin de masive	

module.exports = {
  donwloadFile,
  masiveAssing
}
