'use strict'

// libreria de cifrado 
var bcrypt = require('bcrypt');

// modelos
var Student = require('../models/student');
var Course = require('../models/course');
var Responsable = require('../models/responsable');
//var Note = require('../models/note');
var User = require('../models/user');
//var Annotation = require('../models/annotation');
//var Delay = require('../models/delay');
//var Retire = require('../models/retire');
//var Event = require('../models/event');
//var Sms = require('../models/sms');
var Profile = require('../models/profile');

var models = require('../models');

// services
var jwt = require('../services/jwt');


var Util     = require('../util/function')
// librerias 
var emailValidator = require('email-validator')
var chalk = require('chalk')


function getAllStudent(req, res) {

   // Función para buscar todos los estudiantes
      models.Student.findAll({ where: { school: req.user.sub, state: true },
      include: [{
        model: models.Responsable,
        as : 'responsable'
      }]
}).then( function(students) { 
   
     if (!students) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (students) {
            /*
            students.forEach(function(elemento) {

             models.Responsable.findOne( { where: { id: 2}}).then( function(responsableStoraged) { 

               if (responsableStoraged) {
                   students.responsable = Util.ejecutar_arreglo(students);
               }
              });    

            });
            */
            res.status(200).send(students);
          } 
        }     
  });   
}



function getAllStudentClient(req, res) { 
    // Función para buscar todos los estudiantes

    // ojo  school: req.params.client
    // ojo 
    // inner con responsable

     models.Student.findAll({ where: { school: req.user.sub, state: true },
      include: [{
        model: models.Responsable,
        as : 'responsableStudent'
      }]
}).then( function(students) { 
     
     if (!students) {
          res.status(500).send({ message: 'Error en la petición' });
        } else {
          if (students) {
            res.status(200).send(students);
          } 
        }     
  });   
}

function getAllStudentWithoutCourse(req, res) {

    // Función para buscar todos los estudiantes sin curso

    models.Student.findAll({ where: { state: true, course: null, school: req.user.sub } }).then(result => {
        res.status(200).send(result);
    }).catch(err => res.status(500).json({ message: "Error al buscar los estudiantes sin cursos"}) )
}

function saveStudent(req, res) {

    // Función para guardar todos los Estudiantes
var params = req.body

models.Student.findOne({ where: { rut:  params.rut }}).then( result => {
    if(result)
    {     
      res.status(404).send({ message: `El alumno ${params.name} ${params.lastname} ya se encuentra registrado` })
    }
    else
    {
              var student={};

                student.name = params.name
                student.lastname = params.lastname
                student.rut = params.rut
                // student.code_grade = params.code_grade
                // student.code_teaching = params.code_teaching
                // student.character = params.character
                student.birth_date = '2018-01-01' //params.birth_date
                student.age = params.age
                student.course = null
                student.state = true
                student.school = req.user.sub

                models.Responsable.findOne({ where: { rut:  params.rut_res }}).then( responsable => {
                if(responsable)
                {

                         student.responsable_id = responsable.id
                                         
                        models.Student.create(student).then( function(studentStore) 
                        { 
                          if (!studentStore) 
                              {
                               res.status(404).send({ message: 'No se ha guardado el estudiante' });
                              } else {
                               //studentStore.respon = responStore;
                               res.status(200).send({ Student: studentStore });
                              }
                        });   
                }
                else
                {
                     var respon={}; 

                            respon.name = params.name_res
                            respon.lastname = params.lastname_res
                            respon.rut = params.rut_res
                            respon.email = params.email_res
                            respon.phone = params.phone_res
                            respon.address = params.address_res

                            if (emailValidator.validate(respon.email)) 
                            { 
                                 models.Responsable.create(respon).then( function(responStore) { 

                                    if (!responStore) {
                                     res.status(500).send({ message: 'Error al guardar el responsable' });
                                    } else {

                                        models.Profile.findOne({ where: { slug:  'RESPONSABLE' }}).then( profile => {
                                       
                                        if(profile)
                                        {
                                                    student.responsable_id = responStore.id

                                                    var user={}; 

                                                    user.name = params.name_res +' '+params.lastname_res;
                                                    user.address = params.address_res;
                                                    user.phone = params.phone_res;
                                                    user.school = req.user.sub
                                                    user.profile_id = profile.id;
                                                    user.email = params.email_res;
                                                    user.password = bcrypt.hashSync(params.email_res, 10);
                                                    user.state = true;
                                                    user.services = true;
                                                    user.validatePass = false;
                    
                                                    user.responId = responStore.id
                                                       
                                                    models.User.create(user).then( function(userStore) { 

                                                    if (!userStore) {
                                                        
                                                        res.status(500).send({ message: 'Error al guardar el usuario del responsable' });
                                  
                                                    } else {
 
                                                            models.Student.create(student).then( function(studentStore) 
                                                            { 

                                                            if (!studentStore) 
                                                               {
                                                                res.status(404).send({ message: 'No se ha guardado el estudiante' });
                                                               } else {
                                                                //studentStore.respon = responStore;
                                                                res.status(200).send({ Student: studentStore });
                                                               }
                                                              
                                                              });  
                                                            }
                                                 });
                                                            
                                        }else
                                        {
                                               res.status(404).send({ message: "No tiene registrado el permiso de RESPONSABLE en perfiles" })
                                        }
                                    });
                                   }  // fin del  !responStore   
                                })    

                            } else 
                            { res.status(404).send({ message: "formato de email invalido" }) }    

                    }
                }).catch(err => res.status(500).json({ message:  "Ha ocurrido un error al intentar encontrar el responsable"}) )

    }
  }).catch(err => res.status(500).json({ message:  "Ha ocurrido un error al intentar encontrar el estudiante"}) )

    /*


    var params = req.body

    Student.findOne({ rut: params.rut }).exec((err, students) => {
            if (students) {
                res.status(200).send({ message: `El alumno ${params.name} ${params.lastname} ya se encuentra registrado` })
            } else {
                var student = new Student();

                var b_date = params.birth_date.indexOf('-', 0) == -1 ? params.birth_date.split("/").reverse().join("/") : params.birth_date.split("-").reverse().join("-")
                
                var dateNow = new Date()

                b_date = new Date(b_date)

                b_date.setHours(dateNow.getHours() + 20)
                b_date.setMinutes(dateNow.getMinutes())
                b_date.setSeconds(dateNow.getSeconds())

                student.name = params.name
                student.lastname = params.lastname
                student.rut = params.rut
                // student.code_grade = params.code_grade
                // student.code_teaching = params.code_teaching
                // student.character = params.character
                student.birth_date = b_date
                student.age = params.age
                student.course = null
                student.state = true
                student.school = req.user.sub

                Responsable.findOne({ rut: params.rut_res }).exec((err, responsa) => {
                        if (responsa) {
                            // Si existe el responsable

                            student.responsable = responsa.id

                            student.save((err, studentStore) => {
                                if (err) {
                                    res.status(500).send({ message: 'Error al guardar el estudiante', error: err });
                                } else {
                                    if (!studentStore) {
                                        res.status(404).send({ message: 'No se ha guardado el estudiante' });
                                    } else {
                                        studentStore.respon = responsa;
                                        res.status(200).send({ Student: studentStore });
                                    }
                                }
                            })
                        } // fin si existe el responsable
                        else 
                        {
                            // si no existe el responsable

                            var respon = new Responsable()

                            respon.name = params.name_res
                            respon.lastname = params.lastname_res
                            respon.rut = params.rut_res
                            respon.email = params.email_res
                            respon.phone = params.phone_res
                            respon.address = params.address_res

                            if (emailValidator.validate(respon.email)) 
                            { 
                                // validando que email sea valido
                                respon.save((err, responStore) => 
                                {
                                    if (err) 
                                    {
                                        res.status(500).send({ message: 'Error al guardar el responsable' });
                                    } 
                                    else 
                                    {

                                        if (!responStore) 
                                        {
                                            res.status(404).send({ message: 'No se ha guardado el responsable' });
                                        } 
                                        else 
                                        {
                                            Profile.findOne({ slug: 'RESPONSABLE' }).exec((err, profile) => {
                                                // agregar al objeto student el id del responsable
                                                student.responsable = responStore.id

                                                // agregar un usuario al responsable
                                                var user = new User()

                                                user.name = params.name_res +' '+params.lastname_res;
                                                user.address = params.address_res;
                                                user.phone = params.phone_res;
                                                user.school = req.user.sub
                                                user.profile = profile.id;
                                                user.email = params.email_res;
                                                user.state = true;
                                                user.type = 3;
                                                user.validatePassword = false;
                                                user.responId = responStore.id

                                                user.save((err, userStore) => {
                                                    if (err) {
                                                        res.status(500).send({ message: 'Error al guardar el usuario del responsable' });
                                                    } else {
                                                        if (!userStore) {
                                                            res.status(404).send({ message: 'No se guardado el usuario del responsable' });
                                                        } else {
                                                            student.save((err, studentStore) => {
                                                                    if (err) {
                                                                        res.status(500).send({ message: 'Error al guardar el estudiante', error: err });
                                                                    } else {
                                                                        if (!studentStore) {
                                                                            res.status(404).send({ message: 'No se ha guardado el estudiante' });
                                                                        } else {
                                                                            studentStore.respon = responStore;
                                                                            res.status(200).send({ Student: studentStore });
                                                                        }
                                                                    }
                                                                }) // fin función save student
                                                        }
                                                    }
                                                })
                                            }) // fin busqueda profile
                                        } // fin if si se pudo gurdar el responsable
                                    } // fin si no hubo error antes de guardar el responsabe

                                }) // **fin bloque de guardados**
                            } else { res.status(404).send({ message: "formato de email invalido" }) }

                        } // **fin no existe responsable**
                    }) // **fin responsable find function**

            } // **fin no se encuetra el alumno registrado**
        }) // ** fin function find student **


*/
}

function getStudent(req, res) {

    // Función para buscar el estudiante seleccionado
    Student.findOne({ id: req.params.id }).populate('responsable').exec((err, student) => {
        if (err) {
            res.status(500).send({ message: 'Ha ocurrido un error en la busqueda' });
        } else {
            if (student) {

                res.status(200).send(student)
            } else {
                res.status(200).send({})
            }
        }
    })
}

function updateStudent(req, res) {

    // Función para modificar el estudiante
    const userId = req.params.id;

    var b_date = req.body.birth_date.indexOf('-', 0) == -1 ? req.body.birth_date.split("/").reverse().join("/") : req.body.birth_date.split("-").reverse().join("-")
    var dateNow = new Date()
    b_date = new Date(b_date)

    b_date.setHours(dateNow.getHours() + 20)
    b_date.setMinutes(dateNow.getMinutes())
    b_date.setSeconds(dateNow.getSeconds())

    const update = {
        name: req.body.name,
        lastname: req.body.lastname,
        rut: req.body.rut,
        code_grade: req.body.code_grade,
        code_teaching: req.body.code_teaching,
        character: req.body.character,
        birth_date: '2018-01-01',
        age: req.body.age,
        course: req.body.course,
        school: req.user.sub
    }

    const updateRes = {
        rut: req.body.rut_res,
        name: req.body.name_res,
        lastname: req.body.lastname_res,
        email: req.body.email_res,
        phone: req.body.phone_res,
        address: req.body.address_res,
    }

        models.Student.update( update, 
                         {where: { id: userId } }).then( function(updatealumno) { 

        if (!updatealumno) {
           res.status(404).send({ message: 'No se a podido actualizar el estudiante!' });
        } else {    

        models.Student.findOne({ where: { id: userId }}).then( idrespon => {
                                       
        if(idrespon)
        {
           models.Responsable.update( updateRes, 
                         {where: { id: idrespon.responsable_id } }).then( function(updateresp) { 

                    if (!updateresp) {
                       res.status(404).send({ message: 'No se a podido actualizar el Responsable!' });
                    } else {
                        res.status(200).send({ Student: updateresp });
                    }
               })    
         }
      }) 

    }
 })
 /*

    Student.findByIdAndUpdate(userId, update, { new: true }, (err, studentUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Ha ocurrido un error al tratar de modificar el usuario' });
        } else {
            if (!studentUpdated) {
                res.status(404).send({ message: 'No se a podido actualizar el usuario!' });
            } else {

                Responsable.findByIdAndUpdate(studentUpdated.responsable, updateRes, { new: true }, (err, responUpdated) => {
                    if (err) {
                        res.status(500).send({ message: 'Ha ocurrido un error al tratar de modificar el responsable' });
                    } else {
                        if (!responUpdated) {
                            res.status(404).send({ message: 'No se a podido actualizar el responsable!' });
                        } else {
                            res.status(200).send({ Student: studentUpdated, Responsable: responUpdated });
                        }
                    }
                })
            }
        }

    })

    */

}

function deleteStudent(req, res) {
    // Función para eliminar logicamente un usuario

    const deleteStudent = {
        state: false
    }

    Student.findByIdAndUpdate(req.params.id, deleteStudent, { new: true }, (err, studentUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Ha ocurrido un error al tratar de eliminar el estudiante' });
        } else {
            if (!studentUpdated) {
                res.status(404).send({ message: 'No se a podido eliminar el estudiante!' });
            } else {
                res.status(200).send({ message: 'Alumno eliminado con éxito!' });
            }
        }

    })

}

function showStudentByResponsable(req, res) {

    Student.find({ state: true, responsable: req.params.idResponsable }).populate('responsable').exec((err, studentsFound) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' })
        } else {
            if (!studentsFound.length) {
                res.status(200).send([])
            }
            if (studentsFound.length) {
                res.status(200).send(studentsFound)
            }
        }
    })
}

function showAllDataStudent(req, res) {
    const idStudent = req.params.idStudent;

    var student, noteStudent, annotationStudent, delayStudent, retireStudent, eventStudent, smsStudent, scheduleStudent = [];

    Course.find({ code_student: idStudent }).populate([{
        path: 'code_subject.idSubject',
        model: 'Subject'
    }]).exec((err, courseFound) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' })
        }
        if (courseFound) {
            scheduleStudent = courseFound;
        }
    });

    Note.find({ studentId: idStudent }).populate(
        [{
                path: 'subjectId',
                model: 'Subject'
            },
            {
                path: 'course',
                model: 'Course'
            }
        ]
    ).exec((err, notesFound) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' })
        }
        if (notesFound) {
            console.log(chalk.green(`notas agregado`))
            noteStudent = notesFound;
        }
    })

    Annotation.find({ studentId: idStudent }).populate(
        [{
                path: 'subjectId',
                model: 'Subject'
            },
            {
                path: 'teacherId',
                model: 'Teacher'
            },
            {
                path: 'course',
                model: 'Course'
            }
        ]
    ).exec((err, annotationFound) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' })
        }
        if (annotationFound) {
            console.log(chalk.green(`anotaciones agregado`))
            annotationStudent = annotationFound;
        }
    })

    Delay.find({ studentId: idStudent }).populate(
        [{
            path: 'course',
            model: 'Course'
        }]
    ).exec((err, delayFound) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' })
        }
        if (delayFound) {
            console.log(chalk.green(`retrasos agregado`))
            delayStudent = delayFound;
        }
    })

    Retire.find({ studentId: idStudent }).populate(
        [{
            path: 'course',
            model: 'Course'
        }]
    ).exec((err, retireFound) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' })
        }
        if (retireFound) {
            console.log(chalk.green(`retiros agregado`))
            retireStudent = retireFound;
        }
    })

    Sms.find({ studentId: idStudent }).populate([{
        path: 'templateId',
        model: 'Template'
    }]).exec((err, smsFound) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición', er: err })
        }
        if (smsFound) {
            smsStudent = smsFound;
        }
    })

    Event.find().populate(
        [{
            path: 'course',
            model: 'Course',
            match: { code_student: { id: idStudent } },

        }]
    ).exec((err, eventFound) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición', er: err })
        }
        if (eventFound) {
            eventStudent = eventFound;
        }
    })

    Student.find({ state: true, id: idStudent }).populate('responsable').exec((err, studentFound) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        }
        if (studentFound.length > 0) {
            
            student = studentFound;
            res.status(200).send({
                estudiante: student,
                notas: noteStudent,
                anotaciones: annotationStudent,
                retardos: delayStudent,
                retiros: retireStudent,
                eventos: eventStudent,
                sms: smsStudent,
                horario: scheduleStudent

            });
        }
        if (studentFound.length < 1) {
            res.status(200).send({});
        }
    })

}

function countStudentBySchool(req, res) {
    Student.find({ school: req.params.idSchool }).exec(function(err, results) {
        if (err) {
            res.status(500).send({ message: "error en la petición" })
        }
        var count = results.length;
        res.status(200).send({ cantidad: count });

    });
}

module.exports = {
    getAllStudent,
    getAllStudentWithoutCourse,
    saveStudent,
    getStudent,
    updateStudent,
    deleteStudent,
    showStudentByResponsable,
    showAllDataStudent,
    countStudentBySchool,
    getAllStudentClient
}