'use strict'


module.exports = (sequelize, DataTypes) => {
	
	const Retire = sequelize.define("retire", {
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

	Retire.associate = model => {
		Retire.belongsTo(model.Client,{
			foreignKey: 'school_id',
			as        : 'cliente'
		})

		Retire.belongsTo(model.Course,{
			foreignKey: 'course_id',
			as        : 'curso'
		})

		Retire.belongsTo(model.Student,{
			foreignKey: 'student_id',
			as        : 'estudiante'
		})
	}

	return Retire
}
