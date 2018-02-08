'use strict'

//var mongoose = require('mongoose');
// modulos
var bcrypt = require('bcrypt-nodejs');
var chalk = require('chalk');
// modelos
var Course = require('../models/course');
var models = require('../models');

var Teacher = require('../models/teacher');


//var Student = require('../models/student');
//var Subject = require('../models/subjects');   //ojojojojojo
//var Note = require('../models/note');

// services
var jwt = require('../services/jwt');

var Util     = require('../util/function')

// Registrar Curso
// POST http://localhost:3789/course
function saveCourse(req, res) {

    var params = req.body;

    if (params.character && params.dpyp && params.deval && params.code_grade && params.teacher_chief && params.code_teaching) {

        models.Course.create(req.body).then( courseStored  => {        
            res.status(200).send({ course: courseStored });
        }).catch(err => {
            res.status(500).json({ message : "Ha ocurrido un error al tratar de guardar el curso"}) 
        })


    } else {
        res.status(400).send({ message: 'Ingresa los datos correctos para poder registrar al usuario' });
    }
}

// Asignar estudiante a un curso

function saveCourseStudent(req, res) {
    const idCourse = req.params.idCourse;
    const idStudent = req.body._id;

    if (idStudent) {
        Course.update({ _id: idCourse }, { $push: { code_student: idStudent } }, (err, courseUpdate) => {
            if (err) {
                res.status(500).send({ message: 'Ha ocurrido un error al actualizar el curso' });
            }
            if (courseUpdate) {
                Student.update({ _id: idStudent }, { $set : {course: idCourse } }, (err, studentUpdated) => {
                    if (err) {
                        res.status(500).send({ message: 'Ha ocurrido un error al actualizar el estudiante' });
                    }
                    if (studentUpdated) {
                        res.status(200).send(studentUpdated);
                    }
                    if (!studentUpdated) {
                        res.status(200).send({ message: 'No se ha podido actualizar el estudiante' });
                    }
                })
            }
            if (!courseUpdate) {
                res.status(200).send({ message: 'No se ha podido actualizar el curso' });
            }
        });

    }

    if (!idStudent) {
        res.status(200).send({ message: 'Es necesario el parametro idStudent' });
    }
}

// Remover estudiante de cursox
function deleteCourseStudent(req, res, next) {
    const idCourse = req.params.idCourse;
    const idStudent = req.body._id;

    if (idStudent) {
        
        Note.find( {course : idCourse, studentId: idStudent} ).exec((err,result) => {
            if(err)
            {
                res.status(500).send({ message: 'Ha ocurrido un error al buscar las notas del estudiante en el curso' });
            }
            else
            {
                if(result.length > 0)
                {
                    res.status(400).send({ message: 'No se puede quitar al estudiante porque ya tiene notas asociadas en asignaturas del curso' });       
                }
                else
                {
                    Course.update({ _id: idCourse }, { $pull: { code_student: idStudent } }, (err, courseUpdate) => {
                        if (err) {
                            res.status(500).send({ message: 'Ha ocurrido un error al actualizar el curso' });
                        }
                        if (courseUpdate) {
                            Student.update({ _id: idStudent }, { course: null }, (err, studentUpdated) => {
                                if (err) {
                                    res.status(500).send({ message: 'Ha ocurrido un error al actualizar el estudiante' });
                                }
                                if (studentUpdated) {
                                    res.status(200).send(studentUpdated);
                                }
                                if (!studentUpdated) {
                                    res.status(200).send({ message: 'No se ha podido actualizar el estudiante' });
                                }
                            })
                        }
                        if (!courseUpdate) {
                            res.status(200).send({ message: 'No se ha podido actualizar el curso' });
                        }
                    });
                }
            }
        })
    }
    else
    {
        res.status(200).send({ message: 'Es necesario el parametro idStudent' });
    }
}

// Asignar asignatura a un Curso
// POST /course/:idCourse/subject
function saveCourseSubject(req, res) {
    const idCourse = req.params.idCourse;
    const params = req.body;

    // verificar que la asignatura exista
    Subject.findById(params.idSubject, (err, subjectFound) => {
        if (err) {
            res.status(500).send({ message: 'Ha ocurrido un error en la búsqueda', err: err });
        }
        if (!subjectFound) {
            res.status(200).send({ message: 'No se ha encontrado la asignatura' });
        }
    });

    // formato de nueva asignatura
    const newSubject = {
        "idSubject": new mongoose.mongo.ObjectId(params.idSubject),
        "entryTime": params.entryTime,
        "departureTime": params.departureTime,
        "days": {
            "0": params.days.sun,
            "1": params.days.mon,
            "2": params.days.tue,
            "3": params.days.wes,
            "4": params.days.thu,
            "5": params.days.fri,
            "6": params.days.sat,
        }
    }

    // Validación de parámetros
    if (params.idSubject && params.entryTime && params.departureTime) {
        console.log(chalk.yellow('parametro asignatura recibido... '));

        Course.findById(idCourse, function(err, courseFound) {
            if (err) {
                res.status(500).send({ message: 'Ha ocurrido un error en la búsqueda', err: err });
            }
            if (courseFound) {
                // si ya existe asignatura agregadas al curso
                if (courseFound.code_subject.length > 0) {
                    // verificar que no este agregado
                    courseFound.code_subject.forEach(element => {
                        if (element.idSubject.toString() == params.idSubject.toString()) {
                            console.log(chalk.red('ya existe la asignatura agregado'));
                            res.status(200).send({ message: 'Ha ocurrido un error: la asignatura ya se encuentra agregada' });
                        }

                    });
                    // agregando asignatura
                    courseFound.code_subject.push(newSubject);
                    courseFound.save();
                    console.log(chalk.green(`asignatura agregada: ${courseFound}`));
                    res.status(200).send(courseFound);
                }
                if (courseFound.code_subject.length == 0) {
                    // agregando asignatura
                    courseFound.code_subject.push(newSubject);
                    courseFound.save();
                    console.log(chalk.green(`asignatura agregada: ${courseFound}`));
                    res.status(200).send(courseFound);
                }

            }
            if (!courseFound) {
                res.status(200).send({ message: 'No hay ninguna asignatura con ese id' });

            }
        });

    } else {
        res.status(500).send({ message: 'Parámetro no recibido' });

    }
}

// Remover asignatura a curso
function deleteCourseSubject(req, res, next) {
    const idCourse = req.params.idCourse;
    const params = req.body;

    if (params.idSubject) {

        Course.findById(idCourse, function(err, courseFound) {
            if (err) {
                res.status(500).send({ message: 'Ha ocurrido un error en la búsqueda', err: err });
            }
            if (!courseFound) {
                res.status(200).send({});
            }
            if (courseFound) {
                // notificar si existe la asignatura o no
                let subjectExist = false;
                // verificar este agregado
                courseFound.code_subject.forEach((element, index) => {
                    if (element.idSubject.toString() == params.idSubject.toString()) {
                        subjectExist = true;
                        // removiendo curso
                        courseFound.code_subject.splice(index, 1);
                        // actualizar curso
                        courseFound.save((err, courseSaved) => {
                            if (err) res.status(500).send({ message: "Ha ocurrido un error", error: err })
                            if (courseSaved) res.status(200).json({ courseFound });
                        });
                    }
                });
                if (subjectExist == false) {
                    res.status(200).json({ message: 'No existe la asignatura asociada al curso' });
                }
            }
        });

    } else {
        res.status(500).send({ message: 'Parámetro idSubject no recibido' });

    }
}

// Asignar curso a la escuela
function saveCourseSchool(req, res) {
    const idCourse = req.params.idCourse;
    const idSchool = req.body._id;

    if (idSchool) {
        Course.update({ _id: idCourse }, { $push: { code_school: idSchool } }, (err, courseUpdate) => {
            if (err) {
                res.status(500).send({ message: 'Ha ocurrido un error' });

            }
            if (courseUpdate) {
                res.status(200).send(courseUpdate);
            }
            if (!courseUpdate) {
                res.status(200).send({ message: 'No se ha podido actualizar el curso' });
            }
        });

    }

    if (!idSchool) {
        res.status(200).send({ message: 'Es necesario el parametro idSchool' });
    }
}

function deleteCourseSchool(req, res) {
    const idCourse = req.params.idCourse;
    const idSchool = req.body._id;

    if (idSchool) {
        Course.update({ _id: idCourse }, { $pull: { code_school: idSchool } }, (err, courseUpdate) => {
            if (err) {
                res.status(500).send({ message: 'Ha ocurrido un error' });

            }
            if (courseUpdate) {
                res.status(200).send(courseUpdate);
            }
            if (!courseUpdate) {
                res.status(200).send({ message: 'No se ha podido actualizar el curso' });
            }
        });

    }
}


// Mostrar todos los Cursos
// GET http://localhost:3789/course
function getCourses(req, res) {

    models.Course.findAll({ where : { code_school: req.user.sub }, 
        include : [{ all: true }]
    }).then( function(courses) { 
        res.json(courses)
      }).catch(err => res.status(500).json({ message: "Ha ocurrido un error al buscar todos los cursos"} )) 

}    

  /*  

    Course.find().populate([{


            path: 'teacher_chief',
            model: 'Teacher'
        },
        {
            path: 'code_teaching',
            model: 'Teaching'
        },
        {
            path: 'code_grade',
            model: 'CourseCode'
        },
        {
            path: 'code_subject.idSubject',
            model: 'Subject'
        },
        {
            path: 'code_student',
            model: 'Student'
        },
        {
            path: 'code_school',
            model: 'Client'
        }
    ]).exec((err, courses) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición', err: err.errors })
        } else {
            if (!courses) {
                res.status(200).send([])
            } else {
                res.status(200).send(courses);
            }
        }
    });

*/

// Mostrar todos los Cursos
// GET http://localhost:3789/course/:id
function getCourse(req, res) {

    // Función para buscar el curso seleccionado
    models.Course.findAll({ where : { _id: req.params.id } }).populate([{
            path: 'teacher_chief',
            model: 'Teacher'
        },
        {
            path: 'code_teaching',
            model: 'Teaching'
        },
        {
            path: 'code_grade',
            model: 'CourseCode'
        },
        {
            path: 'code_subject',
            model: 'Subject'
        },
        {
            path: 'code_student',
            model: 'Student'
        },
        {
            path: 'code_school',
            model: 'Client'
        }
    ]).exec((err, courses) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición', err: err })
        } else {
            if (!courses) {
                res.status(200).send({ message: 'No existen cursos registrados' })
            } else {
                res.status(200).send(courses);
            }
        }
    });
}

// Mostrar Escuela asociado a Curso
// GET http://localhost:3789/course/searchSchool/:idSchool
function getCourseSchool(req, res) {
    var idSchool = req.params.idSchool;
    // Función para buscar el curso seleccionado
    Course.find({ code_school: idSchool }).populate([{
            path: 'teacher_chief',
            model: 'Teacher'
        },
        {
            path: 'code_teaching',
            model: 'Teaching'
        },
        {
            path: 'code_grade',
            model: 'CourseCode'
        },
        {
            path: 'code_subject',
            model: 'Subject'
        },
        {
            path: 'code_student',
            model: 'Student'
        },
        {
            path: 'code_school',
            model: 'School'
        }
    ]).exec((err, courses) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición', err: err.errors })
        } else {
            if (!courses) {
                res.status(200).send({ message: 'No existen cursos registrados' })
            } else {
                res.status(200).send(courses);
            }
        }
    });
}

// Actualizar curso específico
// PUT http://localhost:3789/course/:id
function updateCourse(req, res) {
    const courseId = req.params.id;
    const update = req.body;

    models.Course.update(update, { where : {id: courseId} }).then(result => {
        res.status(200).send({ course: result });

    }).catch(err => res.status(500).json({ message: 'Ha ocurrido un error al actualizar el curso' }) )
}

// Remover item de un array
function removeItemFromArr(arr, item) {
    var i = arr.indexOf(item);
    arr.splice(i, 1);
}


module.exports = {
    saveCourse,
    getCourses,
    getCourse,
    updateCourse,
    getCourseSchool,

    saveCourseStudent,
    deleteCourseStudent,

    saveCourseSubject,
    deleteCourseSubject,

    saveCourseSchool,
    deleteCourseSchool
}