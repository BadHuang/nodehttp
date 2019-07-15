var http = require('http');
var path = require("path");
var fs = require("fs");

var files = [
    "Member",
    "Partner",
    "IssuePoints",
    "RedeemPoints",
    "TransferPoints"
]
//添加Files数组中数据
function readFile(){
    for (var i=0; i<files.length; i++)
    {
        (function(j) {
                fs.readFile('../'+files[j]+'.json','utf-8',function(err,data){
                    if(err){
                        return console.error(err);
                    }
                    let array = []             
                    array = JSON.parse(data);//将字符串转换为json对象
                    
                    postFun(array, files[j], 0, j);
                })
        })( i );    
    }
}
//添加Card数据
function readCard(method){
    
    var data=fs.readFileSync('../Card.json','utf-8');
    let array = []             
    array = JSON.parse(data);
    if(method=='post')postCard(array, 0);
    if(method=='put')putCard(array, 0);

}
//添加Files数组中数据
function postFun(array, type, index, fileid){
    if(index >= array.length)return index;  
    let options = {
        host:'admin.tx.haomo-tech.com',
        path:'/api/com.haomo.'+type,
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Accept': 'application/json'
        }
    }
    console.log(options)
    let currParam = array[index];
    //判断是否有transactionId属性
    if(currParam.transactionId !== undefined){
        delete currParam.transactionId
    }
    let currParamStr = JSON.stringify(currParam);
    let req = http.request(options,function(res){
        console.log('STATUS:' + res.statusCode);
        console.log('HEADERS:' + JSON.stringify(res.headers));
        res.setEncoding('utf-8');
        res.on('data',function(body){
            console.log('BODY：' + body);
        });
        res.on('end',function(){
            ///数据提交完毕，重新赋值Card数据
            if(index >= (array.length-1)&&fileid>= (files.length-1)){  
                readCard('put')               
            }else{
                postFun(array, type, index + 1, fileid)
            }
        })
    });

    req.on('err',function(err){
        if(e){
            console.info(e);
        }
    });
//  参数
    console.log(currParam);
    req.write(currParamStr, 'utf-8');
    req.end();
}
//Card添加
function postCard(array, index){
    if(index >= array.length)return index;
    
    let options = {
        host:'admin.tx.haomo-tech.com',
        path:'/api/com.haomo.Card',
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Accept': 'application/json'
        }
    }
    console.log(options)
    // console.log(array[index]);
    let currParam = array[index];
    //初始化余额为99999
    currParam.balance = 99999
   
    let currParamStr = JSON.stringify(currParam);

    let req = http.request(options,function(res){
        console.log('STATUS:' + res.statusCode);
        console.log('HEADERS:' + JSON.stringify(res.headers));
        res.setEncoding('utf-8');
        res.on('data',function(body){
            console.log('BODY：' + body);
        });
        res.on('end',function(){
            //添加完Card数据再添加其他数据
            if(index >= (array.length-1)){  
                readFile()             
            }else{
                postCard(array, index + 1)
            }
        })
    });

    req.on('err',function(err){
        if(e){
            console.info(e);
        }
    });
//  参数
    console.log(currParam);
    req.write(currParamStr, 'utf-8');
    req.end();
}

//Card重新赋值
function putCard(array, index){
    if(index >= array.length)return;
    
    let currParam = array[index];
    let currParamStr = JSON.stringify(currParam);
    
    if(currParam.id == undefined || currParam.id == null)return;
    let options = {
        host:'admin.tx.haomo-tech.com',
        path:'/api/com.haomo.Card/'+currParam.id,
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            'Accept': 'application/json'
        }
    }
    console.log(options)
    let req = http.request(options,function(res){
        console.log('STATUS:' + res.statusCode);
        console.log('HEADERS:' + JSON.stringify(res.headers));
        res.setEncoding('utf-8');
        res.on('data',function(body){
            console.log('BODY：' + body);
        });
        res.on('end',function(){
            putCard(array, index + 1);
        })
    });

    req.on('err',function(err){
        if(e){
            console.info(e);
        }
    });
//  参数
    console.log(currParam);
    req.write(currParamStr, 'utf-8');
    req.end();
}
readCard('post');

