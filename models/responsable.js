'use strict'

module.exports = (sequelize, DataTypes) => {

  const Responsable = sequelize.define("responsable", {
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
 address: { 
          type: DataTypes.STRING    
        },        
  });


    Responsable.associate = model => {
      Responsable.hasMany(model.Student, {
        foreignKey: 'responsable_id',
        as        : 'estudiantes'
      })
    }
    return Responsable;

};


/*
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResponsableSchema = new Schema({
  name : String,
  lastname : String,
  rut  : String,
  email : String,
  phone : Number,
  address : String,
});

module.exports = mongoose.model('Responsable', ResponsableSchema);
*/