module.exports = (sequelize, DataTypes) => {

	const Sms = sequelize.define("sms", {
	
	    course_id:{
	    	type: DataTypes.INTEGER,
		},
		student_id: {
			type: DataTypes.INTEGER,
		},
		template_id: {
			type: DataTypes.INTEGER,
		},
		school_id: {
			type: DataTypes.INTEGER,
		},
		user_id :{
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
		},
		student_or_worker: {
			type: DataTypes.STRING,	
		}
	})

	Sms.associate = model => {
    
	  	Sms.belongsTo(model.User, {
	  		foreignKey: 'user_id',
	  		as : 'usuarios'
	  	})

	  	Sms.belongsTo(model.Client, {
	  		foreignKey: 'school_id',
	  		as : 'clientes'
	  	})

	  	Sms.belongsTo(model.Course, {
	  		foreignKey: 'course_id',
	  		as : 'curso'
	  	})

	    Sms.belongsTo(model.Student, {
	  		foreignKey: 'student_id',
	  		as : 'estudiante'
	  	})

	  	Sms.belongsTo(model.Template, {
	  		foreignKey: 'template_id',
	  		as : 'template'
	  	})
  	}

  	return Sms
}