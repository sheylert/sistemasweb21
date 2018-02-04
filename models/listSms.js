'use strict'

module.exports = (sequelize, DataTypes) => {

	const ListSms = sequelize.define("listSms", {
  	_id: { 
          type: DataTypes.INTEGER,
        },
    user_id: {
    	type: DataTypes.INTEGER
    },
    school_id: {
    	type: DataTypes.INTEGER	
    },
    course_id: {
    	type: DataTypes.INTEGER	
    },
    sms_id: {
      type: DataTypes.INTEGER 
    },
    student_id: {
    	type: DataTypes.INTEGER	
    },
    phone: {
    	type: DataTypes.STRING	
    },
    template_id: {
    	type: DataTypes.INTEGER	
    },
    status: {
    	type: DataTypes.ENUM('SUCCESS','WARNING','DANGER','DEFAULT'),
    	defaultValue: 'DEFAULT'		
    },
    smsBody:{
    	type: DataTypes.STRING		
    },
    type: {
    	type: DataTypes.BOOLEAN		
    },
    status: {
    	type: DataTypes.STRING	
    },
    created_at: {
    	type: DataTypes.DATE
    },
    quantitySuccess:{
    	type: DataTypes.INTEGER		
    },
    quantityError: {
    	type: DataTypes.INTEGER		
    }
 })

  ListSms.associate = model => {
    
  	ListSms.belongsTo(model.User, {
  		foreignKey: 'user_id',
  		as : 'usuarios'
  	})

  	ListSms.belongsTo(model.Client, {
  		foreignKey: 'school_id',
  		as : 'clientes'
  	})

  	ListSms.belongsTo(model.Course, {
  		foreignKey: 'course_id',
  		as : 'curso'
  	})

    ListSms.belongsTo(model.Student, {
  		foreignKey: 'student_id',
  		as : 'estudiante'
  	})

  	ListSms.belongsTo(model.Template, {
  		foreignKey: 'template_id',
  		as : 'template'
  	})
  }

  return ListSms

}