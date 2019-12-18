var express = require('express');
var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require('body-parser');


var app = express();

var connection = mysql.createConnection({
    host : '52.14.192.178',
    user : 'root',
    password : 'beable',
    port : 3306,
    database : 'capstonedb'
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.get('/', function(req, res){

    res.sendFile(__dirname + '/public/login.html');
});

app.get('/search', function(req, res){
    res.sendFile(__dirname + '/public/search.html');
});

app.get('/register', function(req, res){
    res.sendFile(__dirname + '/public/register.html');
});

app.post('/register', function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var phoneNumber = req.body.phoneNumber;
    var job = req.body.job;
    var address = req.body.address;
    var token = req.body.token;


    connection.connect();
    var sql = "insert into member (name, email, password, phoneNumber, job, address, token) values(?,?,?,?,?,?,?)";
    var params = [name, email, password, phoneNumber, job, address, token];

    connection.query(sql, params, function(err, rows, fields){
        if(err) console.log(err);
        else console.log(rows.insertId);
    });
    connection.end();
    res.sendFile(__dirname + '/public/RegisterSuccess.html');
});


app.listen(3000, function(){
    console.log('Example start');
});
