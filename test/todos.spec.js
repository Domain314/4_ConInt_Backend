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


describe('Todos', function () {
    let app;

    before(function () {
        app = express();
        app.use(express.json());
        app.use('/todos', todosRouter);
        app.use('/users', usersRouter);
    });

    afterEach(function () {
        sinon.restore();
    });

    it('should get all todos', async function () {
        const userId = 1;
        const todos = [{ id: 1, name: 'Test Todo', done: false, userId }];
        sinon.stub(db.models.todo, 'findAll').resolves(todos);

        const res = await request(app).get('/todos').query({ userId });
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(todos);
    });

    it('should create a todo', async function () {
        const userId = 1;
        const user = { id: userId, name: 'Test User' };
        const newTodo = { name: 'Test Todo', userId };
        sinon.stub(db.models.user, 'findByPk').resolves(user);
        sinon.stub(db.models.todo, 'create').resolves({ id: 1, ...newTodo, done: false });

        const res = await request(app).post('/todos').send(newTodo);
        expect(res.status).to.equal(201);
        expect(res.body).to.deep.equal({ id: 1, ...newTodo, done: false });
    });

    it('should update a todo to done', async function () {
        const todo = { id: 1, name: 'Test Todo', done: false };
        sinon.stub(db.models.todo, 'findByPk').resolves({
            ...todo,
            update: sinon.stub().resolves({ id: 1, name: 'Test Todo', done: true })
        });

        const res = await request(app).put('/todos/1/done');
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ id: 1, name: 'Test Todo', done: true });
    });

    it('should update a todo to undone', async function () {
        const todo = { id: 1, name: 'Test Todo', done: true };
        sinon.stub(db.models.todo, 'findByPk').resolves({
            ...todo,
            update: sinon.stub().resolves({ id: 1, name: 'Test Todo', done: false })
        });

        const res = await request(app).delete('/todos/1/done');
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ id: 1, name: 'Test Todo', done: false });
    });

});
