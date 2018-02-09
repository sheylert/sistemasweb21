'use strict'

//var mongoose = require('mongoose');
// modulos
var bcrypt = require('bcrypt-nodejs');
var chalk = require('chalk');
// modelos

var models = require('../models');

// funciones de ayuda
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
    const idStudent = req.body.id;

    if (idStudent) {

        models.Course.findById(idCourse).then(courseFounded => {
            courseFounded.code_student.push(idStudent)
            models.Course.update({ code_student : courseFounded.code_student}, {where: {id: courseFounded.id} } )
            .then(result => {
                models.Student.update({ course: idCourse}, {where: {id: idStudent} } ).then(studentUpdate => {
                    res.json(courseFounded)
                }).catch(err => res.status(500).json({ message: "Error al actualizar el estudiante"}) )
            }).catch(err => res.status(500).json({ message: "Error al insertar el estudiante en el curso"}) )
        }).catch(err => res.status(500).json({ message: "Error al buscar el curso"}) )
    }
    else
    {
        res.status(200).send({ message: 'Es necesario el parametro idStudent' });
    }   
}

// Remover estudiante de cursox
function deleteCourseStudent(req, res, next) {
    const idCourse = req.params.idCourse;
    const idStudent = req.body._id;

    if (idStudent) {
        
        models.Note.findAll({ where: {course_id : idCourse, student_id: idStudent} }).then(notasRespuesta => {
            
            if(notasRespuesta.length > 0)
            {
                res.status(500).send({ message: 'No se puede quitar al estudiante porque ya tiene notas asociadas en asignaturas del curso' });       
            }
            else
            {
                models.Course.findById(idCourse).then(courseFound => {

                    courseFound.code_student.forEach( function(element, index) {
                        if(element.toString() === idStudent.toString())
                        {
                            courseFound.code_student.splice(index,1)

                            models.Course.update({ code_student: courseFound.code_student}, {where: {id: courseFound.id} })
                            .then(courseUpdate => {
                                models.Student.update({ course: null}, {where: {id: idStudent} } ).then(studentUpdate => {
                                    res.json(courseFound)
                                }).catch(err => res.status(500).json({ message: "Error al actualizar el estudiante"}) )
                            }).catch(err => res.status(500).json({ message: "Error al actualizar el curso intentando borrar el estudiante"}))
                        }
                    });
                })
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
    let promises = []
    let validate = false

    // Validación de parámetros
    if (params.id) {
        console.log(chalk.yellow('parametro asignatura recibido... '));

        models.Course.findById(idCourse).then(courseFound => {
            if (courseFound) {
                // si ya existe asignatura agregadas al curso
                if (courseFound.code_subject.length > 0) {
                    // verificar que no este agregado

                    promises.push(
                        courseFound.code_subject.forEach(element => {
                            if (element.toString() === params.id.toString()) {
                                validate = true         
                            }
                        })
                    )

                    // agregando asignatura
                    Promise.all(promises).then( response => {
                        if(!validate)
                        {
                            courseFound.code_subject.push(params.id);
                            models.Course.update({ code_subject: courseFound.code_subject},{ where: {id: courseFound.id} }).then(courseUpdate => {
                                res.status(200).send(courseFound);    
                            }).catch(err => res.status(500).json({ message: "Error al tratar de modificar el curso"}))

                            console.log(chalk.green(`asignatura agregada en bloque1: ${courseFound}`));
                            
                        }
                        else
                        {
                            res.status(500).send({ message: 'La asignatura ya se encuentra agregada y no puede volverse a agregar' })
                        }
                            
                    })
                    .catch(rejected =>  res.status(500).send({ message: 'Ha ocurrido un error: la asignatura ya se encuentra agregada' }) )
                }
                if (courseFound.code_subject.length == 0) {
                    // agregando asignatura
                    courseFound.code_subject.push(params.id);

                    models.Course.update({ code_subject: courseFound.code_subject},{ where: {id: courseFound.id} }).then(courseUpdate => {
                        res.status(200).send(courseFound);    
                        console.log(chalk.green(`asignatura agregada: ${courseFound}`));
                    }).catch(err => res.status(500).json({ message: "Error al tratar de modificar el curso"}))
                }

            } // fin curso encontrado
            if (!courseFound) {
                res.status(200).send({ message: 'No hay ninguna asignatura con ese id' });
            }
        }).catch(err => {
            res.status(500).json({ message: "Error al buscar el curso para agregar asignautra"})
            console.log(err)
        })

    } else {
        res.status(500).send({ message: 'Parámetro no recibido' });

    }
}

// Remover asignatura a curso
function deleteCourseSubject(req, res, next) {
    const idCourse = req.params.idCourse;
    const params = req.body;

    if (params.id) {

        models.Course.findById(idCourse).then(courseFound => {
            if (courseFound) {
                // notificar si existe la asignatura o no
                let subjectExist = false;
                // verificar este agregado
                courseFound.code_subject.forEach((element, index) => {
                    if (element.toString() === params.id.toString()) {
                        subjectExist = true;
                        // removiendo curso
                        courseFound.code_subject.splice(index, 1);
                        // actualizar curso
                        models.Course.update({ code_subject: courseFound.code_subject}, {where: {id: courseFound.id}} ).then(courseUpdate => {
                            res.status(200).json({ courseFound })
                        })
                    }
                });
                if (subjectExist == false) {
                    res.status(200).json({ message: 'No existe la asignatura asociada al curso' });
                }
            }
        }).catch(err => res.status(500).json({ message: "Error al buscar el curso a modificar"}) )

    } else {
        res.status(500).send({ message: 'Parámetro id no recibido' });
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

// GET http://localhost:3789/course/:id
function getCourse(req, res) {

    // Función para buscar el curso seleccionado

    models.Course.findAll({ where : { id: req.params.id }, include:[{
            all: true
        }] 
    }).then(result => {

        let subjects = []
        let students = []
        let promises = []

        if(result[0].code_subject.length > 0 || result[0].code_student.length > 0)
        {
            result[0].code_subject.forEach( function(element, index) {
                
                promises.push(
                    models.Subject.findById(element).then(resultSubject => {
                        subjects.push(resultSubject)

                        if(index + 1 == result[0].code_subject.length)
                        {
                            result[0].code_subject = subjects
                        }
                    })
                )

            }); // foreach asignaciones


            result[0].code_student.forEach( function(element, index) {
                
                promises.push(
                    models.Student.findById(element).then(resultStudent => {
                        students.push(resultStudent)

                        if(index + 1 == result[0].code_student.length)
                        {
                            result[0].code_student = students
                        }
                    })
                )
            }); // foreach Estudiantes

            Promise.all(promises).then(response => {
                res.json(result)       
            }).catch(err => res.status(500).json({ message: "Error al buscar los estudiantes o las asignaturas"}))

        }
        else
        {
            res.json(result)
        }
        
    }).catch(err => res.status(500).json({ message: 'Ha ocurrido un error al buscar los datos del curso'}))
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