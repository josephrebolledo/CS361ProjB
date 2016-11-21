var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var chaiHTTP = require('chai-http');
var server = require('../server.js');

chai.use(chaiHTTP);

describe('GET home', function() {
    it('should render home page', function(done) {
	chai.request(server.app)
	    .get('/home')
	    .end(function(err, res) {
		    expect(200, done());
	    });
    });
});

describe('get DB Conn', function() {
   it('should return database connection object', function(done) {
       server.getConn()
	   .should.be.an('object');
       done();
   });
});

//Ben Ford Tests
describe('get teacher dashboard page',function(){
    it('should return the teacher dashboard page', function(done){
        chai.request(server.app)
            .get('/teacherDash')
            .end(function(err,res){
                expect(200,done());
            });
   });
});
