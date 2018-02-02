'use strict'


module.exports = (sequelize, DataTypes) => {

  const Template = sequelize.define("template", {

  _id: { 
          type: DataTypes.INTEGER,
        },
  title: { 
          type: DataTypes.STRING    
        },
  template_text: { 
          type: DataTypes.STRING    
        },  
  school: { 
          type: DataTypes.INTEGER,
        },
  state: { 
          type: DataTypes.BOOLEAN,
        },            
  });
    return Template; 

};


/*
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TemplateSchema = new Schema({
  title: String,
  template_text: String,
  school: { type: Schema.ObjectId, ref: 'Client' },
  state: { type: Number, min: 1, max: 2 }
});
module.exports = mongoose.model('Template', TemplateSchema);
*/