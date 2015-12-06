var assert = require('assert');
var request = require('supertest');

describe('Basic GET Test', function () {
    var server;
    beforeEach(function () {
        server = require('./server');
    })
    afterEach(function () {
        server.close();
    })
    it('responds to /', function (done) {
        request(server)
            .get('/')
            .expect(200, done);
    })
    it('responds to /register', function (done) {
        request(server)
            .get('/register')
            .expect(200, done);
    })
    it('responds to /login', function (done) {
        request(server)
            .get('/login')
            .expect(200, done);
    })
})

describe('User Register and Delete Test', function () {
    var server;
    before(function () {
        server = require('./server');
    })
    after(function () {
        server.close();
    })

    it('should register a user', function (done) {
        request(server)
            .post('/register')
            .send({ uname: "user@gmail.com", upwd: "123456" })
            .expect(200, done);
    })

    it('should delete a user', function (done) {
        request(server)
            .post('/user@gmail.com/delete')
            .expect(200, done);
    })

})


describe('User login and GET Test', function () {
    var server;
    var cookie;
    before(function (done) {
        server = require('./server');
        request(server)
           .post('/register')
           .send({ uname: "user@gmail.com", upwd: "123456" })
           .expect(200, done);

    })
    after(function (done) {
        request(server)
             .post('/user@gmail.com/delete')
             .expect(200)
             .end(function (err, res) {
                 server.close();
                 done();
             });

    })

    it('user login', function (done) {
        request(server)
            .post('/login')
            .send({ uname: "user@gmail.com", upwd: "123456" })
            .expect(200)
            .end(function (err, res) {
                cookie = res.headers['set-cookie'].pop().split(';')[0];
                done();
            });
    })
    it('responds to /user@gmail.com/home', function (done) {
        var req = request(server).get('/user@gmail.com/home')
        req.cookies = cookie;
        req.set('Accept', 'application/json')
            .expect(200, done);
    })
    it('responds to /user@gmail.com/profile', function (done) {
        var req = request(server).get('/user@gmail.com/profile')
        req.cookies = cookie;
        req.set('Accept', 'application/json')
            .expect(200, done);
    })
    it('responds to /user@gmail.com/edit', function (done) {
        var req = request(server).get('/user@gmail.com/edit')
        req.cookies = cookie;
        req.set('Accept', 'application/json')
            .expect(200, done);
    })
    it('responds to /user@gmail.com/share', function (done) {
        var req = request(server).get('/user@gmail.com/share')
        req.cookies = cookie;
        req.set('Accept', 'application/json')
            .expect(200, done);
    })
    it('responds to /user@gmail.com/library', function (done) {
        var req = request(server).get('/user@gmail.com/library')
        req.cookies = cookie;
        req.set('Accept', 'application/json')
            .expect(200, done);
    })
    it('responds to /user@gmail.com/message', function (done) {
        var req = request(server).get('/user@gmail.com/message')
        req.cookies = cookie;
        req.set('Accept', 'application/json')
            .expect(200, done);
    })

})



describe('User Book Share Test', function () {
    var server;
    var cookie;
    var book;
    before(function (done) {
        server = require('./server');
        request(server)
           .post('/register')
           .send({ uname: "user@gmail.com", upwd: "123456" })
           .expect(200)
           .end(function (err, res) {
               request(server)
                 .post('/login')
                .send({ uname: "user@gmail.com", upwd: "123456" })
                .expect(200)
                .end(function (err, res) {
                    cookie = res.headers['set-cookie'].pop().split(';')[0];
                    done();
                });
           })


    })
    after(function (done) {
        request(server)
             .post('/user@gmail.com/delete')
             .expect(200)
             .end(function (err, res) {
                 server.close();
                 done();
             });

    })
    it('should share a book', function (done) {
        request(server)
            .post('/user@gmail.com/share')
            .send({ title: "book", author: "xxx", description: "new book" })
            .field('Content-Type', 'multipart/form-data')
            .attach('picture', './imagesdefault.jpg')
            .expect(302, done);
    })
})


describe('User Admin Unadmin Change Profile and Password Test', function () {
    var server;
    var cookie;
    before(function (done) {
        server = require('./server');
        request(server)
           .post('/register')
           .send({ uname: "user1@gmail.com", upwd: "123456" })
           .expect(200)
           .end(function (err, res) {
               server = require('./server');
               request(server)
                  .post('/register')
                  .send({ uname: "user2@gmail.com", upwd: "123456" })
                  .expect(200)
                  .end(function (err, res) {
                      request(server)
                      .post('/login')
                      .send({ uname: "user1@gmail.com", upwd: "123456" })
                      .expect(200)
                      .end(function (err, res) {
                          cookie = res.headers['set-cookie'].pop().split(';')[0];
                          done();
                      })

                  });
           })


    })
    after(function (done) {
        request(server)
             .post('/user2@gmail.com/delete')
             .expect(200)
             .end(function (err, res) {
                 request(server)
                 .post('/user1@gmail.com/delete')
                 .expect(200)
                 .end(function (err, res) {
                     server.close();
                     done();
                 });
             });

    })
    it('should change profile', function (done) {
        request(server)
            .post('/user1@gmail.com/profile')
            .send({ display_name: "user1", description: "hi" })
            .expect(200, done);
    })
    it('should change password', function (done) {
        request(server)
            .post('/user1@gmail.com/password')
            .send({ current_password: "123456", new_password: "654321" })
            .expect(200, done);
    })
    it('should assign admin', function (done) {
        request(server)
            .post('/user2@gmail.com/admin')
            .expect(200, done);
    })
    it('should unassign admin', function (done) {
        request(server)
            .post('/user2@gmail.com/unadmin')
            .expect(200, done);
    })

})


describe('User Message Test', function () {
    var server;
    var cookie;
    before(function (done) {
        server = require('./server');
        request(server)
           .post('/register')
           .send({ uname: "user1@gmail.com", upwd: "123456" })
           .expect(200)
           .end(function (err, res) {
               request(server)
                  .post('/register')
                  .send({ uname: "user2@gmail.com", upwd: "123456" })
                  .expect(200)
                  .end(function (err, res) {
                      request(server)
                      .post('/login')
                      .send({ uname: "user1@gmail.com", upwd: "123456" })
                      .expect(200)
                      .end(function (err, res) {
                          cookie = res.headers['set-cookie'].pop().split(';')[0];
                          request(server)
                         .get('/user1@gmail.com/message/user2@gmail.com')
                          done();
                      })

                  });
           })


    })
    after(function (done) {

        request(server)
             .post('/user2@gmail.com/delete')
             .expect(200)
             .end(function (err, res) {
                 request(server)
                 .post('/user1@gmail.com/delete')
                 .expect(200)
                 .end(function (err, res) {
                     server.close();
                     done();
                 });
             });

    })

    it('should send a message', function (done) {
        request(server)
            .post('/user1@gmail.com/message/user2@gmail.com')
            .send({ text: "hi" })
            .expect(200, done);
    })
})

