'use strict'

module.exports = (sequelize, DataTypes) => {

  const Subject = sequelize.define("subject", {
    name: { 
            type: DataTypes.STRING    
          },
    code: { 
            type: DataTypes.STRING    
          },         
    notes: {
      type: DataTypes.INTEGER
    },
    school_id: {
      type: DataTypes.INTEGER
    }
  });
  
    return Subject;

};