var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_sistema_proNotas';

exports.createToken = function (user) {
  
  if (user.school) {
    var payload = {
      sub: user.school.id,
      userId: user._id,
      name: user.name,
      address: user.address,
      phone: user.phone,
      profile: user.profile,
      email: user.email,
      services: user.services,
      state: user.state,
      responId: user.responId,
      validatePass: user.validatePass,
      type:  user.type,
      iat: moment().unix(),
      exp: moment().add(30, 'days').unix()
    }

    //console.log(payload, 'tokennn')

    return jwt.encode(payload, secret);
  } else {
    var payload = {
      sub: user.school.id,
      name: user.name,
      address: user.address,
      phone: user.phone,
      profile: user.profile,
      email: user.email,
      state: user.state,
      responId: user.responId,
      validatePass: user.validatePass,
      type:  user.type,
      iat: moment().unix(),
      exp: moment().add(30, 'days').unix()
    }
  }
}



/*


'use strict'

// modelos
var Client = require('../models/client');

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_sistema_proNotas';

exports.createToken = function (user) {
  if (user.school) {
    var payload = {
      profile: user.profile,
      email: user.email,
      state: user.state,
      services: user.services,
      validatePass: user.validatePass,
      iat: moment().unix(),
      exp: moment().add(1, 'days').unix()
    }

    return jwt.encode(payload, secret);
  } else {
    var payload = {
      
      profile: user.profile,
      email: user.email,
      state: user.state,
      services: user.services,
      validatePass: user.validatePass,
      iat: moment().unix(),
      exp: moment().add(1, 'days').unix()
    
    }
    return jwt.encode(payload, secret);
  }
}
*/