'use strict'


module.exports = (sequelize, DataTypes) => {

  const Course = sequelize.define("course", {
  character: { 
          type: DataTypes.STRING    
        },
  dpyp: { 
          type: DataTypes.STRING    
        },
  deval: { 
          type: DataTypes.STRING    
        },       
code_grade: { 
          type: DataTypes.INTEGER    
        }, 
teacher_chief: { 
          type: DataTypes.INTEGER    
        },
code_teaching: { 
          type: DataTypes.INTEGER    
        },         
code_subject: { 
          type: DataTypes.ARRAY(DataTypes.INTEGER)    
        },  
code_student: { 
          type: DataTypes.ARRAY(DataTypes.INTEGER)    
        }, 
code_school: { 
          type: DataTypes.INTEGER    
        },        
  });

    Course.associate = model =>{
      
      Course.belongsTo(model.Client,{
        foreignKey: 'code_school',
        as : 'clientes'
      })

      Course.belongsTo(model.CourseCode,{
        foreignKey: 'code_grade',
        as : 'code_grade_course'
      })

      Course.belongsTo(model.Teacher,{
        foreignKey: 'teacher_chief',
        as        : 'profesores'
      })
    }


    return Course;

};
/*
var moongose = require('mongoose');
var Schema = moongose.Schema;

var CourseSchema = Schema({
    id: String,
    character: String,
    dpyp: String,
    deval: String,
    code_grade: { type: Schema.ObjectId, ref: 'CourseCode' },
    teacher_chief: { type: Schema.ObjectId, ref: 'Teacher' },
    code_teaching: { type: Schema.ObjectId, ref: 'Teaching' },
    code_subject: [],
    code_student: [{ type: Schema.ObjectId, ref: 'Student' }],
    code_school: [{ type: Schema.ObjectId, ref: 'Client' }],
});

module.exports = moongose.model('Course', CourseSchema);

*/