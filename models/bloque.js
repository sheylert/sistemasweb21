'use strict'

module.exports = (sequelize, DataTypes) => {

  const Bloque = sequelize.define("bloque", {

    turno: {
      type: DataTypes.INTEGER
    },

    bloque: { 
            type: DataTypes.STRING    
          },

    inicio: { 
            type: DataTypes.TIME    
          },

    fin: {
      type: DataTypes.TIME
    }

  });
  
    return Bloque;

};