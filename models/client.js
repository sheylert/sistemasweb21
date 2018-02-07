'use strict'


module.exports = (sequelize, DataTypes) => {

  const Client = sequelize.define("client", {
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
          type: DataTypes.STRING    
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
profile_id: { 
          type: DataTypes.INTEGER
        },

admin: { 
          type: DataTypes.INTEGER    
        }, 

code_setting: { 
          type: DataTypes.INTEGER    
        },  
  });

Client.associate = model => {
    Client.hasMany(model.User, {
        foreignKey: 'school',
        as: 'users'
    })
  }

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