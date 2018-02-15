'use strict'

module.exports = (sequelize, DataTypes) => {

  const Profile = sequelize.define("profile", {
  name: { 
          type: DataTypes.STRING    
        },
  slug: { 
          type: DataTypes.STRING    
        },         
  });

  Profile.associate = model => {
    Profile.hasMany(model.User, {
      foreignKey: 'profile_id',
      'as': 'perfiles'
    })
  } 
     
    return Profile; 

};


/*
'use strict'

var moongose = require('mongoose');
var Schema = moongose.Schema;

var ProfileSchema = Schema({
  id: String,  ---------------------------------ojo
  name: String,
  slug: String
});

module.exports = moongose.model('Profile', ProfileSchema);

*/