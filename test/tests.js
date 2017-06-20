/**
 * Created by Kjuan on 16-6-2017.
 */

process.env.NODE_ENV = 'test';
process.env.APP_USERNAME = 'username';
process.env.APP_PASSWORD = 'password';

var chai = require('chai');
var chaiHTTP = require('chai-http');
var sinon = require('sinon');
var server = require('../server.js');
var should = chai.should();

chai.use(chaiHTTP);

var getToken = function() {
    var customer = {
        email: "m@ail.com",
        password: "meel"
    };
    chai.request(server)
        .post('/api/v1/login')
        .send(customer)
        .end(function(err, res) {
            res.body.should.be.an('object');
            res.body.should.have.property('token');
            // Bewaar het token in de globale variabele, zodat de tests het token kunnen gebruiken.
            token = res.body.token;
            console.log(token);
        });
};

describe('API TEST - Get a valid token', function() {

    // Zorg dat we een token hebben zodat we de tests kunnen uitvoeren.
    before(function() {
        getToken();
    });

    // Hier start een testcase
    it('should return a valid token', function(done) {
        chai.request(server)
            .get('/api/v1/login')
            .set('Content-Type', 'Application/json')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                // we doen hier niets - we willen alleen het token dat opgehaald is.
                done();
            });
    });
});

describe('API TEST', function () {

    before(function() {
        if (!this.token) {
            getToken();
        }
    });

    it('Test POST /api/v1/register', function(done){
      chai.request(server)
          .post('/api/v1/register')
          .end(function(err,res){
             res.should.have.status(200);
             res.body.should.be.a('object');
             done();
          });
   });
});

describe('API Test', function() {

    before(function() {
        getToken();
    });


    it('Test GET /api/v1/films/1', function(done) {
        chai.request(server)
            .get('/api/v1/films/1')
            .end(function(err, res) {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
            });
    });
});



describe('API TEST Login', function () {

    before(function() {
        getToken();
    });

    it('Test POST /api/v1/login', function(done){
        chai.request(server)
            .post('/api/v1/login')
            .set('Content-Type','application/json')
            .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrYXl2b25AcmFoaW1pLW1vcmFkLmFsaSJ9.mw70F-PhCoCyCJ2MbbDfATAJQjh6DRTJ1ghJjiVtxTE')
            .send({"email": "kayvon@rahimi-morad.ali", "password": "simpel123"})
            .expect(200)
            .expect('Content-Type', '/json/')
            .set('Authorization', 'Bearer ' + token)
            .expect(200, done);
    });
});