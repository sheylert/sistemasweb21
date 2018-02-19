'use strict'

module.exports = (sequelize, DataTypes) => {

  const Departament = sequelize.define("departament", {
    
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
    return Departament;

};