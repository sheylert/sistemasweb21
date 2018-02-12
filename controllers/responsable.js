'use strict'

// modelos
var Responsable = require('../models/responsable');

// librerias 
var emailValidator = require('email-validator')
var libPhoneValidator = require('joi-phone-validator')
var Joi = require('joi')
var chalk = require('chalk')

// esta funcion no sera implementada debido que al memomento de registrar un usuario se anade un estudiante
// aca se puede probar el funcionamiento de la validacion de email y telefonos
function saveResponsable(req, res) {

    var responsable = new Responsable();
    var schema = libPhoneValidator.phone().validate()
    var params = req.body;

    responsable.name = params.name
    responsable.lastname = params.lastname
    responsable.rut = params.rut
    responsable.email = params.email
    responsable.phone = params.phone
    responsable.address = params.address

    var phoneValidator = Joi.validate(responsable.phone, schema)

    if (!responsable.name || !responsable.lastname || !responsable.rut || !responsable.email || !responsable.phone && responsable.address) {
        res.status(200).send({ message: "Campo requerido" })
    }

    if (emailValidator.validate(responsable.email)) {
        if (!phoneValidator.error) {
            responsable.save((err, responsableStorage) => {
                if (err) {
                    res.status(500).send({ message: 'Error al guarda el aponderado' });
                }
                if (!responsableStorage) {
                    res.status(404).send({ message: "No se ha podido almacenar el aponderado" })
                }
                if (responsableStorage) {
                    res.status(200).send(responsableStorage)
                }
            });

        } else {
            res.status(200).send({ message: "formato de telefono invalido" })
        }

    } else {
        res.status(200).send({ message: "email invalido" })
    }

}

function getResponsables(req, res) {

    Responsable.find().exec((err, responsableList) => {
        if (err) {
            res.status(500).send({ message: 'error al realizar la busqueda' });
        }
        if (!responsableList) {
            res.status(200).send([])
        }
        if (responsableList) {
            res.status(200).send(responsableList)
        }
    });

}

module.exports = {
    saveResponsable,
    getResponsables
}