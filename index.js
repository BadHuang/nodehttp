var http = require('http');
var path = require("path");
var fs = require("fs");


var pathName = "../";

fs.readdir(pathName, function(err, files){
    var dirs = [];
    for (var i=0; i<files.length; i++)
    {
        (function(j) {
            fs.stat(path.join(pathName, files[j]), function(err, data){     
          
                if(data.isFile()&&files[j].includes("json")){   
                    
                    
        
                fs.readFile('../'+files[j],'utf-8',function(err,data){
                    if(err){
                        return console.error(err);
                    }
                    let index = files[j].indexOf(".") 
                    let type = files[j].substring(0,index)         
                    // dirs.push(type);
                    let array = []
                    let options = {
                        host:'admin.tx.haomo-tech.com',
                        path:'/api/com.haomo.'+type,
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json',
                            'Accept': 'application/json'
                        }
                    }
                    
                    array = JSON.parse(data);//将字符串转换为json对象
                    
                    postFun(array, type, 0);
                })
        
        
                }
                
            });   
        })( i );    
}
}); 

function postFun(array, type, index){
    if(index >= array.length)return;
    
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
    // console.log(array[index]);
    let currParam = array[index];
    // console.log(currParam)
    if(currParam.transactionId !== undefined){
        delete currParam.transactionId
    }
    let currParamStr = JSON.stringify(currParam);
    // console.log(currParamStr);
    
    // console.log(options)
    let req = http.request(options,function(res){
        console.log('STATUS:' + res.statusCode);
        console.log('HEADERS:' + JSON.stringify(res.headers));
        res.setEncoding('utf-8');
        res.on('data',function(body){
            console.log('BODY：' + body);
        });
        res.on('end',function(){
            postFun(array, type, index + 1);
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

 
// req.write(content);
// req.end;
// postFun(0);
