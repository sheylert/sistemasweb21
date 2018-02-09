'use strict'

var xlsx = require('node-xlsx'),
	fs   = require('fs')

// modelos
var models = require('../models');

// librerias
var bcrypt = require('bcrypt-nodejs');
var emailValidator = require('email-validator')


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
	// Función para importar los alumnos desde el excel

	if(req.file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
	{
		// bloque de código si el archivo es un tipo excel

		var path = "./excel_import/"+req.file.filename
		
		fs.exists(path, function(exist){
			if(exist)
			{
				var obj = xlsx.parse('./excel_import/'+req.file.filename),
					con_g = 0,
					con_t = 0,
					con_r = 0,
					validate = false

				obj.forEach(function(elementGlobal, indexGlobal) 
				{
					con_t = elementGlobal.data.length


					elementGlobal.data.forEach( function(element, index) 
					{
						if(index > 0)
						{
							Student.findOne( { rut: element[2] } ).exec((err,students) => {
							    if(!students)
							    {
							    	let student = Object.assign({},{
										name : element[0],
										lastname: element[1],
										rut  : element[2],
										course: null,
										code_grade: null,
  										code_teaching: null,
  										character: null,
										date : new Date((element[3] - (25567 + 2))*86400*1000),
										birth_date:  new Date((element[4] - (25567 + 2))*86400*1000),
										age  : element[5],
										state: true,
										school : req.user.sub,
										responsable : null
									})

									Responsable.findOne( { rut: element[8] } ).exec((err,responsa) => {
			          					if(responsa)
			          					{
			          						// si se encuentra registrado el responsable

			          						student.responsable = responsa._id
											
											let studentModel = new Student( student )

											studentModel.save((err,studentStore) =>{
												if(err)
												{
													res.status(404).send({ message: 'no se ha podido guardar el usuario', error: err, total: con_t - 1, guardados: con_g, faltantes: con_t - con_g - 1 })
													validate: true
												}
											})

											User.findOne( {email: responsa.email}).exec((err,userStored) => {
												if(!err)
												{
													if(!userStored)
													{
														Profile.findOne({ slug: 'RESPONSABLE' }).exec((err, profile) => {
															var user = new User()
											                 user.name    = element[6] + element[7];
											                 user.address = element[11];
											                 user.phone   = element[10];
											                 user.school  = req.user.sub;
											                 user.profile = profile._id;
											                 user.email   = element[9];
											                 user.state   = true;
											                 user.type    = 2;
											                 user.validatePassword = false;
											                 user.responId     = responsa._id

											                bcrypt.hash(123456789, null, null, function (err, hash) {
											                    user.password = hash;

											                    user.save((err, userStore) => {
											                      if (err) 
											                      {
											                        res.status(500).send({ message: `Error al guardar el usuario del responsable ${responsa.name} ${responsa.lastname}` ,error: err});
											                        validate: true
											                      } 
											                      else 
											                      {
											                        if (!userStore) 
											                        {
											                          res.status(404).send({ message: `No se guardado el usuario del responsable ${responsa.name} ${responsa.lastname}` });
											                          validate: true
											                        } 
											                      }
											                    })
											                })
											            }) //fin busqueda profile
													}
												}
											})

											con_g++;

											if(index + 1 == con_t)
											{
												fs.unlink(path, function(err){
													if(err)
													{
														res.status(500).send({ message: 'No se ha podido borrar el archivo ya con los datos cargados'})		
													}
													else
													{
														if(!validate)
														{
															res.status(200).send({ message: 'Todos los alumnos han sido importados con éxito', repetidos: con_r, guardados: con_g, total: con_t -1 })
														}
													}
												})
											}
			          					}
			          					else
			          					{
			          						// si no se encuentra registrado el responsable

			          						let responsable = Object.assign({},{
												name : element[6],
												lastname: element[7],
												rut: element[8],
												email  : element[9],
												phone: element[10],
												address: element[11]
											})

											let reponsableModel = new Responsable(responsable)

                            				if (emailValidator.validate(responsable.email)) { // validando que email sea valido

												reponsableModel.save((err,responsableStore) =>{
													if(err)
													{
														res.status(404).send({ message: `no se ha podido guardar el apoderado ${responsable.name} ${responsable.lastname}`, error: err, total: con_t - 1, guardados: con_g, faltantes: con_t - con_g - 1 })
														validate: true
													}
													else
													{
														Profile.findOne({ slug: 'RESPONSABLE' }).exec((err, profile) => {
															// creación del estudiante

															student.responsable = responsableStore._id

															let studentModel = new Student( student )

															// creacion del usuario para el responsable

															var user = new User()

											                 user.name    = element[6] + element[7];
											                 user.address = element[11];
											                 user.phone   = element[10];
											                 user.school  = req.user.sub;
											                 user.profile = profile._id;
											                 user.email   = element[9];
											                 user.state   = true;
											                 user.type    = 3;
											                 user.validatePassword = false;
											                 user.responId     = responsableStore._id

											                bcrypt.hash(123456789, null, null, function (err, hash) {
											                    user.password = hash;

											                    user.save((err, userStore) => {
											                      if (err) 
											                      {
											                        res.status(500).send({ message: `Error al guardar el usuario del responsable ${responsable.name} ${responsable.lastname} porque su email ya existe en la base de datos` ,error: err});
											                        validate: true
											                      } 
											                      else 
											                      {
											                        if (!userStore) 
											                        {
											                          res.status(404).send({ message: 'No se guardado el usuario del responsable' });
											                          validate: true
											                        } 
											                        else
											                        {
											                        	studentModel.save((err,studentStore) =>{
																			if(err)
																			{
																				res.status(404).send({ message: 'error antes de guardar el estudiante ', error: err, total: con_t -1, guardados: con_g, faltantes: con_t - con_g - 1  })
																				validate: true
																			}
																			else
																			{
																				if(!studentStore)
																				{
																					res.status(404).send({ message: 'no se ha podido guardar el estudiante', error: err, total: con_t -1, guardados: con_g, faltantes: con_t - con_g - 1  })		
																					validate: true
																				}
																				else
																				{
																					con_g++;
																					if(index + 1 == con_t)
																					{
																						fs.unlink(path, function(err){
																							if(err)
																							{
																								res.status(500).send({ message: 'No se ha podido borrar el archivo ya con los datos cargados'})		
																							}
																							else
																							{
																								if(!validate)
																								{
																									res.status(200).send({ message: 'Todos los alumnos han sido importados con éxito', repetidos: con_r, guardados: con_g, total: con_t -1 })
																								}
																							}
																						})
																					}
																				}
																			}
																		}) // fin función save student
											                        }
											                      }
											                    }) // fin funcion guardar usuario		
															}) // fin función encrypt password
														}) // fin busqueda profile
													} // fin if error al guardar el apooderado
												}) // fin fucnión guardar el apoderado
											}
											else
											{
												// si dio error la validación del email
												res.status(404).send({ message: "formato de email invalido", error: err, total: con_t -1, guardados: con_g, faltantes: con_t - con_g })
												validate = true
											}
			          					} // fin if no se encontro responsable existente
			          				}) // fin función responsable find

							    } // fin !student
							    else
							    {
							    	con_r++;

							    	if(index + 1 == con_t)
									{
										fs.unlink(path, function(err){
											if(err)
											{
												res.status(500).send({ message: 'No se ha podido borrar el archivo ya con los datos cargados'})		
											}
											else
											{
												if(!validate)
												{
													res.status(200).send({ message: 'Todos los alumnos han sido importados con éxito', repetidos: con_r, guardados: con_g, total: con_t -1 })
												}
											}
										})
									}
							    }
							}) // fin find student function		
						}	// fin validacion index > 0
					}) // fin foreach
				}) // fin foreach
			} // fin si existe el archivo
			else
			{
				// si no existe el archivo
				res.status(500).send({ message: 'No existe el archivo solicitado'})
			}
		}) // fin de la función exist
	}
	else
	{
		// si el archivo no es de tipo excel
		
		var path = "./excel_import/"+req.file.filename

		fs.unlink(path, function(err){
			if(err)
			{
				res.status(500).send({ message: 'No se ha podido borrar el archivo '})		
			}
			else
			{
				res.status(200).send({ message: "El archivo no es de tipo excel por ende no se puede procesar" })
			}
		})
	}
		
	
}

module.exports = {
  donwloadFile,
  masiveAssing
}