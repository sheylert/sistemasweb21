'use strict'


module.exports = (sequelize, DataTypes) => {

  const Client = sequelize.define("client", {

  _id: {  
          type: DataTypes.INTEGER,
        },
  rbd: { 
          type: DataTypes.STRING    
        },
  name: { 
          type: DataTypes.STRING    
        }, 
 address: { 
          type: DataTypes.STRING    
        },
  email: { 
          type: DataTypes.STRING    
        },        
phone: { 
          type: DataTypes.INTEGER    
        }, 
 ree: { 
          type: DataTypes.STRING    
        },        
membership: { 
          type: DataTypes.STRING    
        }, 
services: { 
          type: DataTypes.BOOLEAN    
        }, 
type: { 
          type: DataTypes.ENUM( "1", "2", "3") 
        },

admin: { 
          type: DataTypes.INTEGER    
        }, 

code_setting: { 
          type: DataTypes.INTEGER    
        },  
  }); 
    return Client; 
};





/*
var moongose = require('mongoose');
var Schema = moongose.Schema;

var ClientSchema = Schema({
    rbd: String,
    name: String,
    address: String,
    email: String,
    phone: Number,
    ree: String,
    membership: String,
    services: Boolean,

    -----------------------------------------------------
    
    
    
    admin: Object,
    code_setting: { type: Schema.ObjectId, ref: 'Setting' },
    code_school: { type: Schema.ObjectId, ref: 'School' },

});

module.exports = moongose.model('Client', ClientSchema);

*/