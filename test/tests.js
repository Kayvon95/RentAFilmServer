/**
 * Created by Kjuan on 16-6-2017.
 */
var chai = require('chai');
var chaiHTTP = require('chai-http');
var server = require('../server.js');
var should = chai.should();

chai.use(chaiHTTP);

describe('API TEST', function () {
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