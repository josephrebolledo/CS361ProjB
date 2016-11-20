//var conn = require('./mysqlConn.js');
var express = require('express');
var path = require('path');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//http://stackoverflow.com/questions/13395742/can-not-get-css-file
app.use(express.static(path.join(__dirname,'public')));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);


function processData(req) {
	var context = {};
	context.method = req.method; //method type saved
	context.qParams = []; //query parameters
	context.bParams = []; //body parameters
	
	for(var p in req.query) {
		context.qParams.push({	'name': p, 
			'value': req.query[p]
		});
	}
	context.qTotal = context.qParams.length;
	for(var p in req.body) {
		context.bParams.push({	'name': p,
			'value': req.body[p]
		});
	}
	context.bTotal = context.bParams.length;
	return context;
}

function getConn() {

    var mysql = require('mysql');
    var hostname = 'localhost';
    var username = 'root';
    var pw = 'shpongle1';
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


app.get('/home',function(req,res){
  res.render('home');
});

app.post('/', (req,res)=>{
  res.render('home');
});



app.get('/add_question', (req, res)=> {
    var conn = getConn();
    res.render('add_question');
});


app.get('/problems', (req, res)=> {
  res.render('questions');
});

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);
    // Pass to next layer of middleware
    next();
});

app.get('/getquestions',function(req,res){
    var conn = getConn();
    var rs = '{"data" : ';
   // var context = {};

    conn.query({
	sql: 'SELECT * FROM `problem` WHERE `id` = (SELECT MIN(`id`) FROM ' +
	    '`problem` WHERE `id` NOT IN (SELECT `problem_id` FROM `user_progress` WHERE `user_id`=1))',
	timeout: 40000 //40s
	//values: ['value']
    }, (error, results, fields)=> {
	if(error){
	    console.log(error);
	    res.send('{}');
	}
	else {
	    console.log("Connected to DB");
	    rs += JSON.stringify(results);
	    rs += '}';
	    console.log(rs);
	    res.send(rs);
	}
	
    });
    conn.end();
});

app.get('/add_question_do', function(req, res){
    var data = processData(req);
    console.log(data);
    var correctAnswer =  data.qParams[0].value;
    var incorrect1 = data.qParams[1].value;
    var incorrect2 = data.qParams[2].value;
    var incorrect3 = data.qParams[3].value;
    console.log(data);
    //var userQuery = 'INSERT INTO `problem` (`answer`, `incorrect_1`, `incorrect_2`, `incorrect_3`) VALUES ( ' + correctAnswer + ', ' + incorrect1 + ', ' + incorrect2 + ', ' + incorrect3 + ' );';
    var userQuery = "INSERT INTO `problem` (`answer`, `incorrect_1`, `incorrect_2`, `incorrect_3`) VALUES ( '" + correctAnswer + "', '" + incorrect1 + "', '" + incorrect2 + "', '" + incorrect3 + "' );" 
    console.log(userQuery);
    var conn = getConn();
  
    conn.query({
	sql: userQuery, 
	timeout: 40000 //40s
    }, (error, results, fields)=> {
	if(error){
	    console.log(error);
	    res.send('Error adding question');
	}
	else {
	    res.send('Successfully added: ' + correctAnswer + ' ' + incorrect1 + ' ' + incorrect2 + ' ' + incorrect3);
	    //res.send('{}');
	}
	
    });
    conn.end();
    
          
});

app.get('/query_word',function(req,res){
    var conn = getConn();
    var rs; //= '{"words" : ';
    conn.query({
	sql: 'SELECT word FROM `word`',
	timeout: 40000 //40s
    }, (error, results, fields)=> {
	if(error){
	    console.log(error);
	    res.send('{}');
	}
	else {
	    console.log("Connected to DB");
	    rs = JSON.stringify(results);
	    //rs += '}';
	    //console.log(rs);
	    res.send(rs);
	}
	
    });
    conn.end();
});

app.get('/submitanswer', (req, res)=> {
    var data = processData(req);
    var id =  data.qParams[0].value;
    var correct = data.qParams[1].value;
    console.log(data);
    var string = 'INSERT INTO `user_progress` (`user_id`, `problem_id`, `passed`, `attempt_date`) VALUES (1,' + id + ', ' + correct + ', NOW())' +
	    ' ON DUPLICATE KEY UPDATE `passed`='+ correct + ', `attempt_date`=NOW()';
    console.log(string);
    var conn = getConn();
  
    conn.query({
	sql: string,
	timeout: 40000 //40s
	//values: ['value']
    }, (error, results, fields)=> {
	if(error){
	    console.log(error);
	    res.send('{}');
	}
	else {
	    console.log("Connected to DB");
	    res.send('{}');
	}
	
    });
    conn.end();


    
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

exports.app = app;
exports.getConn = getConn;
exports.processData = processData;
