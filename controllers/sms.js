'use strict'

// modelos
/*var Sms = require('../models/sms');
var ListSms = require('../models/listSms')
const TotalSms = require('../models/totalSms')
const Student = require('../models/student')
var ResponseStatusLabsMobile = require('../models/statusResponseLabsmobile')*/

// Mostrar cantidad de mensajes enviados por colegio
// Get http://localhost:3789/countsmsbyschool/:idSchool

var models = require('../models');

function countSmsBySchool(req, res) {

	models.ListSms.findAll({ where : { school: req.params.idSchool } }).then(function (results) {
		
		if (!results) {
			
			var count = results.length;
			res.status(200).send({ cantidad: 0 });	
		}
		else
		{
			var count = results.length;
			res.status(200).send({ cantidad: count });	
		}	

		

	});
}

function smsDetailsBySchool(req, res) {
	
	/*models.ListSms.findAll({ where:{ _id: req.params.id }, 
		insert:[{
			model : model.Client,
			as    : 'cliente'
		},{
			model : model.Course,
			as    :  'curso'
		},{
			model : model.User,
			as    : 'usuario'
		},{
			model : 
		}] 
	})

	populate([{
		path: 'school',
		model: 'Client'
	},
	{
		path: 'course',
		model: 'Course',
		populate: {
			path: 'code_grade',
			model: 'CourseCode'
		}
	},
	{
		path: 'idSender',
		model: 'User',
	},
	{
		path: 'listSms',
		model: 'Sms'
	}])
		.exec((err, result) => {
			if (err) {
				res.status(500).send({ message: "Ha ocurrido un error al buscar los sms de la escuela" })
			}
			else {
				res.status(200).send(result)
			}
		})*/
}

function listSmsStored(req, res) {
	// función para listar los sms guardados, nota: si el campo type es true es un mensaje si es false es una notificación

	if(req.user.profile.slug.indexOf('ENTERPRISE') !== -1)
	{
		models.ListSms.findAll({ where: { school: req.user.sub } }).then( result => {
			if(!result)
			{
				res.json([])	
			}
			else
			{
				res.json(result)
			}
		}).catch(err => res.status(500).json( { message: 'Ha ocurrido un error buscando los datos de los mensajes guardados' }) )	
	}
	else
	{
		models.ListSms.findAll({ where: { school: req.user.sub, course_id: req.params.course },
			include: [{
				model : models.Student,
				as    : 'estudiante'
			},{
				model : models.Template,
				as    : 'template'
			}] 
		}).then( result => {
			if(!result)
			{
				res.json([])	
			}
			else
			{
				res.json(result)
			}
		}).catch(err => res.status(500).json( { message: 'Ha ocurrido un error buscando los datos de los mensajes Guardados' }) )	
	}
		
		/*.populate([{
			path: 'studentId',
			model: 'Student',
			populate: {
				path: 'responsable',
				model: 'Responsable'
			}
		},
		{
			path: 'templateId',
			model: 'Template'
		}])
		.exec((err, results) => {
			if (err) {
				res.status(500).send({ message: "Oops! ha ocurrido un error al tratar de buscar los sms o notificaciones guardadas" })
			}
			else {
				res.status(200).send(results)
			}
		})*/
}

function listSmsLastMoth(req, res) {
	// funcion para listar los sms del ultimos mes

	let date = new Date()
	date.setHours(date.getHours() - 4)
	date.setDate(0)
	let date1 = new Date()
	date1.setMonth(date1.getMonth() - 1)
	date1.setHours(date.getHours() - 4)
	date1.setDate(1)

	const lastDate = date
	const firstDate = date1

	let range = {
		[Op.gte] : firstDate,
		[Op.lte] : lastDate
	}

	models.ListSms.findAll({ where : { createt_at : range, school : req.user.sub } }).then((result) => {

		if (!result){
			res.status(200).json([])
		}
		else
		{
			res.status(200).send(result)
		}
	}).catch(err => res.status(500).json({ message: "error al ejecutar la busqueda de los mensajes" }) )
}

function listSmsLastWeek(req, res) {
	// funcion para listar los sms del ultimos mes

	let date = new Date(),
		date1 = new Date()

	date.setHours(date.getHours() - 4)
	date1.setHours(0 - 4, 0, 0, 0)

	switch (date.getDay()) {
		case 0:
			date1.setDate(date1.getDate() - 6)
			break;
		case 2:
			date1.setDate(date1.getDate() - 1)
			break;
		case 3:
			date1.setDate(date1.getDate() - 2)
			break;
		case 4:
			date1.setDate(date1.getDate() - 3)
			break;
		case 5:
			date1.setDate(date1.getDate() - 4)
			break;
		case 6:
			date1.setDate(date1.getDate() - 5)
			break;
	}


	const lastDate = date
	const firstDate = date1

	let range = {
		[Op.gte]: firstDate,
		[Op.lte]: lastDate
	}

	Sms.findAll({ where : { createt_at: range, school : req.user.sub } }).exec((err, result) => {
		if (!result){
			res.status(200).send([])
		}	
		else
		{
			res.status(200).send(result)
		}
	}).catch( err => res.status(500).json({ message: "error al ejecutar la busqueda de los mensajes" }) )
}

function listSmsWeekAndMonthNotConfirm(req, res) {
	let date = new Date(),
		date1 = new Date(),
		smsNotConfirm = {}

	date.setHours(date.getHours() - 4)
	date1.setHours(0 - 4, 0, 0 ,0)

	switch (date.getDay()) {
		case 0:
			date1.setDate(date1.getDate() - 6)
			break;
		case 2:
			date1.setDate(date1.getDate() - 1)
			break;
		case 3:
			date1.setDate(date1.getDate() - 2)
			break;
		case 4:
			date1.setDate(date1.getDate() - 3)
			break;
		case 5:
			date1.setDate(date1.getDate() - 4)
			break;
		case 6:
			date1.setDate(date1.getDate() - 5)
			break;
	}


	const lastDate = date
	const firstDate = date1

	let range = {
		$gte: firstDate,
		$lt: lastDate
	}

	Sms.find({ createt_at: range, status: "DEFAULT" }).
		populate([{
			path: 'school',
			model: 'Client'
		},
		{
			path: 'course',
			model: 'Course',
			populate: {
				path: 'code_grade',
				model: 'CourseCode'
			}
		},
		{
			path: 'idSender',
			model: 'User',
		},
		{
			path: 'listSms',
			model: 'Sms'
		}])
		.exec((err, result) => {
			if (err) {
				res.status(400).send({ message: "error al ejecutar la busqueda de los mensajes por semana" })
			}
			else {

				smsNotConfirm.smsWeek = result

				let date2 = new Date()
				date2.setHours(date2.getHours() - 4)
				date2.setDate(0)
				let date3 = new Date()
				date3.setMonth(date3.getMonth() - 1)
				date3.setHours(date2.getHours() - 4)
				date3.setDate(1)

				const lastDateMonth = date2
				const firstDateMonth = date3

				let rangeMonth = {
					$gte: firstDateMonth,
					$lt: lastDateMonth
				}

				Sms.find({ createt_at: rangeMonth, status: "DEFAULT" }).
					populate([{
						path: 'school',
						model: 'Client'
					},
					{
						path: 'course',
						model: 'Course',
						populate: {
							path: 'code_grade',
							model: 'CourseCode'
						}
					},
					{
						path: 'idSender',
						model: 'User',
					},
					{
						path: 'listSms',
						model: 'Sms'
					}])
					.exec((err, resultMoth) => {
						if (err) {
							res.status(400).send({ message: "error al ejecutar la busqueda de los mensajes" })
						}
						else {
							smsNotConfirm.smsMonth = resultMoth

							res.status(200).send(smsNotConfirm)
						}
					})
			}
		})

}

function logSmsStored(req, res) {
	/*ListSms.find({ school: req.user.sub }).
		populate([{
			path: 'school',
			model: 'Client'
		},
		{
			path: 'course',
			model: 'Course',
			populate: {
				path: 'code_grade',
				model: 'CourseCode'
			}
		},
		{
			path: 'idSender',
			model: 'User',
		},
		{
			path: 'listSms',
			model: 'Sms'
		}])
		.sort({ createt_at: -1 }).limit(20).exec((err, result) => {
			if (err) res.status(400).send({ message: "error al ejecutar la busqueda de los envios" })

			res.status(200).send(result)

		})*/
	res.json([])
}

function smsMonthWeekTotal(req, res) {
	/** Función para buscar el total de sms por el últimos mes y la última semana **/

	// Para sacar el rango de la última semana

	models.TotalSms.findOne({ where : { school: req.user.sub } }).then(result => {
		if(result)
		{

			res.status(200).send([])
		}
		else
		{
			res.status(200).send(result)
		}	

	}).catch(err => res.status(400).send({ message: "A ocurrido un error al buscar los datos totales de sms por tiempos" }) )
}

function recieveStatusSms(req, res) {
	const number = req.query.msisdn.substring(2)
	const status = req.query.status
	const confirmado = req.query.acklevel
	const id_envio = req.query.subid

	models.ListSms.findOne({ where: { phone: number },
		order: [
			['createt_at', 'DESC']
		]
	}).then(resultSearch => {

		if (resultSearch) {
			let string = status == "ok" ? "SUCCESS" : "WARNING"
			string = confirmado == "handset" ? "SUCCESS" : "WARNING"

			resultSearch.status = string
			resultSearch.idEnvio = id_envio
			resultSearch.save((err, resultUpdated) => {
				if (err) {
					console.log("error al modificar el sms con status " + string)
				}
				else {
					console.log('modificado con status ' + string + ' con éxito')

					Student.findByIdAndUpdate(resultSearch.studentId, { lastSms: "SUCCESS" }, { new: true }, (err, studentUpdated) => {
						if (err) {
							console.log("error al modificar el estudiante con status " + string)
						}
						else {
							console.log('estudiante modificado status ' + string)
						}
					})
				}

			})
		}
	}).catch( err => console.log(err))
}

function listSmsShipping(req, res) {
	ListSms.findOne({ school: req.user.sub, _id: req.params.id })
		.then((result) => {
			var promises = [];
			console.log('result');
			console.log(result);
			console.log('result.listSms');
			console.log(result.listSms);
			result.listSms.forEach(idSms => {
				promises.push(
					Sms.findById(idSms)
						.populate([{
							path: 'studentId',
							model: 'Student',
							populate: {
								path: 'responsable',
								model: 'Responsable'
							}
						}])
						.then((sms) => {
							return sms;
						})
						.catch((error) => {
							res.status(500).send({
								message: 'Error al entregar cliente!'
							})
						})
				);
			});
			
			console.log('promises');
			console.log(promises);
			Promise.all(promises)
				.then((responses) => {
					res.status(200).send(responses);
				})
				.catch((err) => {
					res.status(500).send({
						message: "Error, no se pudo realizar la búsqueda de mensajes"
					})
				});
		})
		.catch((err) => {
			console.log('err');
			console.log(err);
			res.status(500).send({
				message: "Error, no se pudo realizar la búsqueda de mensajes"
			})
		});
}


module.exports = {
	countSmsBySchool,
	listSmsStored,
	listSmsLastMoth,
	listSmsLastWeek,
	logSmsStored,
	smsMonthWeekTotal,
	recieveStatusSms,
	smsDetailsBySchool,
	listSmsWeekAndMonthNotConfirm,
	listSmsShipping
}