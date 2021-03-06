'use strict'

module.exports = (sequelize, DataTypes) => {

  const Subject = sequelize.define("subject", {
    name: { 
            type: DataTypes.STRING    
          },
    code: { 
            type: DataTypes.STRING    
          },
    color: { 
            type: DataTypes.STRING    
          },
    school_id: {
      type: DataTypes.INTEGER
    }
  });
   
    return Subject;

};