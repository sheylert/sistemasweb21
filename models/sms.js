'use strict'

module.exports = (sequelize, DataTypes) => {

  const Sms = sequelize.define("sms", {
  	_id: { 
          type: DataTypes.INTEGER,
        },
    course_id: {
    	type: DataTypes.INTEGER
    },
    student_id: {
    	type: DataTypes.INTEGER	
    },
    template_id: {
    	type: DataTypes.INTEGER	
    },
    user_id: {
      type: DataTypes.INTEGER 
    },
    phone: {
    	type: DataTypes.STRING	
    },
    envio_id: {
    	type: DataTypes.INTEGER	
    },
    status: {
    	type: DataTypes.ENUM('SUCCESS','WARNING','DANGER')		
    },
    smsBody:{
    	type: DataTypes.STRING		
    },
    type: {
    	type: DataTypes.BOOLEAN		
    },
    school: {
      type: DataTypes.INTEGER 
    }
 })

  Sms.associate = model => {
    
  	Sms.belongsTo(model.Student, {
  		foreignKey: 'student_id',
  		as : 'estudiante'
  	})

  	Sms.belongsTo(model.Template, {
  		foreignKey: 'template_id',
  		as : 'template'
  	})

  	Sms.belongsTo(model.Course, {
  		foreignKey: 'course_id',
  		as : 'curso'
  	})

    Sms.belongsTo(model.Client, {
      foreignKey: 'school',
      as : 'cliente'
    })

    Sms.belongsTo(model.User, {
      foreignKey: 'user_id',
      as : 'usuario'
    })
  }

  return Sms
}
