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

describe('get about page',function(){
    it('should return the about page', function(done){
        chai.request(server.app)
            .get('/about')
            .end(function(err,res){
                expect(200,done());
            });
    });
});


//Test if the user account page is rendered
describe('GET Account', function() {
    it('Should render account page', function(done) {
      chai.request(server.app)
        .get('/account')
        .end(function(err, res) {
          expect(200, done());
        });
    });
});

//Test if the user is able to create an acoount
describe('POST Account', function() {
    it('Should post to the user database', function(done) {
      var conn = server.getConn();
      conn.query({
        sql: "DELETE FROM `user` WHERE `first_name` = 'Test' AND `last_name` = 'Test'",
        timeout: 40000 
        }, (error, results, fields)=> {
              if(error){
                console.log(error);
                res.send('{}');
              }
              else {
                console.log("Connected to DB");
              } 
            });
      
      conn.end();
      chai.request(server.app)
        .post('/account')
        .send({'first_name': 'Test', 'last_name': 'Test', 'DOB': '2016-01-01', 
        'joinDate': '2016-12-12', 'email': 'test@test', 'phone': '111-111-1111', 
        'user_role_id':'1'})
        .end(function(err, res){
            res.should.have.status(200);
            res.headers['content-type'].should.equal('text/html; charset=utf-8');
            res.text.should.equal('User successfully created');
            done();
        });
    });
});

//Test add problem to database
describe('Add problem to database', function(){
  it('Should add a problem to the database', function(done){
    chai.request(server.app)
      .get('/add_question_do?answer=a&incorrect_1=to&incorrect_2=you&incorrect3=said')
      .end(function(err,res){
        expect(200,done());
      });
  });
});

