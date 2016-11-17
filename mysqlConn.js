var mysql = require('mysql');
var hostname = 'localhost';
var username = 'root';
var pw = 'isBool81122624hun!';
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
   }

conn.query('SELECT 1 + 1 AS solution', (err, rows, fields)=> {
    if(err)
	throw(err);
    console.log('Connection successful');
    console.log('The solution is: ' + rows[0].solution);
});

conn.end();
