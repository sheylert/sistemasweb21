module.exports = (sequelize, DataTypes) => {

	const Event = sequelize.define("event", {
		course_id : {
			type: DataTypes.INTEGER
		},
		school_id: {
			type: DataTypes.INTEGER	
		},
		date : {
			type: DataTypes.DATE		
		},
		detail: {
			type: DataTypes.TEXT			
		}
	})

	Event.associate = model => {
		
		Event.belongsTo(model.Client,{
			foreignKey: 'school_id',
			as        : 'cliente'
		})

		Event.belongsTo(model.Course,{
			foreignKey: 'course_id',
			as        : 'curso'
		})
	}

	return Event
}