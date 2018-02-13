'use strict'

module.exports = (sequelize, DataTypes) => {

  const Horariotarde = sequelize.define("horariotarde", {

    school: {
      type: DataTypes.INTEGER
    },

    id_curso: { 
            type: DataTypes.INTEGER    
          },
    id_dia: { 
            type: DataTypes.INTEGER    
        },     

    I8: { 
            type: DataTypes.TIME    
        },
    B8: {
      type: DataTypes.INTEGER
    },

    I9: { 
     type: DataTypes.TIME    
    },

    B9: {
      type: DataTypes.INTEGER
    },

    I10: { 
            type: DataTypes.TIME    
    },

    B10: {
      type: DataTypes.INTEGER
    },

    I11: { 
            type: DataTypes.TIME    
    },

    B11: {
      type: DataTypes.INTEGER
    },

    I12: { 
        type: DataTypes.TIME    
    },

    B12: {
      type: DataTypes.INTEGER
    },

      I13: { 
            type: DataTypes.TIME    
      },

    B13: {
      type: DataTypes.INTEGER
    },

    I14: { 
      type: DataTypes.TIME    
        },

    B14: {
      type: DataTypes.INTEGER
    }

  });

    return Horariotarde;

};