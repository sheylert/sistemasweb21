'use strict'

module.exports = (sequelize, DataTypes) => {
	const Notes = sequelize.define("notes", {
		school_id: {
			type: DataTypes.INTEGER
		},
		student_id: {
			type: DataTypes.INTEGER
		},
		subject_id: {
			type: DataTypes.INTEGER	
		},
		course_id: {
			type: DataTypes.INTEGER		
		},
		note_1_1: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_1_2: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_1_3: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_1_4: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_1_5: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_1_6: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_1_7: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_1_8: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_1_9: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_1_10: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_1_11: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_1_12: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_2_1: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_2_2: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_2_3: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_2_4: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_2_5: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_2_6: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_2_7: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_2_8: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_2_9: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_2_10: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_2_11: {
			type: DataTypes.FLOAT(1,1)		
		},
		note_2_12: {
			type: DataTypes.FLOAT(1,1)		
		},
		prom_1: {
			type: DataTypes.FLOAT(1,1)			
		}
		,
		prom_2: {
			type: DataTypes.FLOAT(1,1)			
		},
		eximido : {
			type: DataTypes.BOOLEAN
		}
	})

	Notes.associate = model => {

	  	Notes.belongsTo(model.Client, {
	  		foreignKey: 'school_id',
	  		as : 'clientes'
	  	})

	  	Notes.belongsTo(model.Student, {
	  		foreignKey: 'student_id',
	  		as : 'estudiantes'
	  	})

	  	Notes.belongsTo(model.Course, {
	  		foreignKey: 'course_id',
	  		as : 'curso'
	  	})

	  	Notes.belongsTo(model.Subject, {
	  		foreignKey: 'subject_id',
	  		as : 'asignatura'
	  	})
	}

	return Notes
}