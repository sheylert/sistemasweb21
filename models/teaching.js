'use strict'


module.exports = (sequelize, DataTypes) => {

  const Teaching = sequelize.define("teaching", {

  _id: { 
          type: DataTypes.INTEGER,
        },
  name: { 
          type: DataTypes.ENUM('MEDIA', 'PRIMARIA', 'PREESCOLAR') 
        },
  slug: { 
          type: DataTypes.ENUM('MEDIA', 'PRIMARIA', 'PREESCOLAR')   
        },         
  });
    return Teaching;

 
//['MEDIA','PRIMARIA', 'PREESCOLAR']}


};




/*

var moongose = require('mongoose');
var Schema = moongose.Schema;

var TeachingSchema = Schema({
  
  id: String,
  name: {type: String, enum: ['MEDIA','PRIMARIA', 'PREESCOLAR']},
  slug: {type: String, enum: ['MEDIA','PRIMARIA', 'PREESCOLAR']}
});

module.exports = moongose.model('Teaching', TeachingSchema);

*/