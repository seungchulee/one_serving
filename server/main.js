var express = require('express');
var fs = require('fs');

var app = express();

app.use(express.static('public'));

app.get('/', function(req, res){

    res.sendFile(__dirname + '/public/login.html');
});

app.get('/search', function(req, res){
    res.sendFile(__dirname + '/public/search.html');
});

app.post('/search', function(req, res){
    res.sendFile(__dirname + '/public/search.html');
});




app.get('/register', function(req, res){
    res.sendFile(__dirname + '/public/register.html');
});


app.listen(3000, function(){
    console.log('Example start');
});
