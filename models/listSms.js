'use strict'

module.exports = (sequelize, DataTypes) => {

	const ListSms = sequelize.define("list_sms", {
    user_id: {
    	type: DataTypes.INTEGER
    },
    school_id: {
    	type: DataTypes.INTEGER	
    },
    course_id: {
    	type: DataTypes.INTEGER	
    },
    type: {
    	type: DataTypes.BOOLEAN		
    },
    status: {
    	type: DataTypes.STRING	
    },
    quantitySuccess:{
    	type: DataTypes.INTEGER		
    },
    quantityError: {
    	type: DataTypes.INTEGER		
    },
    list_sms:{
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    },
    requestRoute:{
      type: DataTypes.STRING
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
  }


  return ListSms

}