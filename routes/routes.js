'use strict'

var express = require('express');
var multer = require('multer');
var upload = multer({ dest: './excel_import/' });
var images = multer({ dest: "./public/uploads/" });

var UserController = require('../controllers/user');
var ClientController = require('../controllers/client');
var CourseController = require('../controllers/course');
var ProfileController = require('../controllers/profile');
var TeacherController = require('../controllers/teacher');
var StudentController = require('../controllers/student');
var TemplateController = require('../controllers/template');
var TeachingController = require('../controllers/teaching');

var WorkerController = require('../controllers/worker');
var CourseCodeController = require('../controllers/course-code');

var SettingController = require('../controllers/setting');

/*
var SubjectController = require('../controllers/subject');

var StudentExcelController = require('../controllers/studentExcel');
var CourseManagementController = require('../controllers/courseManagement');

var NotificationController = require('../controllers/notification')
var ResponsableController = require('../controllers/responsable');
*/
var SmsController = require('../controllers/sms');


var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

// User
api.post('/login', UserController.login); //pruebas


/*
api.post('/sendSmsMasiveApi', mdAuth.ensureAuth,UserController.sendSmsMasiveNewApi); // envio masivo de sms
api.post('/sendSmsMasive', mdAuth.ensureAuth,UserController.sendSmsMasive); // envio masivo de sms
api.post('/sendSmsSingle', mdAuth.ensureAuth,UserController.sendSmsSingle); // envio de sms de un solo responsable
api.post('/save-user', mdAuth.ensureAuth,UserController.saveUser);

*/

api.post('/user', mdAuth.ensureAuth,UserController.getUsers);
api.post('/save-user', mdAuth.ensureAuth, UserController.saveUser);
api.put('/user/:id', mdAuth.ensureAuth, UserController.putUser);

/*
api.put('/user/:id', mdAuth.ensureAuth,UserController.putUser);
api.get('/overwritePass', mdAuth.ensureAuth,UserController.overwritePass) // ruta para llevar los datos del usuario(responsable) a la vista de validate pass por primera vez que hizo session
*/
api.post('/overwritePass', mdAuth.ensureAuth,UserController.overwritePass) // ruta para sobreescribir el pass que se le pone al responsable por defecto cuando es creado su user y validar que hizo session por primera vez
api.post('/recoveryPassword', mdAuth.ensureAuth,UserController.recoveryPassword)

/*
// Course
api.get('/course', mdAuth.ensureAuth,CourseController.getCourses);
api.post('/course', mdAuth.ensureAuth,CourseController.saveCourse);
api.put('/course/:id', mdAuth.ensureAuth,CourseController.updateCourse);
/*
api.get('/course/:id', mdAuth.ensureAuth,CourseController.getCourse);
api.get('/course/searchSchool/:idSchool', mdAuth.ensureAuth,CourseController.getCourseSchool);

// Course assign or remove School
api.post('/course/:idCourse/school', mdAuth.ensureAuth,CourseController.saveCourseSchool);
api.delete('/course/:idCourse/school', mdAuth.ensureAuth,CourseController.deleteCourseSchool);

// Course assign or remove student to course
api.post('/course/:idCourse/student', mdAuth.ensureAuth,CourseController.saveCourseStudent);
api.put('/course/:idCourse/student', mdAuth.ensureAuth,CourseController.deleteCourseStudent);

// Course assign or remove subject to course
api.post('/course/:idCourse/subject', mdAuth.ensureAuth,CourseController.saveCourseSubject);
api.delete('/course/:idCourse/subject', mdAuth.ensureAuth,CourseController.deleteCourseSubject);


*/
// Teacher
api.put('/teacher/:id', mdAuth.ensureAuth,TeacherController.updateTeacher);
api.post('/teacher', mdAuth.ensureAuth,TeacherController.saveTeacher);
api.get('/teacher', mdAuth.ensureAuth,TeacherController.getTeachers);

// Worker
api.put('/worker/:id', mdAuth.ensureAuth,WorkerController.updateWorker);
api.delete('/worker/:id', mdAuth.ensureAuth,WorkerController.deleteWorker);
api.post('/worker', mdAuth.ensureAuth,WorkerController.saveWorker);
api.get('/worker', mdAuth.ensureAuth,WorkerController.getWorkers);




// Teaching

api.post('/teaching', mdAuth.ensureAuth,TeachingController.saveTeaching);
api.get('/teaching', mdAuth.ensureAuth,TeachingController.getTeachings);




// CourseCode
api.post('/course-code', mdAuth.ensureAuth,CourseCodeController.saveCourseCode);
api.get('/course-code', mdAuth.ensureAuth,CourseCodeController.getCourseCode);



// Client

api.get('/client', mdAuth.ensureAuth,ClientController.getClients);
api.post('/client', mdAuth.ensureAuth,ClientController.saveClient);
api.put('/client/:id', mdAuth.ensureAuth,ClientController.updateClient);

/*





api.post('/client/:idClient/setting', mdAuth.ensureAuth,ClientController.saveClientSetting);
api.post('/client/:idClient/school', mdAuth.ensureAuth,ClientController.saveClientSchool);


*/

// Profile
api.post('/profile', mdAuth.ensureAuth,ProfileController.saveProfile);
api.get('/profile', mdAuth.ensureAuth,ProfileController.getProfiles);


/*
// Subject
api.get('/subject', mdAuth.ensureAuth,SubjectController.showAllSubjects)
api.post('/subject', mdAuth.ensureAuth,SubjectController.saveSubject)
api.get('/subject/:id', mdAuth.ensureAuth,SubjectController.getSubject)
api.put('/subject/:id', mdAuth.ensureAuth,SubjectController.updateSubject)
api.delete('/subject/:id', mdAuth.ensureAuth,SubjectController.deleteSubject)

*/
// Template
api.get('/template', mdAuth.ensureAuth,TemplateController.getAllTemplates)
api.post('/template', mdAuth.ensureAuth,TemplateController.saveTemplate)

/*

api.get('/template/:id', mdAuth.ensureAuth,TemplateController.getTemplate)
api.put('/template/:id', mdAuth.ensureAuth,TemplateController.updateTemplate)


/*
// Student 
api.get('/student_download',StudentExcelController.donwloadFile)
api.post('/student_import',mdAuth.ensureAuth,upload.single('file_excel'),StudentExcelController.masiveAssing)

*/
api.get('/student', mdAuth.ensureAuth,StudentController.getAllStudent) //Ruta para ver todos los estudiantes

api.get('/student/:client', mdAuth.ensureAuth,StudentController.getAllStudentClient) //Ruta para ver todos los estudiantes filtrados por el id de una escuela

/*
api.get('/student/responsable/:idResponsable', mdAuth.ensureAuth,StudentController.showStudentByResponsable) // mostrar estudiantes asociados a aponderados
api.get('/student/allData/:idStudent', mdAuth.ensureAuth,StudentController.showAllDataStudent) // mostrar todos los datos asociados a un estudiante
api.get('/student_floating', mdAuth.ensureAuth,StudentController.getAllStudentWithoutCourse) // ruta para ver los estudiantes sin cursos
api.get('/student/:id', mdAuth.ensureAuth,StudentController.getStudent) // Ruta para buscar un estudiante
api.post('/student', mdAuth.ensureAuth,StudentController.saveStudent) // Ruta para guardar los estudiantes
api.put('/student/:id', mdAuth.ensureAuth,StudentController.updateStudent) // Ruta para actualizar un estudiante
api.delete('/student/:id', mdAuth.ensureAuth,StudentController.deleteStudent) // Ruta para eliminar un estudiante
api.get('/student/countstudentbyschool/:idSchool', mdAuth.ensureAuth,StudentController.countStudentBySchool) //contar estudiantes de una escuela
*/

// Setting
api.get('/setting', mdAuth.ensureAuth, SettingController.showAllSettings)
api.post('/setting', mdAuth.ensureAuth, images.single('logo'), SettingController.saveSetting)
api.put('/setting/:id',mdAuth.ensureAuth, images.single('logo'), SettingController.updateSetting)
api.get('/setting/onlyDateLimit', mdAuth.ensureAuth, SettingController.getDateLimitConfig) //obtener solo el limite de fecha de configuracion

/*
// Course Management
api.get('/courseManagement', mdAuth.ensureAuth,CourseManagementController.getAllCourses) // Ruta para buscar todos los cursos
api.put('/courseManagement/:id', mdAuth.ensureAuth,CourseManagementController.masiveAssingStudentNote) // Ruta para almacenar masivamente las notas
api.get('/courseManagement/:id', mdAuth.ensureAuth,CourseManagementController.getCourse) // Ruta para buscar un curso con todos los populate
api.get('/courseManageAnnotation/:id', mdAuth.ensureAuth,CourseManagementController.listStudent) // Ruta para listar todos los alumnos del curso para las anotaciones
api.post('/courseManageAnnotation', mdAuth.ensureAuth,CourseManagementController.saveStudentAnnotation) // Ruta para almacenar una anotación
api.get('/courseManageAnnotationStored/:id', mdAuth.ensureAuth,CourseManagementController.listStudentAnnotation) // Ruta para listar todas las anotaciones de un alumno
api.get('/courseManageRetire/:id', mdAuth.ensureAuth,CourseManagementController.listStudentRetire) // Ruta para listar todos los alumnos del curso para los retiros
api.post('/courseManageRetire', mdAuth.ensureAuth,CourseManagementController.saveStudentRetire) // Ruta para almacenar un retiro
api.get('/courseManageRetireStored/:id', mdAuth.ensureAuth,CourseManagementController.listStudentRetireStored) // Ruta para listar todas los retiros de un alumno
api.get('/courseManageDelay/:id', mdAuth.ensureAuth,CourseManagementController.listStudentDelay) // Ruta para listar todos los alumnos del curso para los atrasos
api.post('/courseManageDelay', mdAuth.ensureAuth,CourseManagementController.saveStudentDelay) // Ruta para guardar un atraso
api.get('/courseManageDelayStored/:id', mdAuth.ensureAuth,CourseManagementController.listStudentDelayStored) // Ruta para listar todos los atrasos por alumno
api.get('/courseManageEvent/:id', mdAuth.ensureAuth,CourseManagementController.listEvents) // Ruta para listar todos los eventos de un curso
api.post('/courseManageEvent', mdAuth.ensureAuth,CourseManagementController.saveEvent) // Ruta para guardar un evento

api.get('/responsable', mdAuth.ensureAuth,ResponsableController.getResponsables);
api.post('/responsable', mdAuth.ensureAuth,ResponsableController.saveResponsable);

// Notifications 
api.get('/course_notifications/:id', mdAuth.ensureAuth,NotificationController.getData) // se buscan los estudiantes del curso
api.get('/get_notifications/:id', mdAuth.ensureAuth,NotificationController.getNotifications) // buscar las notificaciones*/

// Sms
api.get('/countsmsbyschool/:idSchool', mdAuth.ensureAuth,SmsController.countSmsBySchool) 
api.get('/listStoredMessage/:course', mdAuth.ensureAuth,SmsController.listSmsStored)

api.get('/listSmsMonth',mdAuth.ensureAuth, SmsController.listSmsLastMoth)
api.get('/listSmsWeek',mdAuth.ensureAuth, SmsController.listSmsLastWeek)
api.get('/logSmsStored',mdAuth.ensureAuth, SmsController.logSmsStored)
api.get('/smsTotalM-W',mdAuth.ensureAuth, SmsController.smsMonthWeekTotal)
api.get('/smsBySchool/:id',mdAuth.ensureAuth,SmsController.smsDetailsBySchool)
api.get('/smsStatusLabs', SmsController.recieveStatusSms)
api.get('/smsNotConfirm', SmsController.listSmsWeekAndMonthNotConfirm)


module.exports = api;