'use strict'

module.exports = (sequelize, DataTypes) => {

  const SettingWorker = sequelize.define("setting_worker", {

  nameLogo: { 
          type: DataTypes.STRING
          //  data: Buffer, contentType: String     
        },

    codeNumber: { 
          type: DataTypes.INTEGER,
          // numeric ojooooooo
          default: 56,
        },
    image: {
      type: DataTypes.BLOB
    },
    school: { 
          type: DataTypes.INTEGER,
        },

  });
    return SettingWorker;

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