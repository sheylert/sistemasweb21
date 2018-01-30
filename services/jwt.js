'use strict'

// modelos
var Client = require('../models/client');

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_sistema_proNotas';

exports.createToken = function (user) {
  if (user.school) {
    var payload = {
      sub: user.school,
      userId: user.id,
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

    return jwt.encode(payload, secret);
  } else {
    var payload = {
      sub: user.school,
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
