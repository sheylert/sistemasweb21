'use strict'

module.exports = (sequelize, DataTypes) => {

  const Teacher = sequelize.define("teacher", {

  _id: { 
          type: DataTypes.INTEGER,
        },
  name: { 
          type: DataTypes.STRING    
        },
  secondname: { 
          type: DataTypes.STRING    
        },         
  surname: { 
          type: DataTypes.STRING    
        },

   email: { 
          type: DataTypes.STRING    
        },

    phone: { 
          type: DataTypes.STRING    
        }, 
     profession: { 
          type: DataTypes.STRING    
        }, 
     
       run: { 
          type: DataTypes.STRING    
        }, 

         state: { 
          type: DataTypes.BOOLEAN    
        },

         gender: { 
          type: DataTypes.STRING    
        }, 
         school: { 
          type: DataTypes.INTEGER,
        },
  });
    return Teacher;

};

/*

var moongose = require('mongoose');
var Schema = moongose.Schema;

var TeacherSchema = Schema({
  id: String,
  name: String,
  secondname: String,
  surname: String,
  email: String,
  phone: String,
  profession: String,
  run: String,
  state: Boolean,
  gender: String,
  school: {type: Schema.ObjectId, ref: "Client"}
});

module.exports = moongose.model('Teacher', TeacherSchema);

*/