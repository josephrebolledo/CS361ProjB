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
    var pw = 'root';
    var port = '8889'
    var db = 'cs361';
    var conn = mysql.createConnection({
	host : hostname,
	user : username,
	password : pw,
    port: port,
	database : db
    });
    //console.log("attempting to connect to: " + db);
    try {
		conn.connect();
    } catch(err) {
		//console.log(err);
		return null;
    }
	conn.end();
    return conn;
}

app.get('/home',function(req,res){
  res.render('home');
});

app.post('/', (req,res)=>{
  res.render('home');
});

app.get('/add_question', (req, res)=> {
    res.render('add_question');
});

app.get('/problems', (req, res)=> {
    var conn = getConn();
	conn.query({
	sql: 'SELECT id, first_name, last_name FROM user WHERE user_role_id = 1',
	timeout: 40000 //40s
	//values: ['value']
    }, (error, results, fields)=> {
		if(error) {
			//console.log(error);
			res.status(500);
			res.render('500');
		} else {
			var context = {};
			context.students = [];
			for(var r in results) {
				context.students.push({
					'name': results[r].first_name + ' ' + results[r].last_name,
					'id': results[r].id
				});
			}
			res.render('questions', context);
		}
	});
	conn.end();
});

app.get('/getquestions',function(req,res){
    var data = processData(req);
	var id =  data.qParams[0].value;
	
	var conn = getConn();
    var rs = '{"data" : ';
   // var context = {};

    conn.query({
	sql: 'SELECT * FROM `problem` WHERE `id` = (SELECT MIN(`id`) FROM ' +
       '`problem` WHERE `id` NOT IN (SELECT `problem_id` FROM `user_progress` WHERE `user_id`='+ id +' AND `passed`=1))',
	timeout: 40000 //40s
	//values: ['value']
    }, (error, results, fields)=> {
		if(error){
			//console.log(error);
			res.send('{}');
		}
		else {
			//console.log("Connected to DB");
			rs += JSON.stringify(results);
			rs += '}';
			//console.log(rs);
			res.send(rs);
		}
    });
    conn.end();
});

app.get('/add_question_do', function(req, res){
    var data = processData(req);
    //console.log(data);
    var correctAnswer =  data.qParams[0].value;
    var incorrect1 = data.qParams[1].value;
    var incorrect2 = data.qParams[2].value;
    var incorrect3 = data.qParams[3].value;
    //console.log(data);
    //var userQuery = 'INSERT INTO `problem` (`answer`, `incorrect_1`, `incorrect_2`, `incorrect_3`) VALUES ( ' + correctAnswer + ', ' + incorrect1 + ', ' + incorrect2 + ', ' + incorrect3 + ' );';
    var userQuery = "INSERT INTO `problem` (`answer`, `incorrect_1`, `incorrect_2`, `incorrect_3`) VALUES ( '" + correctAnswer + "', '" + incorrect1 + "', '" + incorrect2 + "', '" + incorrect3 + "' );" 
    //console.log(userQuery);
    var conn = getConn();
  
    conn.query({
	sql: userQuery, 
	timeout: 40000 //40s
    }, (error, results, fields)=> {
		if(error){
			//console.log(error);
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
			//console.log(error);
			res.send('{}');
		}
		else {
			//console.log("Connected to DB");
			rs = JSON.stringify(results);
			//rs += '}';
			////console.log(rs);
			res.send(rs);
		}
    });
    conn.end();
});

app.get('/submitanswer', (req, res)=> {
    var data = processData(req);
    var id =  data.qParams[0].value;
    var correct = data.qParams[1].value;
	var user = data.qParams[2].value;
    //console.log(data);
    var string = 'INSERT INTO `user_progress` (`user_id`, `problem_id`, `passed`, `attempt_date`) VALUES (' + user + ', ' + id + ', ' + correct + ', NOW())' +
	    ' ON DUPLICATE KEY UPDATE `passed`='+ correct + ', `attempt_date`=NOW()';
    //console.log(string);
    var conn = getConn();
  
    conn.query({
	sql: string,
	timeout: 40000 //40s
	//values: ['value']
    }, (error, results, fields)=> {
		if(error){
			//console.log(error);
			res.send('{}');
		}
		else {
			//console.log("Connected to DB");
			res.send('{}');
		}
    });
    conn.end();    
});

app.get('/teacherDash',(req, res)=>{
    function getStudentProgress(teacherId){
        return new Promise(function(resolve,reject){
        var conn = getConn();
        var query_str =
        "SELECT SUM(passed) as passed, COUNT(problem_id) as problem, first_name, last_name " +
        "FROM studentProgress " + 
        "WHERE (teacher = ?)" +
        "GROUP BY student_id;"; 
                
        var query_var = [teacherId];

        var query = conn.query(query_str,query_var,function(err,rows,fields){
            if(err){
                return reject(err);
            }
            resolve(rows);
        });
    });
}

    var context = {};
    //Get request data
    //Use the id from get params until we have a session/cookie system set up
    //to identify a teacher
    context = processData(req);
    //Make the query
    context.studentProgress = [];
    getStudentProgress(context.qParams[0].value).then(function(rows){
		for(var r in rows){
		   context.studentProgress.push({'name':rows[r].first_name + ' ' + rows[r].last_name,
										'passed':rows[r].passed,
										'problems':rows[r].problem,
										'percent':Math.round((rows[r].passed / rows[r].problem)*100)});
		}
	//catch any errors and render the page
    }).catch((err) => setImmediate(() => {throw err;})).then(function(){res.render('teacherDash',context)});        
});

//Add a new user account to the database
//Generate a form response page after submission 
app.post('/account', function(req, res, next) {
    var context = {};
    ////console.log(req.body);
    var  postMessage = 'Unable to Create Account Right Now!';

    context.res = postMessage;

    //Check for existing user
    var result = 0;
    if([req.body.first_name] == ""){
        postMessage = 'Please Enter the First Name';
        context.res = postMessage;
        res.render('userform', context);
    }
    else if([req.body.last_name] == ""){
        postMessage = 'Please Enter the Last Name';
        context.res = postMessage; 
        res.render('userform', context);
    }
    else if([req.body.DOB] == ""){
        postMessage = 'Please Enter the Date of Birth';
        context.res = postMessage;
        res.render('userform', context);
    }
    else{
        var conn = getConn();
        conn.query({
            sql: "SELECT * FROM `user` WHERE `first_name`='" + [req.body.first_name] + "' AND `last_name` ='" + [req.body.last_name] + "' AND `DOB`='" + [req.body.DOB] + "'",
            timeout: 40000 
        }, (error, results, fields)=> {
                if(error){
                    //console.log(error);
                    postMessage = 'Error Connecting to the Database';
                    context.res = postMessage;
                    res.render('userform', context);
                }
                else {
                    //console.log("Connected to DB");
                    ////console.log(results);
                    if(results != ""){
                        result = 1;
                    }
                    else{
                        result = 0;
                    }
                    var uid; 
                    if([req.body.user] == 'on'){
                        uid = 2;
                    }
                    else{
                        uid=1;
                    }
                    if(result == 1){
                    	postMessage = 'User already exists';
                    	context.res = postMessage;
                        res.render('userform', context);
                    }
                    else{
                        var string = "INSERT INTO user (`first_name`, `last_name`, `DOB`, `joinDate`, `email`, `phone`, `user_role_id` ) VALUES ('"
                                        + [req.body.first_name] + "','" + [req.body.last_name] + "','" + [req.body.DOB] 
                                        + "', NOW(),'" + [req.body.email] + "','" + [req.body.phone] + "','" + uid + "');";
                        ////console.log(string);      
                        conn.query({
                            sql: string,
                            timeout: 40000
                        }, (error, results, fields)=> {
                                if(error){
                                    //console.log(error);
                                    postMessage = 'Error Connecting to the Database';
                                    context.res = postMessage;
                                    res.render('userform', context);
                                }
                                else {
                                    //console.log("Connected to DB");
                                    postMessage = 'User successfully created';
                                    context.res = postMessage;
                                    res.render('userform', context);
                                }
                            });
                        conn.end();
                    }
                } 
            });
    }
});

//Render user account page
app.get('/account', function(req, res, next) {
    res.render('account');
});

//Render user account page
app.get('/about', function(req, res, next) {
    res.render('about');
});

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://52.40.59.238');
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
  //console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

exports.app = app;
exports.getConn = getConn;
exports.processData = processData;
