var Sequelize = require('sequelize');

const sequelize = new Sequelize("pronota_2019","postgres","admin123", {
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
Worker: sequelize.import('./worker'),
Sms: sequelize.import('./sms'),
TotalSms: sequelize.import('./totalSms'),

}; 

Object.keys(models).forEach((modelName) => {

if('associate' in models[modelName]) {

	models[modelName].associate(models);
}
});

models.sequelize = sequelize;
models.Sequelize = sequelize;

module.exports = models;
