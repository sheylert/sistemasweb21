'use strict'

module.exports = (sequelize, DataTypes) => {

  const Worker = sequelize.define("worker", {
    
  name: { 
          type: DataTypes.STRING    
        },

  lastname: { 
          type: DataTypes.STRING    
        },

  rut: { 
          type: DataTypes.STRING    
        },
  email: { 
          type: DataTypes.STRING    
  },

   phone: { 
          type: DataTypes.STRING    
        },  

birth_date: { 
          type: DataTypes.DATE    
        },
state: { 
          type: DataTypes.BOOLEAN,
        },

lastSms: { 
          type: DataTypes.STRING,
          // revisar colocar el null default: NULL,
        },       
 
school: { 
          type: DataTypes.INTEGER,
        },
checked:{
          type: DataTypes.BOOLEAN,
        }
  });
  
    return Worker;

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