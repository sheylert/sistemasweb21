module.exports = (sequelize, DataTypes) => {

	const SmsWorker = sequelize.define("sms_worker", {
	  	_id: { 
	          type: DataTypes.INTEGER,
	        },
		worker_id: {
			type: DataTypes.INTEGER,
		},
		template_id: {
			type: DataTypes.INTEGER,
		},
		school_id: {
			type: DataTypes.INTEGER,
		},
		user_id: {
			type: DataTypes.INTEGER,
		},
		phone: {
			type: DataTypes.STRING,
		},
		envio_id:{
			type: DataTypes.INTEGER,
		},
		status:{
			type: DataTypes.STRING,
		},
		smsBody:{
			type: DataTypes.STRING,
		},
		type: {
			type: DataTypes.BOOLEAN,
		}
	})

	SmsWorker.associate = model => {
    
	  	SmsWorker.belongsTo(model.User, {
	  		foreignKey: 'user_id',
	  		as : 'usuarios'
	  	})

	  	SmsWorker.belongsTo(model.Client, {
	  		foreignKey: 'school_id',
	  		as : 'clientes'
	  	})

	    SmsWorker.belongsTo(model.Worker,{
	      foreignKey: 'worker_id',
	      as: 'trabajadores'
	    })

	  	SmsWorker.belongsTo(model.Template, {
	  		foreignKey: 'template_id',
	  		as : 'template'
	  	})
  	}

  	return SmsWorker
}