var express = require('express');
var fs = require('fs');
var mysql = require('sync-mysql');
var bodyParser = require('body-parser');
var session = require('express-session');
var datetime = require('node-datetime');
var moment = require('moment-timezone');

var app = express();

var connection = new mysql({
    host : '52.14.192.178',
    user : 'root',
    password : 'beable',
    port : 3306,
    database : 'capstonedb'
});


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


app.use(session({
    secret:"asdfdasf",
    resave:false,
    saveUninitialized:true,
}));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/', function(req, res){
    var email = req.body.email;
    var password = req.body.password;

    var sql = "select * from member where email=?";

    var results = connection.query(sql, [email]);
    if(results.length > 0){
        if(results[0].password == password){
            req.session.user = {"id" : results[0].no};
            if(results[0].job == "Owner"){
                res.redirect('/ownerPage');
            }else if(results[0].job == "Customer"){
                res.redirect('/search');
            } else if(results[0].job == "DeliveryMan"){
                res.redirect('/tmap');
            }
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
});
        
app.get('/search', function(req, res){
    res.sendFile(__dirname + '/public/search.html');
});

app.post('/search', function(req, res){
    var type = req.body.type;
    var label = req.body.label;
    
    var sql = "select * from store where `type`=?and `label` like '%" + label + "%'";
    var params = [type];

    var results = connection.query(sql, params);
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

    connection.query(sql, params);
    res.redirect('/RegisterSuccess.html');
    //res.sendFile(__dirname + '/public/RegisterSuccess.html');
});

app.get('/han.html', function(req, res){
    res.sendFile(__dirname + '/public/han.html');
});

app.get('/price', function(req, res){
    try{
        var no = req.query.no;
        var storeName = "";
        var sql = "select name, price from menu where storeNo=?";
        var params = [no];

        var results = connection.query("select name from store where no=?", params);
        storeName = results[0].name;

        results = connection.query(sql, params);
        var html = fs.readFile('./public/price.html', function(err, html){
            if(err) throw err;
            html = html + "";
            var loop = "";
            loop += "<input type='hidden' name='storeNo' value=" + no + ">";
            for(var i=0; i<results.length;i++){

                var tmp = '<input class="checkbox-btn" name="check_menu" id="checkbox-<%idx%>" type="checkbox" value="<%price%>/<%name%>">\n\
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
    }
    catch(e){
        res.redirect('/OrderFail');
    }
});
app.post('/price', function(req, res){
    try{
        var storeNo = req.body.storeNo; 
        var customerNo;
        var customerAddress = "";
        var check_menu = ("" + req.body.check_menu).split(',');
        var price = 0;
        var menu = "";
        var storeAddress = "";
        var storeName = "";
        var dt = moment().tz('Asia/Seoul').format("YYYY-MM-DD HH:mm:ss");
        var data = new Array();
        var sql = "insert into orderInfo (customerNo, storeNo, menu, price, customerAddress, storeAddress, time, status) values (?,?,?,?,?,?,?,?)"; 


        check_menu.forEach(function(element){
            var tmp = element.split('/');
            price += parseInt(tmp[0]);
            menu += tmp[1] + ',';
            data.push({"menu" : tmp[1], "price" : tmp[0]});
        });


        var results = connection.query("select name, address from store where no=" + storeNo);
        storeAddress = results[0].address;
        storeName = results[0].name;

        customerNo = req.session.user.id;  
        results = connection.query("select address from member where no=?", [customerNo]);
        customerAddress = results[0].address;

        var params = [customerNo, storeNo, menu, price, customerAddress, storeAddress, dt, 0];
        connection.query(sql, params);

        res.render('order.html', {"time" : dt, "customerNo" : customerNo, "storeNo" : storeNo, "storeName" : storeName, "customerAddress" : customerAddress, "price" : price, "data" : data});
        //res.sendFile(__dirname + '/public/order.html');
    }
    catch(e){
        res.redirect('/OrderFail');
    }
});


app.post('/cancel', function(req, res){
    var storeNo = req.body.storeNo;
    var customerNo = req.body.customerNo;
    var dt = req.body.time;
    console.log(dt);
    var results = connection.query("select * from orderInfo where customerNo=? and storeNo=? and time=?", [customerNo, storeNo, dt]);

    if(results[0].status == 0){
        connection.query("delete from orderInfo where no=?", [results[0].no]);
        res.redirect('/CancelSuccess');
    }
    else{
        res.redirect('/CancelFail');
    }
});

app.get('/ownerPage', function(req, res){
    try{
        var ownerNo = req.session.user.id;
        var storeNo;
        var storeName;
        var storeAddress;
        var minCost;
        var phoneNumber;

        var results = connection.query("select * from store where ownerNo=?", [ownerNo]);
        
        storeNo = results[0].no;
        storeAddress = results[0].address;
        storeName = results[0].name;
        minCost = results[0].minCost;
        phoneNumber = results[0].phoneNumber;

        var info = new Array();

        results = connection.query("select * from orderInfo where storeNo=? order by time desc", [storeNo]);
        
        for(var i=0; i<results.length; i++){
            info.push({
                "orderNo" : results[i].no,
                "customerNo" : results[i].customerNo,
                "customerAddress" : results[i].customerAddress,
                "stmt" : results[i].status,
                "menu" : ("" + results[i].menu).slice(0, -1),
                "price" : results[i].price,
                "time" : results[i].time
            });
        }
        var data = {
            "storeNo" : storeNo,
            "storeName" : storeName,
            "storeAddress" : storeAddress,
            "minCost" : minCost,
            "phoneNumber" : phoneNumber,
            "info" : info
        };
        res.render('ownerPage.html', data);
    }
    catch(e){
        res.redirect('/OwnerFail.html');
    }
});

app.get('/read', function(req, res){
    var orderNo = req.query.orderNo;

    connection.query("update orderInfo set status=2 where no=?", [orderNo]);
    res.redirect('/ownerPage');
});
app.get('/tmap', function(req, res){
    res.sendFile(__dirname + '/public/tmap.html');
});
app.get('/CancelSuccess', function(req, res){
    res.sendFile(__dirname + '/public/CancelSuccess.html');
});

app.get('/CancelFail', function(req, res){
    res.sendFile(__dirname + '/public/CancelFail.html');
});

app.get('/OrderFail', function(req, res){
    res.sendFile(__dirname + '/public/OrderFail.html');
});

app.get('/OwnerFail', function(req, res){
    res.sendFile(__dirname + '/public/OwnerFail.html');
});

app.listen(3000, function(){
    console.log('Example start');
});
