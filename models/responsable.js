'use strict'

module.exports = (sequelize, DataTypes) => {

  const Responsable = sequelize.define("responsable", {

   _id: { 
          type: DataTypes.INTEGER    
        },  
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
          type: DataTypes.INTEGER    
        }, 
 address: { 
          type: DataTypes.STRING    
        },        
  });
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