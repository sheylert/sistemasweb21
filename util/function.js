//var Student = require('../models/student');
//var Sms = require('../models/sms');
//var ListSms = require('../models/listSms')
//const TotalSms = require('../models/totalSms')

var models = require('../models');

function storedSmsMasive(req,res,estudiantes,idTemplate,typeSms,labsmobileResponse,total_estudiantes,aviso,numbers)
{
	let word = typeSms === true ? 'el mensaje' : ' la notificación',
		arrayId     = [],
		lastSend = lastSentDeterminated(typeSms,labsmobileResponse.statusResponseApi)

	labsmobileResponse = determinatedSuccess(typeSms,labsmobileResponse)
	estudiantes.forEach((ele, index) => {
		
		let sms = {
          student_id: profileInSession(req) ? ele._id : 0,
          worker_id : profileInSession(req) ? 0 : ele._id,
          template_id: idTemplate,
          type: typeSms,
          school: req.user.sub,
          smsBody : labsmobileResponse.statusMessageApi,
          phone: ele.responsable ? ele.responsable.phone : ele.phone,
          user_id: req.user.userId,
          school_id  : req.user.sub,
          course_id: req.body.course ? req.body.course : 1,
          type: typeSms,
          status: lastSend,
          quantitySuccess: labsmobileResponse.quantitySuccess,
          quantityError: labsmobileResponse.quantityError,
          created_at : new Date(),
          worker_or_student: profileInSession(req) ? 'Estudiante' : 'Trabajador'
        }

        if(!typeSms)
        {
        	if(req.user.profile.slug.indexOf('ENTERPRISE') !== -1)
        	{
        		models.Worker.update( {lastSms : 'SUCCESS'}, 
                {where: { id: ele._id } }).then( function(updateworkers) {

                }).catch( err => console.log('error el modificar la notifiacion'))
        	}
        	else
        	{
        		Student.findByIdAndUpdate( ele._id, { lastSms : "SUCCESS"}, { new: true }, (err, studentUpdated) => {
					if(err) console.log(err)
				})        	
        	}
				
        }
        else
        {
        	models.ListSms.create(sms).then( function(insertarworkers) { 

        		if(index + 1 == estudiantes.length)
        		{
		   			updateLastRegistersOfSms(lastSend,req)
		   			res.json({ message : 'Mensajeria Enviada con éxito' })
        		}

		   	}).catch(err => console.log(err))
        }

	}) // fin guardar sms 
}

function storedSmsSingle(req,res,estudiante,idTemplate,typeSms,labsmobileResponse,aviso)
{
	let word = typeSms === true ? 'el mensaje' : ' la notificación',
		arrayId     = [],
		lastSend = lastSentDeterminated(labsmobileResponse.statusResponseApi)

	labsmobileResponse = determinatedSuccess(typeSms,labsmobileResponse)
		
		let sms = {
          studentId: estudiante._id,
          templateId: idTemplate,
          type: typeSms,
          school: req.user.sub,
          course: req.body.course ? req.body.course : null,
          status : lastSend,
          smsBody : labsmobileResponse.statusMessageApi
        }

        if(!typeSms)
        {
			Student.findByIdAndUpdate( ele._id, { lastSms : "SUCCESS"}, { new: true }, (err, studentUpdated) => {
				if(err) console.log(err)
			})        	
        }

        let smsSave = new Sms(sms)

       	smsSave.save((err, smsStored) => {
	        if (err) 
	        {   
	           aviso += `, Error al guardar ${word} en la bd del estudiante ${estudiante.name} ${estudiante.lastname}`
	           res.status(400).send({ message: aviso })
	         }
	         else 
	         {
	           if (!smsStored) 
	           {
	             aviso+= `, No se ha registrado ${word} en la bd del estudiante ${estudiante.name} ${estudiante.lastname}`
	             res.status(400).send({ message: aviso })
	           }
	           else
	           {

	           	 	arrayId.push(smsStored._id)

	           	 	setTimeout(() => {
	           	 		let listSms = {
		                  idSender: req.user.userId,
		                  school  : req.user.sub,
		                  course: req.body.course ? req.body.course : null,
		                  listSms : arrayId,
		                  quantitySuccess: typeSms === true ? labsmobileResponse.quantitySuccess : 1,
		                  quantityError : typeSms === true ?  labsmobileResponse.quantityError   : 0,
		                  type: typeSms,
		                  status: lastSend
		                }

		       			let listSmsSave = new ListSms(listSms)
		       			
		       			listSmsSave.save((err,list) => {
		       				if(err) res.status(500).send( {message: "No se ha podido guardar la lista", error: err})

		       				updateLastRegistersOfSms(lastSend,req)
		       			
		       				res.status(200).send({ message: aviso })
		       			})
	           	 	}, 500)
		                
	           }
	        } 
	    }) // fin guardar sms 	
}

function lastSentDeterminated(typeSms,response)
{
	if(typeSms)
	{
		if(parseInt(response) == 200)
		{
			return 'SUCCESS'
		}
		else if(parseInt(response) >= 400 && parseInt(response) < 500)
		{
			return 'WARNING'
		}
		else
		{
			return 'DANGER'	
		}
	}
	else
	{
		return 'SUCCESS'
	}
		
}

function determinatedSuccess(typeSms,labsmobileResponse)
{
	if(typeSms)
	{
		if(parseInt(labsmobileResponse.statusResponseApi) == 200)
		{
			labsmobileResponse.quantityError = 0
			return labsmobileResponse
		}
		else
		{
			labsmobileResponse.quantitySuccess = 0
			return labsmobileResponse
		}

	}
	else
	{
		labsmobileResponse.quantityError = 0
		return labsmobileResponse
	}
}

function updateLastRegistersOfSms(status,req) 
{
	if(status === "SUCCESS")
	{
		/** Función para buscar el total de sms por el últimos mes y la última semana **/

		// Para sacar el rango de la última semana

		let date = new Date()
		let date1 = new Date()
		date1.setHours(0 - 4, 0,0,0)

		switch (date.getDay()) 
		{
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
		

		const lastDate =  date
		const firstDate = date1

		/*console.log(date)
		console.log(date1)*/

		// Para sacar el rango del último mes
		let date2 = new Date()
		date2.setMonth(date2.getMonth() + 1)
		date2.setDate(0)
		let date3 = new Date()
		date3.setDate(1)

		//console.log(date2)
		//console.log(date3)

		const lastDateMoth =  date2
		const firstDateMoth = date3
		// ===================================

		let range = {
			[models.Op.gte]: firstDate,
			[models.Op.lte]:  lastDate
		}

		let rangeMonth = {
			[models.Op.gte]: firstDateMoth,
			[models.Op.lte]:  lastDateMoth
		},
		totalData = {}

		console.log(range)
		console.log(rangeMonth)

		models.ListSms.findAll( { where : { created_at: range, school: req.user.sub } }).then(result => {

			totalData.totalSmsWeek = result.length

			models.ListSms.findAll({ where : { created_at: rangeMonth, school_id: req.user.sub } }).then(resultMoth => {

				totalData.totalSmsMonth = resultMoth.length

				models.ListSms.findAll({ where : {school_id: req.user.sub} }).exec((err,resultGlobal) => {
					totalData.totalHistory = resultGlobal.length

					models.TotalSms.update( totalData, { where : {school: req.user.sub} }, result => {
						
					}).catch(err => console.log(err))
				})

			}).catch( err => console.log(err) )
		}).catch(err =>  console.log(err) )
	}
}


function ejecutar_arreglo(profile)
{
		 for (var key in profile) {
                       if(key == "attributes"){
                               var arreglo={};
                               for (var key2 in profile[key]) {    
                                    var variable = "profile."+profile[key][key2];
                                    arreglo[profile[key][key2]]= eval(variable);    
                               }    
                       }
                    } 
         return arreglo;           
}

function profileInSession(req)
{
	var validate = false
	
	validate = req.user.profile.slug.indexOf('ENTERPRISE') !== -1 ? validate : true

	return validate
}

module.exports = {
	storedSmsMasive,
	storedSmsSingle,
	ejecutar_arreglo,
	updateLastRegistersOfSms
}