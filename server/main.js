var express = require('express');
var fs = require('fs');

var app = express();

app.get('/', function(req, res){
    var html = fs.readFile('./public/login.html', function(err, html){
        html = "" + html;
        if(err) throw err;
        res.writeHeader(200, {"Content-Type":"text/html"});
        res.write(html);
        res.end();
    });
});

app.listen(3000, function(){
    console.log('Example start');
});
