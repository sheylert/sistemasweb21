'use strict'


module.exports = (sequelize, DataTypes) => {

  const CourseCode = sequelize.define("coursecode", {
  name: { 
          type: DataTypes.STRING    
        },
  slug: { 
          type: DataTypes.STRING    
        },         
  });
    return CourseCode;

};


/*

var moongose = require('mongoose');
var Schema = moongose.Schema;

var CourseCodeSchema = Schema({
  id: String,
  name: String,
  slug: String
});

module.exports = moongose.model('CourseCode', CourseCodeSchema);

*/