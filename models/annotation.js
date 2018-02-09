'use strict'

module.exports = (sequelize, DataTypes) => {

  const Annotation = sequelize.define("annotation", {
	  	student_id: { 
	          type: DataTypes.INTEGER    
	        },
	  	subject_id: { 
	          type: DataTypes.INTEGER    
	        },         
	   	teacher_id: { 
	          type: DataTypes.INTEGER    
	        },         
	    school_id: { 
	          type: DataTypes.INTEGER    
	        },         
	    course_id: { 
	          type: DataTypes.INTEGER    
	        },         
	    date: { 
	          type: DataTypes.DATE    
	        },         
	    type: { 
	          type: DataTypes.ENUM('Positiva','Negativa','Formación')    
	        },
	    detail: { 
	          type: DataTypes.TEXT('medium')    
	        }         
  });

  	Annotation.associate = model => {

  		Annotation.belongsTo(model.Student, {
  			foreignKey: 'student_id',
  			as        : 'estudiantes' 
  		})

  		Annotation.belongsTo(model.Subject, {
  			foreignKey: 'subject_id',
  			as        : 'asignaturas' 
  		})

  		Annotation.belongsTo(model.Teacher, {
  			foreignKey: 'teacher_id',
  			as        : 'profesores' 
  		})

		Annotation.belongsTo(model.Client, {
  			foreignKey: 'school_id',
  			as        : 'cliente' 
  		})  		

  		Annotation.belongsTo(model.Course, {
  			foreignKey: 'course_id',
  			as        : 'curso' 
  		})
  	}
    return Annotation;

};	

	