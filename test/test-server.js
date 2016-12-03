var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var chaiHTTP = require('chai-http');
var server = require('../server.js');
var assert = require('assert');
//could not get the following to recognize jQuery $ so I'm having to manually add 
//shuffle function
//require('jsdom-global')(); // This is necessary for testing jQuery in Mocha
//var $ = require('../public/js/jquery-3.1.0.min.js')(window);
//var questions = require('../public/js/questions.js');

chai.use(chaiHTTP);

//Tanner Tests
describe('shuffle function tester', function(){
	it('should return a shuffled array', function(done){
		var testArray = [1, 2, 3, 4, 5];
		var copy = testArray.slice(0);
		var res = shuffle(copy);
		assert.notEqual(res, testArray);
		assert.equal(testArray.length, res.length);
		done();
	});
});


function shuffle(a) {
    var currentIndex = a.length;
    var tempVal, randomIndex;

    while(0 != currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -=1;
		tempVal = a[currentIndex];
		a[currentIndex] = a[randomIndex];
		a[randomIndex] = tempVal;
    }
    return a;
}

describe('GET home', function() {
    it('should render home page', function(done) {
	chai.request(server.app)
	    .get('/home')
	    .end(function(err, res) {
		    expect(200, done());
	    });
    });
});

describe('GET second home', function() {
    it('should render home page', function(done) {
	chai.request(server.app)
	    .get('/')
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

describe('GET parser verification', function() {
   it('should return array of GET objects', function(done) {
       server.processData({'method': 'GET', 
							'query': {'test' : 'function', 'test2' : 'function2'}
	   }).should.be.an('object');
       done();
   });
});

describe('get problems page', function() {
    it('Should render problems page', function(done) {
      chai.request(server.app)
        .get('/problems')
        .end(function(err, res) {
          expect(200, done());
        });
    });
});

describe('get next question based on student id', function(){
  it('should retrieve and return next question from DB', function(done){
    chai.request(server.app)
      .get('/getquestions?poo=2')
      .end(function(err,res){
        expect(err).to.be.null;
		expect(res).to.be.an('object');
      });
	  done();
  });
});

describe('student answer submission', function(){
  it('should update DB with student answer', function(done){
    chai.request(server.app)
      .get('/submitanswer?id=1&correct=1&user=1')
      .end(function(err,res){
        expect(err).to.be.null;
		expect(res).to.be.an('object', done());
      });
  });
});

//Ben Ford Tests
describe('get teacher dashboard page',function(){
    it('should return the teacher dashboard page', function(done){
        chai.request(server.app)
            .get('/teacherDash&poo=1')
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
                //console.log(error);
                res.send('{}');
              }
              else {
                //console.log("Connected to DB");
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
            //res.text.should.equal('User successfully created');
            done();
        });
    });
});

//Test if the form result page is getting response
describe('Get Response', function() {
    it('Should get response from the account page', function(done) {
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
        chai.request(server.app)
        .get('/account')
        .end(function(err, res){
        //console.log(res);
            res.should.have.status(200);
            res.headers['content-type'].should.equal('text/html; charset=utf-8');
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

