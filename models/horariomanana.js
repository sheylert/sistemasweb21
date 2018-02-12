'use strict'

module.exports = (sequelize, DataTypes) => {

  const Horariomanana = sequelize.define("horariomanana", {

    school: {
      type: DataTypes.INTEGER
    },

    id_curso: { 
            type: DataTypes.INTEGER    
          },
    id_dia: { 
            type: DataTypes.INTEGER    
        },     

    I1: { 
            type: DataTypes.TIME    
        },
    B1: {
      type: DataTypes.INTEGER
    },

    I2: { 
     type: DataTypes.TIME    
    },

    B2: {
      type: DataTypes.INTEGER
    },

    I3: { 
            type: DataTypes.TIME    
    },

    B3: {
      type: DataTypes.INTEGER
    },

    I4: { 
            type: DataTypes.TIME    
    },

    B4: {
      type: DataTypes.INTEGER
    },

    I5: { 
        type: DataTypes.TIME    
    },

    B5: {
      type: DataTypes.INTEGER
    },

      I6: { 
            type: DataTypes.TIME    
      },

    B6: {
      type: DataTypes.INTEGER
    },

    I7: { 
      type: DataTypes.TIME    
        },

    B7: {
      type: DataTypes.INTEGER
    }

  });

    return Horariomanana;

};