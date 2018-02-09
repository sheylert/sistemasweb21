'use strict'


module.exports = (sequelize, DataTypes) => {
	
	const Delay = sequelize.define("delay", {
		student_id: {
			type: DataTypes.INTEGER
		},
		course_id: {
			type: DataTypes.INTEGER	
		},
		school_id: {
			type: DataTypes.INTEGER	
		},
		date: {
			type: DataTypes.DATE	
		},
		detail: {
			type: DataTypes.TEXT	
		}
	})

	Delay.associate = model => {
		Delay.belongsTo(model.Client,{
			foreignKey: 'school_id',
			as        : 'cliente'
		})

		Delay.belongsTo(model.Course,{
			foreignKey: 'course_id',
			as        : 'curso'
		})

		Delay.belongsTo(model.Student,{
			foreignKey: 'student_id',
			as        : 'estudiante'
		})
	}

	return Delay
}
