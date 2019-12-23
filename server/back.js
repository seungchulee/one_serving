var express = require('express');
var fs = require('fs');
var mysql = require('sync-mysql');
var bodyParser = require('body-parser');

/*var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
var date = moment().format('YYYY-MM-DD HH:mm:ss');
*/

const request = require('request')
const TARGET_URL = 'https://notify-api.line.me/api/notify'
var TOKEN = 'ecs47FvgE5WIhvFne5CxbaTKbgKPwk6vUbWF9eMyhnA'
/*request .post({
    url : TARGET_URL,
    headers : {
        'Authorization': `Bearer ${TOKEN}`
    },
    form: {
        message: 'nodejs test'
    }
}, (error, response,body)=>{
    console.log(body)
})*/


var app = express();

var connection = new mysql({
    host : '52.14.192.178',
    user : 'root',
    password : 'beable',
    port : 3306,
    database : 'capstonedb',
    multipleStatements: true
});

//connection.connect();

/*var sql = "select * from member where name='정필립'";
connection.query(sql,function(err,results){
    if(err){
        console.log(err);
    }
    else{
        puts(results[0].password);
    request .post({
    url : TARGET_URL,
    headers : {
        'Authorization': `Bearer ${TOKEN}`
    },
    form: {
        message: 'nodejs test'
    }
}, (error, response,body)=>{
    console.log(body)
})

    }
});*/

puts = require("sys").puts;

setInterval(function(){

    var sql = "select token from member where no in (select customerNo from orderInfo where storeNo in (select storeNo from (select * from (select storeNo, sum(price)'sum' from orderInfo where status=0 group by storeNo)storeSum join store where storeSum.storeNo=store.No)storejoin where sum>=minCost)and status=0)";     //최소가격을 넘어 고객에게 주문알림을 보냄
    var results = connection.query(sql);
    if(results.length>0)
    {
        for(var i=0;i<results.length;i++)
        {
            request .post({
                url : TARGET_URL,
                headers : {
                    'Authorization': `Bearer ${results[i].token}`
                },
                form: {
                    message: '주문 완료되었습니다.'
                }
            }, (error, response,body)=>{
                console.log(body)
            })
        }
    }

    var sql = "select token, menu from(select token,no from member where no in (select ownerNo from store where No in (select storeNo from (select * from (select storeNo, sum(price) 'sum' from orderInfo where status=0 group by storeNo)storeSum join store where storeSum.storeNo=store.No)storejoin where sum>=minCost) and status=0))storetok join (select menu, ownerNo from (select menu,storeNo from orderInfo where storeNo in (select storeNo from (select * from (select storeNo, sum(price) 'sum' from orderInfo where status=0 group by storeNo)storeSum join store where storeSum.storeNo=store.No)storejoin where sum>=minCost) and status=0)storemenu join store where store.No = storemenu.storeNo)storemenu where storetok.no = storemenu.ownerNo";
    var results = connection.query(sql);
    if(results.length>0)
    {
        for(var i=0;i<results.length;i++)
        {
            puts(results[i].token);
            request .post({
                url : TARGET_URL,
                headers : {
                    'Authorization': `Bearer ${results[i].token}`
                },
                form: {
                    message: results[i].menu+' 주문 들어왔습니다.'
                }
            }, (error, response,body)=>{
                console.log(body)
            })
        }
    }


    var sql = "select storeNo, menu, name, address, price, customerAddress from (select menu,storeNo,price,customerAddress from orderInfo where storeNo in (select storeNo from (select * from (select storeNo, sum(price) 'sum' from orderInfo where status=0 group by storeNo)storeSum join store where storeSum.storeNo=store.No)storejoin where sum>=minCost)and status=0)storemenu join store where store.No = storemenu.storeNo order by name";
    var results = connection.query(sql);
    var sql = "select token, No from member where job = 'DeliveryMan' and status =0 order by delivered asc limit 1";
    //var results_delivered = connection.query(sql);
        if(results.length>0)
        {
            for(var i=0;i<results.length;i++)
            {
                if(i==0)
                {
                    var results_delivered = connection.query(sql);
                    puts(results_delivered[0].No+"if");
                    request .post({
                        url : TARGET_URL,
                        headers : {
                            'Authorization': `Bearer ${results_delivered[0].token}`
                        },
                        form: {
                            message: results[i].name + '\n' + results[i].address+'\n====================\n' + results[i].menu+'\n' + results[i].customerAddress + '\n====================\n'+results[i].price
                        }
                    }, (error, response,body)=>{
                        console.log(body)
                    })

                }
                else{
                    if(results[i].storeNo == results[i-1].storeNo){
puts(results_delivered[0].No+"elseif");
                        request .post({
                            url : TARGET_URL,
                            headers : {
                                'Authorization': `Bearer ${results_delivered[0].token}`
                            },
                            form: {
                                message: results[i].name + '\n' + results[i].address+'\n====================\n' + results[i].menu+'\n' + results[i].customerAddress + '\n====================\n'+results[i].price
                            }
                        }, (error, response,body)=>{
                            console.log(body)
                        })
                    }
                    else{
                        var delivery_no=results_delivered[0].No;
                        puts(delivery_no+"elel");
                        connection.query('update member set status = 1, delivered = delivered + 1 where no=?',[delivery_no]);
                        var results_delivered = connection.query(sql);
                        puts(results_delivered[0].No+"elel2");
                        request .post({
                            url : TARGET_URL,
                            headers : {
                                'Authorization': `Bearer ${results_delivered[0].token}`
                            },
                            form: {
                                message: results[i].name + '\n' + results[i].address+'\n====================\n' + results[i].menu+'\n' + results[i].customerAddress + '\n====================\n'+results[i].price
                            }
                        }, (error, response,body)=>{
                            console.log(body)
                        })

                    }
                }
            }
        }

        var sql = "select no from orderInfo where storeNo in (select storeNo from (select * from (select storeNo, sum(price)'sum' from orderInfo where status=0 group by storeNo)storeSum join store where storeSum.storeNo=store.No)storejoin where sum>=minCost)and status = 0";
    var results = connection.query(sql);
    for (var i=0;i<results.length;i++)
    {
        var sql = "update orderInfo set status=1 where no = ?";
        connection.query(sql,[results[i].no]);
    }

    var date=new Date();
    var time = date.toLocaleString();
    var time1 = new Date(time);
    var sql = "select time, ordername.no, store.name, menu, token from (select time, ordermenu.no, customerNo,storeNo, menu, token from(select time, no, customerNo,storeNo, menu from orderInfo where status=0)ordermenu join member where member.no=ordermenu.customerNo)ordername join store where ordername.storeNo = store.No";
    var results = connection.query(sql);
    for (var i=0;i<results.length;i++)
    {
        var time2 = new Date(results[i].time);
        var difftime = (time1.getTime() + 9*60*60*1000 - time2.getTime())/1000;
        puts("현재시간:"+time1+"주문시간"+time2+"    "+difftime+"초");
        if(difftime>=1*60)
        {

request .post({
                url : TARGET_URL,
                headers : {
                    'Authorization': `Bearer ${results[i].token}`
                },
                form: {
                    message: results[i].name+'\n'+results[i].menu+' 주문 취소되었습니다.'
                }
            }, (error, response,body)=>{
                console.log(body)
            })

            var sql1 = 'delete from orderInfo where no = ?';
            connection.query(sql1,[results[i].no]);
        }
    }

    puts("select storeNo, menu, name, address, price, customerAddress from (select menu,storeNo,price,customerAddress from orderInfo where storeNo in (select storeNo from (select * from (select storeNo, sum(price) 'sum' from orderInfo where status=0 group by storeNo)storeSum join store where storeSum.storeNo=store.No)storejoin where sum>=minCost)and status=0)storemenu join store where store.No = storemenu.storeNo order by name");
    puts("hello");
},1000*6);

process.addListener("SIGNINT",function(){
    puts("good-bye");
    process.exit(0);
});
