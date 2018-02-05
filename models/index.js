var Sequelize = require('sequelize');

const sequelize = new Sequelize("pronota","postgres","123456", { 
dialect: 'postgres'
});



const models = {
	User: sequelize.import('./user'),
	Client: sequelize.import('./client'),
	Responsable: sequelize.import('./responsable'),
	Profile: sequelize.import('./profile'),
	Course: sequelize.import('./course'),
	Teacher: sequelize.import('./teacher'),
	Student: sequelize.import('./student'),
	Teaching: sequelize.import('./teaching'),
	Template: sequelize.import('./template'),
	CourseCode: sequelize.import('./course-code'),
	Setting: sequelize.import('./setting'),
	SettingWorker: sequelize.import('./settingworker'),
	Worker: sequelize.import('./worker'),
	TotalSms: sequelize.import('./totalSms'),
	ListSms : sequelize.import('./listSms'),
	Sms     : sequelize.import('./sms'),
	ListSmsWorker : sequelize.import('./listSmsWorker'),
	SmsWorker     : sequelize.import('./smsWorker')
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
