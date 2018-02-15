'use strict'

// chalck aviso
var chalk = require('chalk');

// modelos
var models = require('../models');




function getStudentNote(req,res)
{
    const school = req.user.sub
    const course = req.query.course
    const subject = req.query.subject
    
    const filtroNotes = { school_id: school, course_id: course, subject_id: subject }
    const filtroStudent = {school, course}

    let promises = []
    let studentsWithoutNotes = []

    models.Notes.findAll({ where : filtroNotes, include : [{
            model: models.Student,
            as   : 'estudiantes'
        }] 
    }).then(resultNotes => {


        models.Student.findAll({ where: filtroStudent }).then(resultStudent => {

            resultStudent.forEach((student,index) => {                
                
                let validate = false

                promises.push(
                    resultNotes.forEach(function(nota,index1) {
                        
                        if(student.id === nota.student_id)
                        {
                            validate = true
                        }

                        if(index1 + 1 === resultNotes.length)
                        {
                            if(!validate)
                            {
                                studentsWithoutNotes.push(student)
                            }
                        }
                    })
                )
            })

            Promise.all(promises).then(resultPromise => {
                
                console.log('paso la promesa')

                if(resultNotes.length > 0)
                {
                    //res.json([studentsWithoutNotes, resultNotes])
                    res.json([studentsWithoutNotes,resultNotes])
                }
                else
                {
                    //let response = [resultStudent,resultNotes]
                    //res.json([resultStudent, resultNotes])
                    res.json([resultStudent,resultNotes])

                }

            }).catch( err => res.status(500).json({ message: "Error al ejecutar la promesa", err}))
                

        }).catch(err => res.status(500).json({ message: "Error al buscar los estudiantes", err}) )

    }).catch(err => res.status(500).json({ message: "Error al buscar las notas", err}) )
}

function masiveAssingStudentNote(req, res)
{
    // función para asignar notas masivamente por alumno
    const params = req.body
    const filtroNote = {school_id: req.user.sub, student_id: params.student, course_id: params.course, subject_id: params.subject}

    const arreglo_field = params.field.split('_')
    const fieldUpdate = arreglo_field[0]+"_"+params.period+"_"+arreglo_field[1]

    const prom_1 = "prom_1";
    const prom_2 = "prom_2";

    models.Notes.findOne({ where : filtroNote }).then(notesResult => {
        if(notesResult)
        {
            let notanota = updateProm(notesResult,params.period,fieldUpdate,params.note)

            let promUpdate = 'prom_'+params.period

            models.Notes.update({ [fieldUpdate] : params.note, [promUpdate]: notanota }, {where: filtroNote}).then(noteUpdate => {
                res.json({})
            }).catch(err => res.status(500).json({ message: "Ha ocurrido un error al actualizar la notas"}) )
        }
        else
        {
            filtroNote[fieldUpdate] = params.note
            filtroNote[prom_1] = params.note / 12;
            filtroNote[prom_1] = filtroNote[prom_1].toFixed(1)

            models.Notes.create(filtroNote).then(noteCreate => {
                if(noteCreate)
                {
                    res.json({})
                }
            }).catch( err => res.status(500).json({ message: "Ha ocurrido un error al crear la nota"}) )
        }
    })

}

function updateProm(notas,periodo, campo,valor)
{
    
    // función para actualizar los promedios de las notas
    let notanota = 0;
    let validate = false;
    valor = parseFloat(valor)
            
    if (periodo == 1){

          Object.keys(notas.dataValues).forEach((ele,index) => {
            
            if(ele.indexOf('note_1') !== -1)
            {
 
                if(ele === campo)
                {
                    notanota += valor
                }
                else
                {
                    notanota += notas[ele] ? notas[ele] : 0
                }
            }

          })
    }
    else
    {
        Object.keys(notas).forEach((ele,index) => {

            if(ele.indexOf('note_2') !== -1)
            {
                if(ele === campo)
                {
                    notanota += valor
                }
                else
                {
                    notanota += notas[ele] ? notas[ele] : 0
                }
            }
          })   
    }
    
    notanota = notanota / 12
    notanota = notanota.toFixed(1)
    
    return notanota
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
    saveEvent,
    getStudentNote
}