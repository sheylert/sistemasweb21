'use strict'

module.exports = (sequelize, DataTypes) => {

  const Profile = sequelize.define("profile", {

  _id: { 
          type: DataTypes.INTEGER,
        },
  name: { 
          type: DataTypes.STRING    
        },
  slug: { 
          type: DataTypes.STRING    
        },         
  });
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