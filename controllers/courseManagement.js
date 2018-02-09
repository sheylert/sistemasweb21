'use strict'

// chalck aviso
var chalk = require('chalk');

// modelos
var models = require('../models');

function getAllCourses(req, res) {
    
    Course.find( {code_school: req.user.sub} ).exec((err, courses) => {
        if (err) 
        {
            res.status(500).send({ message: 'Error en la petición' })
        } 
        else 
        {
            if (courses.length == 0) 
            {
                res.status(200).send([])
            } 
            else 
            {
                res.status(200).send(courses);
            }
        }
    })
}

function getCourse(req, res) {

    // Función para buscar el curso seleccionado

    Course.findOne( {_id: req.params.id} )
    .populate([{
            path: 'code_subject',
            model: 'Subject'
        },
        {
            path: 'code_student',
            model: 'Student',
            populate:{
                path: 'responsable',
                model: 'Responsable'
            }
        }
    ])
    .exec((err, course) => {
        if (err) 
        {
            res.status(500).send({ message: 'Ha ocurrido un error en la busqueda' });
        } 
        else 
        {
            if (course) 
            {
                Note.find( {course: req.params.id} ).exec((err, notess) =>{
                    if (err) 
                    {
                        res.status(500).send({ message: 'Ha ocurrido un error al buscar las notas del curso' });
                    } 
                    else 
                    {
                        if(notess.length > 0) 
                        {
                            course.notes = notess
                        }
                        else
                        {
                            course.notes = {}
                        }
                    }

                })
                res.status(200).send(course)
            } 
            else 
            {
                res.status(200).send([])
            }
        }
    })
}

function masiveAssingStudentNote(req, res)
{
    // función para asignar notas masivamente por alumno
    /*var testJson = [
        {
            student: {
                name : "Alvaro",
                lastname: "Guedez"
            },
            notes : {
                note_1_1 : 10,
                note_1_2 : 10,
                note_1_3 : 10,
                note_1_4 : 10,
                note_1_5 : 10,
                note_1_6 : 10,
                note_1_7 : 10,
                note_1_8 : 10,
                note_1_9 : 10,
                note_1_10 : 10,
                note_1_11 : 10,
                note_1_12 : 10,
                prom_1   : 10,
                note_2_1 : 10,
                note_2_2 : 10,
                note_2_3 : 10,
                note_2_4 : 10,
                note_2_5 : 10,
                note_2_6 : 10,
                note_2_7 : 10,
                note_2_8 : 10,
                note_2_9 : 10,
                note_2_10 : 10,
                note_2_11 : 10,
                note_2_12 : 10,
                prom_2   : 10    
            },
            subject: {
                subjectId : '12312asdasdasdqwe1'
            }
        }
    ]*/

    req.body.forEach((ele,index) => {

        let prom_1_total = ( parseFloat(ele.notes.note_1_1) + parseFloat(ele.notes.note_1_2)
                           + parseFloat(ele.notes.note_1_3) + parseFloat(ele.notes.note_1_4)
                           + parseFloat(ele.notes.note_1_5) + parseFloat(ele.notes.note_1_6)
                           + parseFloat(ele.notes.note_1_7) + parseFloat(ele.notes.note_1_8)
                           + parseFloat(ele.notes.note_1_8) + parseFloat(ele.notes.note_1_10)
                           + parseFloat(ele.notes.note_1_11) + parseFloat(ele.notes.note_1_12) ) / 12,
            prom_2_total = ( parseFloat(ele.notes.note_2_1) + parseFloat(ele.notes.note_2_2)
                           + parseFloat(ele.notes.note_2_3) + parseFloat(ele.notes.note_2_4)
                           + parseFloat(ele.notes.note_2_5) + parseFloat(ele.notes.note_2_6)
                           + parseFloat(ele.notes.note_2_7) + parseFloat(ele.notes.note_2_8)
                           + parseFloat(ele.notes.note_2_8) + parseFloat(ele.notes.note_2_10)
                           + parseFloat(ele.notes.note_2_11) + parseFloat(ele.notes.note_2_12) ) / 12


        let update = {
            note_1_1 : ele.notes.note_1_1,
            note_1_2 : ele.notes.note_1_2,
            note_1_3 : ele.notes.note_1_3,
            note_1_4 : ele.notes.note_1_4,
            note_1_5 : ele.notes.note_1_5,
            note_1_6 : ele.notes.note_1_6,
            note_1_7 : ele.notes.note_1_7,
            note_1_8 : ele.notes.note_1_8,
            note_1_9 : ele.notes.note_1_9,
            note_1_10 : ele.notes.note_1_10,
            note_1_11 : ele.notes.note_1_11,
            note_1_12 : ele.notes.note_1_12,
            prom_1   : prom_1_total,
            note_2_1 : ele.notes.note_2_1,
            note_2_2 : ele.notes.note_2_2,
            note_2_3 : ele.notes.note_2_3,
            note_2_4 : ele.notes.note_2_4,
            note_2_5 : ele.notes.note_2_5,
            note_2_6 : ele.notes.note_2_6,
            note_2_7 : ele.notes.note_2_7,
            note_2_8 : ele.notes.note_2_8,
            note_2_9 : ele.notes.note_2_9,
            note_2_10 : ele.notes.note_2_10,
            note_2_11 : ele.notes.note_2_11,
            note_2_12 : ele.notes.note_2_12,
            prom_2   : prom_2_total
        }

        Note.update( { course: req.params.id, studentId : ele.student.id, subjectId: ele.subject.id },{ $set: update}, (err, numberAffected, rawResponse) =>{
            if(err)
            {
                res.status(500).send({ message: "Error al actualizar las notas"})
            }
        })
    })
        res.status(200).send({ message: "Todas las notas fueron actualizadas" })

}

function listStudent(req,res)
{
    /* =========================================================================================================
        Función para listar a los alumnos en el get de anotaciones, se filtran los alumnos por el id del course
        Se debe pasar el id del curso como parametro
       ========================================================================================================= */

    models.Course.findAll({ where: {id: req.params.id},
        include: [{
            model : models.Teacher,
            as    : 'profesores' 
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
                    models.Student.findOne({where: {id : element} }).then(resultStudent => {
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

    }).catch( err => {
        res.status(500).json({ message: "Ha ocurrido un error buscando los datos del curso"})
        console.log(err)
    })
}

function saveStudentAnnotation(req,res)
{
    // función para guardar una anotación

    let params = req.body,
        saveData   = {
            student_id: params.student_id,
            subject_id: params.subject_id,
            teacher_id: params.teacher_id,
            course_id : params.course_id,
            school_id : req.user.sub,
            date     : new Date(params.date),
            type     : params.type,
            detail   : params.detail
        }

    models.Annotation.create(saveData).then( result => {

        res.json({ Annotation:result})

    }).catch(err => res.status(500).json({ message: "Ha ocurrido un error guardando la anotación"}))
}

function listStudentAnnotation(req,res)
{
    /* =========================================================================================================
                        Función para listar las anotaciones por el id del estudiante
       ========================================================================================================= */
    
    
    models.Annotation.findAll({ where: {course_id : req.params.id, school_id: req.user.sub },
        include: [{ all: true}]
    }).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).json({ message: "Ha ocurrido un error buscando las anotaciones registradas"})
    })
}

function listStudentRetire(req,res)
{
    /* =========================================================================================================
        Función para listar a los alumnos en el get de retires, se filtran los alumnos por el id del course
        Se debe pasar el id del curso como parametro
       ========================================================================================================= */

    models.Course.findAll({ where :{ id : req.params.id }
    }).then(result => {

        let students = []
        let promises = []

        if(result[0].code_student.length > 0)
        {

            result[0].code_student.forEach( function(element, index) {
                
                promises.push(
                    models.Student.findOne({where: {id : element},
                        include: [{
                            model: models.Responsable,
                            as   : 'responsable'
                        }]
                    }).then(resultStudent => {
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
    }).catch( err => res.status(500).json({ message: 'Ha ocurrid un error bucando los datos del ccuro'}))
}

function saveStudentRetire(req,res)
{
    // función para guardar una anotación

    let params = req.body, 
        saveData   = {
            student_id: params.student_id,
            course_id   : params.course_id,
            school_id   : req.user.sub,
            date     : new Date(params.date),
            detail   : params.detail
        }

        models.Retire.create(saveData).then(retiredStored => {    
            res.status(200).send({ Retire: retiredStored })
        }).catch(err =>  {
            console.log(err)
            res.status(500).json({ message: "Ha ocurrido un error al guardar el retiro"})
        })
}

function listStudentRetireStored(req,res)
{
    /* =========================================================================================================
                Función para listar retiros por alumnos, se filtran los retiros por el id del alumno
       ========================================================================================================= */

    models.Retire.findAll({ where: {course_id: req.params.id, school_id: req.user.sub },
        include: [{
            model: models.Student,
            as   : 'estudiante',
            include:[{
                model: models.Responsable,
                as   : 'responsable'
            }] 
        }]
    }).then(retires =>{
        res.status(200).send(retires);
    }).catch(err =>{ 
        console.log(err)
        res.status(500).send({ message: 'Error en la ejecución de la busqueda de retiros' })
    })
}

function listStudentDelay(req,res)
{
    /* =========================================================================================================
        Función para listar a los alumnos en el get de atrasos, se filtran los alumnos por el id del course
        Se debe pasar el id del curso como parametro
       ========================================================================================================= */
    

    models.Course.findAll({ where :{ id : req.params.id }
    }).then(result => {

        let students = []
        let promises = []

        if(result[0].code_student.length > 0)
        {

            result[0].code_student.forEach( function(element, index) {
                
                promises.push(
                    models.Student.findOne({where: {id : element},
                        include: [{
                            model: models.Responsable,
                            as   : 'responsable'
                        }]
                    }).then(resultStudent => {
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
    }).catch( err => res.status(500).json({ message: 'Ha ocurrid un error bucando los datos del ccuro'}))
}

function saveStudentDelay(req,res)
{
    // función para guardar un atraso

    let params = req.body,
        saveData   = {
            student_id: params.student_id,
            course_id   : params.course_id,
            school_id   : req.user.sub,
            date     : new Date(params.date),
            detail   : params.detail
        }

        if(!params.student_id)
        {
            res.status(500).json({ message: "Debe escoger un estudiante para registrar un atraso" })
        }
        else
        {
            models.Delay.create(saveData).then(delaydStored => {    
                res.status(200).send({ delay: delaydStored })
            }).catch(err =>  {
                console.log(err)
                res.status(500).json({ message: "Ha ocurrido un error al guardar el retiro"})
            })
        }
            
}

function listStudentDelayStored(req,res)
{
    /* =========================================================================================================
                    Función para listar los atrasos, se filtran por el id del estudiante
       ========================================================================================================= */

    models.Delay.findAll({ where: {course_id: req.params.id, school_id: req.user.sub },
        include: [{
            model: models.Student,
            as   : 'estudiante',
            include:[{
                model: models.Responsable,
                as   : 'responsable'
            }] 
        }]
    }).then(delay =>{
        res.status(200).send(delay);
    }).catch(err =>{ 
        console.log(err)
        res.status(500).send({ message: 'Error en la ejecución de la busqueda de retiros' })
    })
}

function listEvents(req,res)
{

    /* =========================================================================================================
            Función para listar los eventos de un curso , se filtran los eventos por el id del curso
            Se debe pasar el id del curso como parametro
       ========================================================================================================= */

    models.Event.findAll({ where:{ course_id: req.params.id, school_id: req.user.sub} }).then(result =>{
        res.json(result)  
    }).catch(err => res.status(500).json({ message: "Ha ocurrido un error buscando los eventos registrados"}))
}


function saveEvent(req,res)
{
    // función para guardar un Evento

    let params = req.body,
        date = new Date(params.date),
        saveData   = {
            course_id   : params.course_id,
            date     : date,
            detail   : params.detail,
            school_id   : req.user.sub 
        }

        models.Event.create(saveData).then( eventStored => {
            res.json({event : eventStored})
        }).catch( err => res.status(500).json({ message: "Ha ocurrido un error al guardar un evento"}) )
}

module.exports = {
    getAllCourses,
    getCourse,
    masiveAssingStudentNote,
    listStudent,
    saveStudentAnnotation,
    listStudentAnnotation,
    listStudentRetire,
    saveStudentRetire,
    listStudentRetireStored,
    listStudentDelay,
    saveStudentDelay,
    listStudentDelayStored,
    listEvents,
    saveEvent
}