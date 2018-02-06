'use strict'

module.exports = (sequelize, DataTypes) => {

	 const TotalSms = sequelize.define("total_sms", {
	 	school_id: {
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

	 return TotalSms
}