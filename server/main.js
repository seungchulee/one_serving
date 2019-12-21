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
            var html = fs.readFile('./public/han.html', function(err, html){
                html = html + "";
                var loop = "";
                if(err) throw err;

                for(var i = 0; i < results.length; i++){
                    var tmp = '<a href="<%url%>">\n\
                            <div class="card">\n\
                                <div class="card-header"\n\
                                    style="background-image:url(pictures/<%no%>.jpg);background-size:100%;background-position: center center;background-repeat: no-repeat;">\n\
                                </div> \n\
                                <div class="card-body">\n\
                                    <div class="card-body-header" style="color:#000000">\n\
                                    <h1><%name%></h1>\n\
                                        <p class="card-body-nickname">\n\
                    전화번호 : <%phoneNumber%>\n\
                                        </p>\n\
                                    </div>\n\
                                    <p class="card-body-description">\n\
                                        <br><br><b>\n\
                        Open : <%open%>:00 am<br>\n\
                        Close : <%close%>:00 pm<br>\n\
                                        최소 배달 금액 : <%minCost%>원 <br>\n\
                                        </b>\n\
                                    </p>\n\
                                    <div class="card-body-footer">\n\
                                        <hr style="margin-bottom: 8px; opacity: 0.5; border-color: #EF5A31">\n\
                                    </div>\n\
                                </div>\n\
                            </div>\n\
                        </a>';
                    var no = results[i].no;
                    var url = 'price?no=' + no;
                    var name = results[i].name;
                    var address = results[i].address;
                    var phoneNumber = results[i].phoneNumber;
                    var open = results[i].open;
                    var close = results[i].close;
                    var minCost = results[i].minCost;
                    
                    tmp = tmp.replace("<%url%>", url).replace("<%no%>", no).replace("<%name%>", name).replace("<%phoneNumber%>", phoneNumber).replace("<%open%>", open)
                        .replace("<%close%>", close).replace("<%minCost%>", minCost);

                    loop += tmp;





                }
                html = html.replace("<%loop%>", loop);
                res.writeHeader(200, {"Content-Type":"text/html"});
                res.write(html);
                res.end();
            });
        }
    });

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

app.get('/price', function(req, res){
    var no = req.query.no;
    var storeName = "";
    var sql = "select name, price from menu where storeNo=?";
    var params = [no];

    connection.query("select name from store where no=?", params, function(err, results){
        if(err) throw err;
        storeName = results[0].name;

    });

    connection.query(sql, params, function(err, results){
        if(err) throw err;
        var html = fs.readFile('./public/price.html', function(err, html){
            html = html + "";
            var loop = "";

            for(var i=0; i<results.length;i++){

                var tmp = '<input class="checkbox-btn" name="checkbox-collection" id="checkbox-<%idx%>" type="checkbox" value="<%price%>">\n\
                    <label class="checkbox-label" for="checkbox-<%idx%>" tabindex="<%idx%>">\n\
                    <span>\n\
                    <%name%>\n\
                    </span>\n\
                    <span> <%price%>원</span>\n\
                    </label>';
                tmp = tmp.replace(/<%name%>/gi, results[i].name).replace(/<%price%>/gi, results[i].price).replace(/<%idx%>/gi, ""+(i+1));
                loop += tmp;
            }
            html = html.replace("<%storeName%>", storeName);
            html = html.replace("<%loop%>", loop);
            res.writeHeader(200, {"Content-Type":"text/html"});
            res.write(html);
            res.end();

        });
    });
});
app.listen(3000, function(){
    console.log('Example start');
});
