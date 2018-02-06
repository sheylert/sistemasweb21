'use strict'

module.exports = (sequelize, DataTypes) => {

  const Student = sequelize.define("student", {
  name: { 
          type: DataTypes.STRING    
        },

  lastname: { 
          type: DataTypes.STRING    
        }, 
  rut: { 
          type: DataTypes.STRING    
        },
code_grade: { 
          type: DataTypes.STRING    
        },
code_teaching: { 
          type: DataTypes.STRING    
        },
character: { 
          type: DataTypes.STRING    
        },

date: { 
          type: DataTypes.DATE  
          // default: Date.now ojoooooo  
        },

birth_date: { 
          type: DataTypes.DATE    
        },

age: { 
          type: DataTypes.INTEGER,
        },
state: { 
          type: DataTypes.BOOLEAN,
        },

lastSms: { 
          type: DataTypes.STRING,
          // revisar colocar el null default: NULL,
        },

course: { 
          type: DataTypes.INTEGER,
        },        

school: { 
          type: DataTypes.INTEGER,
        },

responsable: { 
          type: DataTypes.INTEGER,
        },


  });

    Student.associate = model => {

      Student.belongsTo(model.Responsable,{
        foreignKey: 'responsable',
        as : 'responsableStudent'
      })
  }

    return Student;

};


/*
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StudentSchema = new Schema({
  name: String,
  lastname: String,
  rut: String,
  code_grade: String,
  code_teaching: String,
  character: String,
  date: {type : Date, default: Date.now},
  birth_date: Date,
  age: Number,
  state: Boolean,
  lastSms: {type: String, default: null},


  course: { type: Schema.ObjectId, ref: 'Course' },
  school: { type: Schema.ObjectId, ref: 'Client' },
  responsable: { type: Schema.ObjectId, ref: 'Responsable' }
});

module.exports = mongoose.model('Student', StudentSchema);

*/