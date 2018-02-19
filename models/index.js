var Sequelize = require('sequelize'); 

const sequelize = new Sequelize("pronota0003","postgres","123456", {    
dialect: 'postgres'
});


//const sequelize = new Sequelize('postgres://localhost:5434/pronota_prueba/123456');


const models = {
	Profile: sequelize.import('./profile'),
	Teaching: sequelize.import('./teaching'),
	Client: sequelize.import('./client'),
	User: sequelize.import('./user'),
	Responsable: sequelize.import('./responsable'),
	Course: sequelize.import('./course'),
	Teacher: sequelize.import('./teacher'),
	Subject: sequelize.import('./subject'),
	Student: sequelize.import('./student'),
	Template: sequelize.import('./template'),
	CourseCode: sequelize.import('./course-code'),
	Setting: sequelize.import('./setting'),
	SettingWorker: sequelize.import('./settingworker'),
	Worker: sequelize.import('./worker'),
	TotalSms: sequelize.import('./totalSms'),
	ListSms : sequelize.import('./listSms'),
	Sms     : sequelize.import('./sms'),
	ListSmsWorker : sequelize.import('./listSmsWorker'),
	SmsWorker : sequelize.import('./smsWorker'),
	Annotation : sequelize.import('./annotation'),
	Retire  : sequelize.import('./retire'),
	Delay  : sequelize.import('./delay'),
	Event  : sequelize.import('./event'),
	Notes  : sequelize.import('./notes'),
	Bloque  : sequelize.import('./bloque'),
	Horariomanana  : sequelize.import('./horariomanana'),
	Horariotarde  : sequelize.import('./horariotarde'),
	Horarionoche  : sequelize.import('./horarionoche'),
	Departament  : sequelize.import('./departament')
}; 


Object.keys(models).forEach((modelName) => {

if('associate' in models[modelName]) {

	models[modelName].associate(models);
}
});


models.sequelize = sequelize;
models.Sequelize = sequelize;

models.Op = Sequelize.Op

module.exports = models;
