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
var connect = ()=> {
    try {
	console.log("attempting to connect to: " + db);
	conn.connect();
    } catch(err) {
	throw(err);
    }
}

var query = (q)=> {
    connect();
    var results = {};
    conn.query(q, (err, rows, fields)=> {
	if(err)
	    throw(err);
	console.log(rows);
    });
    end();
}

var end = ()=> {
    console.log("Closing connection");
    conn.end();
}

module.exports.query = query;
