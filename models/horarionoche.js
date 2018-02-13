'use strict'

module.exports = (sequelize, DataTypes) => {

  const Horarionoche = sequelize.define("horarionoche", {

    school: {
      type: DataTypes.INTEGER
    },

    id_curso: { 
            type: DataTypes.INTEGER    
          },
    id_dia: { 
            type: DataTypes.INTEGER    
        },     

    I15: { 
            type: DataTypes.TIME    
        },
    B15: {
      type: DataTypes.INTEGER
    },

    I16: { 
     type: DataTypes.TIME    
    },

    B16: {
      type: DataTypes.INTEGER
    },

    I17: { 
            type: DataTypes.TIME    
    },

    B17: {
      type: DataTypes.INTEGER
    },

    I18: { 
            type: DataTypes.TIME    
    },

    B18: {
      type: DataTypes.INTEGER
    },

    I19: { 
        type: DataTypes.TIME    
    },

    B19: {
      type: DataTypes.INTEGER
    },

      I20: { 
            type: DataTypes.TIME    
      },

    B20: {
      type: DataTypes.INTEGER
    },

    I21: { 
      type: DataTypes.TIME    
        },

    B21: {
      type: DataTypes.INTEGER
    }

  });

    return Horarionoche;

};