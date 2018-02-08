'use strict'

module.exports = (sequelize, DataTypes) => {

	const ListSmsWorker = sequelize.define("list_sms_worker", {
    user_id: {
    	type: DataTypes.INTEGER
    },
    school_id: {
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
      type: DataTypes.TEXT('LONG') 
    }
 })





  ListSmsWorker.associate = model => {
    
  	ListSmsWorker.belongsTo(model.User, {
  		foreignKey: 'user_id',
  		as : 'usuarios'
  	})

    ListSmsWorker.belongsTo(model.Client, {
        foreignKey: 'school_id',
        as : 'clientes'
      })

  }




  return ListSmsWorker

}