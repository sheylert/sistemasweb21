'use strict'

module.exports = (sequelize, DataTypes) => {

  const Setting = sequelize.define("setting", {


  dateLimitConfig: { 
          type: DataTypes.DATE    
        },

  nameLogo: { 
          type: DataTypes.STRING
          //  data: Buffer, contentType: String     
        },
                
  periodo: { 
          type: DataTypes.STRING    
        },  
 
   yearCurrent: { 
          type: DataTypes.INTEGER,

          //numberico ojooooo
        },
   
   dateInit1: { 
          type: DataTypes.DATE    
        },

   dateEnd1: { 
          type: DataTypes.DATE    
        },

    dateInit2: { 
          type: DataTypes.DATE    
        },

    dateEnd2: { 
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
    logo: { type: Buffer, contentType: String },
    nameLogo: String,


    periodo: String,
    yearCurrent: Number,
    dateInit1: Date,
    dateEnd1: Date,
    dateInit2: Date,
    dateEnd2: Date,
   codeNumber: {type: Number, default: 56},
   school: [{ type: Schema.ObjectId, ref: 'Client' }],
});

module.exports = moongose.model('Setting', SettingSchema);
*/