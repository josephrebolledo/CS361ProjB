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
    var pw = 'password!';
    var db = 'cs361';
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
  
});

app.get('/getquestions',function(req,res){
    var conn = getConn();
    var rs = '{"data" : ';
   // var context = {};

    conn.query({
	sql: 'SELECT * FROM `problem` WHERE `id` = (SELECT MIN(`id`) FROM ' +
	    '`problem` WHERE `id` NOT IN (SELECT `problem_id` FROM `user_progress`))',
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

app.get('/submitanswer', (req, res)=> {
    var data = processData(req);
    var id =  data.qParams.id;
    var correct = data.qParams.correct;


    var conn = getConn();
 
    conn.query({
	sql: 'INSERT INTO `user_progress` (`user_id`, `problem_id`, `passed`, `attempt_date`) VALUES (1,' + id + ', "' + correct + '", NOW())' +
	    ' ON DUPLICATE KEY UPDATE `passed`="'+correct+
	    '", `attempt_date`=NOW()',
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


    
});

app.get('/questions', (req, res)=> {
  res.render('questions');
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
