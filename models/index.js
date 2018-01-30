var Sequelize = require('sequelize');

const sequelize = new Sequelize("pronotas_2018","postgres","123456", {
dialect: 'postgres'
});

const models = {
User: sequelize.import('./user'),
Client: sequelize.import('./client'),
//Responsable: sequelize.import('./responsable'),
Profile: sequelize.import('./profile'),

};

Object.keys(models).forEach((modelName) => {

if('associate' in models[modelName]) {

	models[modelName].associate(models);
}
});

models.sequelize = sequelize;
models.Sequelize = sequelize;

module.exports = models;
