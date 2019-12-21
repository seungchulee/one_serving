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

connection.connect();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.get('/', function(req, res){

    res.sendFile(__dirname + '/public/login.html');
});

app.post('/', function(req, res){
    var email = req.body.email;
    var password = req.body.password;

    var sql = "select * from member where email=?";
    connection.query(sql, [email], function(err, results){
        if(err){
            console.log(err);
        }
        else{
            if(results.length > 0){
                if(results[0].password == password){
                    res.redirect('/search.html');
                    //res.sendFile(__dirname + '/public/search.html');
                }
                else{
                    res.redirect('/LoginFail.html');
                    //res.sendFile(__dirname + '/public/LoginFail.html');
                }
            }
            else{
                res.redirect('/LoginFail.html');
                //res.sendFile(__dirname + '/public/LoginFail.html');
            }

        }
    });
});
        
app.get('/search', function(req, res){
    res.sendFile(__dirname + '/public/search.html');
});

app.post('/search', function(req, res){
    var type = req.body.type;
    var label = req.body.label;
    
    var sql = "select * from store where `type`=?and `label` like '%" + label + "%'";
    var params = [type];

    connection.query(sql, params, function(err, results){
        if(err){
            console.log(err);
        }
        else{
            console.log(results.length + "");
        }
    });
    res.redirect('/' + type + '.html');
    //res.sendFile(__dirname + '/public/' + type + '.html');
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


    var sql = "insert into member (name, email, password, phoneNumber, job, address, token) values(?,?,?,?,?,?,?)";
    var params = [name, email, password, phoneNumber, job, address, token];

    connection.query(sql, params, function(err, rows, fields){
        if(err) console.log(err);
        else console.log(rows.insertId);
    });
    res.redirect('/RegisterSuccess.html');
    //res.sendFile(__dirname + '/public/RegisterSuccess.html');
});

app.get('/han.html', function(req, res){
    res.sendFile(__dirname + '/public/han.html');
});

app.listen(3000, function(){
    console.log('Example start');
});
