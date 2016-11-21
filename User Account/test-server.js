	var chai = require('chai');
	var expect = chai.expect;
	var should = chai.should();
	var chaiHTTP = require('chai-http');
	var server = require('../server.js');

	chai.use(chaiHTTP);

	function getConn() {

	    var mysql = require('mysql');
	    var hostname = 'localhost';
	    var username = 'root';
	    var pw = '111';
	    var db = 'cs361';
		//var hostname = 'oniddb.cws.oregonstate.edu';
	    //var username = 'englandt-db';
	    //var pw = '***';
	    //var db = 'englandt-db';
	    var conn = mysql.createConnection({
		host : hostname,
		user : username,
		password : pw,
		database : db
	    });
	    console.log("attempting to connect to: " + db);
	    try {
		conn.connect();
		} catch(err) {
		console.log(err);
		return null;
	    }
	   // conn.end();
	    return conn;
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

	describe('get DB Conn', function() {
	   it('should return database connection object', function(done) {
	       server.getConn()
		   .should.be.an('object');
	       done();
	   });
	});

	describe('GET Account', function() {
	    it('Should render account page', function(done) {
		chai.request(server.app)
		    .get('/account')
		    .end(function(err, res) {
			    expect(200, done());
		    });
	    });
	});


	describe('POST Account', function() {
	  it('Should post to the user database', function(done) {

		var conn = getConn();
	  	conn.query({
		sql: "DELETE FROM `user` WHERE `first_name` = 'Test' AND `last_name` = 'Test'",
		timeout: 40000 //40s
		//values: ['value']
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

