'use strict'

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define("user", {

  name: { 
          type: DataTypes.STRING    
        },
  address: { 
          type: DataTypes.STRING    
        },
   phone: { 
          type: DataTypes.INTEGER    
        },  
 email: { 
          type: DataTypes.STRING,
          unique: true,    
        }, 
 password: { 
          type: DataTypes.STRING    
        },
type: { 
          type: DataTypes.INTEGER    
        }, 

state: { 
          type: DataTypes.BOOLEAN    
        },
 validatePass: { 
          type: DataTypes.BOOLEAN    
        },       
 services: { 
          type: DataTypes.BOOLEAN    
        }, 
        /*++++++++++++++++++++cambiar de nuevo a referencias++++++++++++++++++++++++*/
        profile: { 
          type: DataTypes.INTEGER    
        }, 
        school: { 
          type: DataTypes.INTEGER    
        }, 
        responId: { 
          type: DataTypes.INTEGER    
        }, 
        /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
  });
    return User;
};

/*
  id: String,
  name: String,
  address: String,
  phone: Number,
  email: {type: String, unique: true},
  password: String,
  type: Number,
  state: Boolean,
  validatePass: Boolean,
  services: Boolean

  ---------------------------------------------------------
  profile: { type: Schema.ObjectId, ref: 'Profile' },
  school: { type: Schema.ObjectId, ref: 'Client' },
  responId : { type: Schema.ObjectId, ref: 'Responsable' },
 
});

module.exports = moongose.model('User', UserSchema);

*/