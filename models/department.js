'use strict'

module.exports = (sequelize, DataTypes) => {

  const Department = sequelize.define("department", {
    
  name: { 
          type: DataTypes.STRING    
        },

  workers_id: { 
            type: DataTypes.ARRAY(DataTypes.INTEGER)    
          },   

   state: { 
          type: DataTypes.BOOLEAN    
        },

  school_id: { 
          type: DataTypes.INTEGER    
        }  
  });
    return Department;
};