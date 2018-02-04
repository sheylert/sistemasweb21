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
      validatePass: user.validatePass,
      iat: moment().unix(),
      exp: moment().add(1, 'days').unix()
    
    }
    return jwt.encode(payload, secret);
  }
}
