const { Sequelize } = require('sequelize');
require('dotenv').config();

const connUrl =
    process.env.DB_DIALECT + '://' +
    process.env.DB_USER + ':' +
    process.env.DB_PW + '@' +
    process.env.DB_HOST + '/' +
    process.env.DB_NAME;

const db = new Sequelize(connUrl);

const models = [
    require('../models/todo'),
    require('../models/user')
];

for (const model of models) {
    model(db);
}

for (const model in db.models) {
    if (db.models[model].associate) {
        db.models[model].associate();
    }
}

module.exports = db;
