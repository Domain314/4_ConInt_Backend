const request = require('supertest');
const express = require('express');
const chai = require('chai');
const assert = chai.assert;

describe('app', function () {
    var app = express();
    var todosRouter = express();

    todosRouter.get('/', function (req, res) {
        res.end('todos');
    });

    it('should emit "mount" when todosRouter is mounted', function (done) {
        todosRouter.on('mount', function (arg) {
            assert.strictEqual(arg, app);
            done();
        });

        app.use('/todos', todosRouter);
    });

    describe('.use(todosRouter)', function () {
        it('should mount the todosRouter', function (done) {
            request(app)
                .get('/todos')
                .expect('todos', done);
        });
    });

    it('should set the todosRouter\'s .parent', function () {
        assert.strictEqual(todosRouter.parent, app);
    });

    it('should handle 404', function (done) {
        request(app)
            .get('/not-existing-route')
            .expect(404, done);
    });

    it('should handle errors', function (done) {
        const errorRouter = express();

        errorRouter.get('/', function (req, res) {
            throw new Error('Test error');
        });

        app.use('/error-route', errorRouter);

        request(app)
            .get('/error-route')
            .expect(500, done);
    });
});
