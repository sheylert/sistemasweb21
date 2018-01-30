//var Student = require('../models/student');
//var Sms = require('../models/sms');
//var ListSms = require('../models/listSms')
//const TotalSms = require('../models/totalSms')

function storedSmsMasive(req,res,arreglosmsMasive)
{
	let word = arreglosmsMasive[0].typeSms === true ? 'el mensaje' : ' la notificación',
		arrayId     = [],
		successQuantity = 0,
		errorQuantity = 0

	arreglosmsMasive.forEach((ele, index) => {
		
		if(ele.labsmobileResponse.statusResponseApi == 200)
		{
			successQuantity++
		}
		else
		{
			errorQuantity++
		}

		let lastSend = lastSentDeterminated(ele.typeSms,ele.labsmobileResponse.statusResponseApi)

		let sms = {
          studentId: ele.estudiante._id,
          templateId: ele.idTemplate,
          type: ele.typeSms,
          school: req.user.sub,
          course: req.body.course ? req.body.course : null,
          status : lastSend,
          smsBody : ele.labsmobileResponse.statusMessageApi
        }

        if(ele.typeSms)
        {
			Student.findByIdAndUpdate( ele.estudiante._id, { lastSms : lastSend}, { new: true }, (err, studentUpdated) => {
				if(err) console.log(err)
			})        	
        }
        else
        {
        	Student.findByIdAndUpdate( ele.estudiante._id, { lastSms : lastSend}, { new: true }, (err, studentUpdated) => {
				if(err) console.log(err)
			})        		
        }

        let smsSave = new Sms(sms)

       	smsSave.save((err, smsStored) => {
	        if (err) {
	           
	           aviso += `, Error al guardar ${word} en la bd del estudiante ${ele.name} ${ele.lastname}`

	             if(index + 1 == ele.totalEstudiantes)
	             {
	              res.status(400).send({ message: aviso })
	             }
	         }
	         else 
	         {
	           if (!smsStored) 
	           {
	             aviso+= `, No se ha registrado ${word} en la bd del estudiante ${ele.name} ${ele.lastname}`
	             
	             if(index + 1 == ele.totalEstudiantes)
	             {
	              res.status(400).send({ message: aviso })
	             }

	           }
	           else
	           {

	           	 arrayId.push(smsStored._id)

	             if(index + 1 == ele.totalEstudiantes)
	             {
	             	setTimeout(() => {

	             		if(errorQuantity >= 2)
		             	{
		             		lastSend = "DANGER"
		             	}
		             	else if(errorQuantity == 1)
		             	{
		             		lastSend = "WARNING"
		             	}
		             	else if(errorQuantity < 1)
		             	{
		             		lastSend = "SUCCESS"
		             	}

		             	let aviso = `Se enviaron ${successQuantity} mensajes y no se enviaron ${errorQuantity} mensajes`

		                let listSms = {
		                  idSender: req.user.userId,
		                  school  : req.user.sub,
		                  course: req.body.course ? req.body.course : null,
		                  listSms : arrayId,
		                  type: ele.typeSms,
		                  status: lastSend,
		                  quantitySuccess: successQuantity,
		                  quantityError: errorQuantity
		                }

		       			let listSmsSave = new ListSms(listSms)
		       			
		       			listSmsSave.save((err,list) => {
		       				if(err) res.status(500).send( {message: "No se ha podido guardar la lista", error: err})

		       				updateLastRegistersOfSms(req)

		       				res.status(200).send({ message: aviso })
		       			})
		       			
	             	}, 500)
	             }
	           }
	        } 
	    }) // fin guardar sms 
	})
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

        if(typeSms)
        {
			Student.findByIdAndUpdate( ele._id, { lastSms : lastSend}, { new: true }, (err, studentUpdated) => {
				if(err) console.log(err)
			})        	
        }
        else
        {
        	Student.findByIdAndUpdate( ele._id, { lastSms : lastSend}, { new: true }, (err, studentUpdated) => {
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

function updateLastRegistersOfSms(req) 
{
	/** Función para buscar el total de sms por el últimos mes y la última semana **/

	// Para sacar el rango de la última semana

	let date = new Date()
	let date1 = new Date()
	date1.setHours(date1.getHours() - date1.getHours() - 4)

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
	date2.setHours(date2.getHours())
	date2.setMonth(date2.getMonth() + 1)
	date2.setDate(0)
	let date3 = new Date()
	date3.setHours(date3.getHours())
	date3.setDate(1)

	//console.log(date2)
	//console.log(date3)

	const lastDateMoth =  date2
	const firstDateMoth = date3
	// ===================================

	let range = {
		$gte: firstDate,
		$lt:  lastDate
	}

	let rangeMonth = {
		$gte: firstDateMoth,
		$lt:  lastDateMoth
	},
	totalData = {}

	Sms.find( { createt_at: range, school: req.user.sub, status: "SUCCESS" } ).exec((err,result) => {
		if(err) res.status(400).send( { message: "error al buscar la cantidad de mensajes de la última semana" } )

		totalData.totalSmsWeek = result.length

		Sms.find( { createt_at: rangeMonth, school: req.user.sub, status: "SUCCESS" } ).exec((err,resultMoth) => {
			
			if(err) res.status(400).send({ message: 'error al buscar la cantidad de mensajes del último mes'})

			totalData.totalSmsMonth = resultMoth.length

			Sms.find( {school: req.user.sub, status: "SUCCESS"} ).exec((err,resultGlobal) => {
				totalData.totalHistory = resultGlobal.length

				TotalSms.findOneAndUpdate( {school: req.user.sub}, totalData, {new: true}, (err,result)=> {
					if(err) console.log(err)
				})
			})

		})
	})
}

module.exports = {
	storedSmsMasive,
	storedSmsSingle
}