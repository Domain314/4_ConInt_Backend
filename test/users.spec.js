const request = require('supertest');
const express = require('express');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { expect } = chai;
chai.use(sinonChai);

const db = require('../db/db');
const todosRouter = require('../routes/todos');
const usersRouter = require('../routes/users');

describe('Users', function () {
    let app;

    before(function () {
        app = express();
        app.use(express.json());
        app.use('/users', usersRouter);
    });

    afterEach(function () {
        sinon.restore();
    });

    it('should register a user', async function () {
        const newUser = { username: 'TestUser', password: 'TestPassword' };
        sinon.stub(db.models.user, 'create').resolves({ id: 1, ...newUser });

        const res = await request(app).post('/users/register').send(newUser);
        expect(res.status).to.equal(201);
        expect(res.body).to.deep.equal({ id: 1, ...newUser });
    });

    it('should login a user', async function () {
        const user = { username: 'TestUser', password: 'TestPassword' };
        sinon.stub(db.models.user, 'findOne').resolves({ id: 1, ...user });

        const res = await request(app).post('/users/login').send(user);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ id: 1, ...user });
    });

    it('should fail to login a nonexistent user', async function () {
        const user = { username: 'TestUser', password: 'TestPassword' };
        sinon.stub(db.models.user, 'findOne').resolves(null);

        const res = await request(app).post('/users/login').send(user);
        expect(res.status).to.equal(404);
    });
});
