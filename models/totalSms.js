'use strict'

module.exports = (sequelize, DataTypes) => {

	 const TotalSms = sequelize.define("totalSms", {
	 	school: {
      		type: DataTypes.INTEGER 
    	},
    	totalSmsWeek: {
    		type: DataTypes.INTEGER
    	},
    	totalSmsMonth: {
    		type: DataTypes.INTEGER	
    	},
    	totalHistory: {
    		type:DataTypes.INTEGER
    	}
	 })

	 TotalSms.associate = model => {

	 	TotalSms.hasOne(model.Client,{

	 		foreignKey: 'school',
	 		as        : 'cliente'
	 	})
	 }

	 return TotalSms
}