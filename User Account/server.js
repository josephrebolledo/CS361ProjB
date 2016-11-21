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
      	//console.log("herer");
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

   app.get('/submitanswer', (req, res)=> {
    var data = processData(req);
    var id =  data.qParams[0].value;
    var correct = data.qParams[1].value;
    console.log(data);
    var string = 'INSERT INTO `user_progress` (`user_id`, `problem_id`, `passed`, `attempt_date`) VALUES (1,' + id + ', ' + correct + ', NOW())' +
    ' ON DUPLICATE KEY UPDATE `passed`='+ correct + ', `attempt_date`=NOW()';
    console.log(string);
    var conn = getConn();
    
    console.log(conn);
    console.log("ssss");
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

   app.get('/problems', (req, res)=> {
    res.render('questions');
  });



   app.post('/account', function(req, res, next) {
    var context = {};
    //console.log(req.body);
    var result = 100;
    if([req.body.first_name] == ""){
      res.send('Please enter the first name');
    }
    else if([req.body.last_name] == ""){
      res.send('Please enter the last name');  
    }
    else if([req.body.DOB] == ""){
      res.send('Please enter the date of birth');
    }
  
  else{
    var conn = getConn();
    conn.query({
    sql: "SELECT * FROM `user` WHERE `first_name`='" + [req.body.first_name] + "' AND `last_name` ='" + [req.body.last_name] + "' AND `DOB`='" + [req.body.DOB] + "'",
    timeout: 40000 //40s
    //values: ['value']
  }, (error, results, fields)=> {
    if(error){
      console.log(error);
      res.send('{}');
    }
    else {
        console.log("Connected to DB");
        //console.log(results);
       
        if(results != ""){

          result=1;
        }
        else{
          result=0;
        }

        var uid; 

        if([req.body.user] == 'on'){
          uid = 1;
        }
        else{
          uid=2;
        }

    //console.log(result);
    /*Commented out for debugging*/
    //console.log("Request.Body : " + JSON.stringify(req.body));

    if(result == 1){
      res.send('User already exists')
    }
    else{
    var string = "INSERT INTO user (`first_name`, `last_name`, `DOB`, `joinDate`, `email`, `phone`, `user_role_id` ) VALUES ('"
    + [req.body.first_name] + "','" +
    [req.body.last_name] + "','" +
    [req.body.DOB] + 
    "', NOW(),'" + 
    [req.body.email] + "','" +
    [req.body.phone] + "','" + 
    uid + "');";
    //console.log(string);      
    conn.query({
    sql: string,
    timeout: 40000 //40s
    //values: ['value']
    }, (error, results, fields)=> {
      if(error){

        console.log(error);
        res.send('Error connecting to the database');
      }
      else {
        console.log("Connected to DB");
        res.send('User successfully created');
      }
    });
    conn.end();
    
    }
   } 
  });
 }
});


   app.get('/account', function(req, res, next) {
     res.render('account');
  });

   app.use(function (req, res, next) {

      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/');
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
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
  });

   exports.app = app;
   exports.getConn = getConn;
   exports.processData = processData;
