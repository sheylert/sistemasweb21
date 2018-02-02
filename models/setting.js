'use strict'

module.exports = (sequelize, DataTypes) => {

  const Setting = sequelize.define("setting", {

  _id: { 
          type: DataTypes.INTEGER,
        },

  dateLimitConfig: { 
          type: DataTypes.DATE    
        },
  logo: { 
          type: DataTypes.STRING
          //  data: Buffer, contentType: String     
        },
        
  period: { 
          type: DataTypes.STRING    
        }, 

   yaerCurrent: { 
          type: DataTypes.INTEGER,

          //numberico ojooooo
        },
   
   dateInit_1: { 
          type: DataTypes.DATE    
        },

   dateEnd_1: { 
          type: DataTypes.DATE    
        },

    dateInit_2: { 
          type: DataTypes.DATE    
        },

    dateEnd_2: { 
          type: DataTypes.DATE    
        },

    codeNumber: { 
          type: DataTypes.INTEGER,
          // numeric ojooooooo
          default: 56,
        },

    school: { 
          type: DataTypes.INTEGER,
        },

  });
    return Setting;

};

/*
var moongose = require('mongoose');
var Schema = moongose.Schema;

var SettingSchema = Schema({
    _id: String,
    dateLimitConfig: Date,
    logo: { data: Buffer, contentType: String },
    period: String,
    yaerCurrent: Number,
    dateInit_1: Date,
    dateEnd_1: Date,
    dateInit_2: Date,
    dateEnd_2: Date,
   codeNumber: {type: Number, default: 56},
   school: [{ type: Schema.ObjectId, ref: 'Client' }],
});

module.exports = moongose.model('Setting', SettingSchema);

*/