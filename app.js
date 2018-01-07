'use strict';
const express = require('express');
const app = express();
var fs = require('fs');
const request = require('request');
var url = "192.168.2.150"
var multer  = require('multer');

app.listen(3000);

app.use('/', express.static('public'));
app.get('/api/container', getToken, getContainer);
app.get('/api/container/create', getToken, addContainer);
app.get('/api/container/delete', getToken, delContainer);
app.get('/api/object/delete', getToken, delObject);
app.post('/api/object/create', getToken, addObject);
app.get('/api/object', getToken, getObject);
app.get('/api/object/download', getToken, downloadObject);


var storage = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, 'C:\\Users\\User\\Desktop')
    },
    filename: function(req, file, cb){
      console.log("file name:")
      console.log(file.originalname);
      cb(null, file.originalname)
      //cb(null, Date.now() + '-'+file.originalname)
    } 
})
var upload = multer({ storage: storage });
var fileBuffer;
var readFile = function(req, res, next){
    console.log(req.files[0].originalname);
    fileBuffer = fs.readFileSync(path.join(__dirname, "../../../" + req.files[0].path));
    fs.readFile(path.join(__dirname, "../../../" + req.files[0].path), "utf8", function(err, text){
    //charsetMatch = detectCharacterEncoding(fileBuffer);
    //console.log(charsetMatch);    
    if(err){
        console.log(err);
        next();
    }
    else
        next();
    });
};
    

router.post('/students/score', upload.any(), readFile, function(req, res){
    if(!req.files){
        console.log("No files");
        return;
    }
    
    var charsetMatch = detectCharacterEncoding(fileBuffer);
    console.log(charsetMatch);  
    console.log(req.files);
    res.redirect('/students/Head?e='+encodeURIComponent('Upload File'));
  });


function downloadObject(req, res){
 
    res.redirect("http://" + url + ":8080/v1/" + res.locals.account + "/" + req.query.container + "/" + req.query.object);

}

function getObject(req, res){

     request({
        uri: "http://" + url + ":8080/v1/" + res.locals.account + "/" + req.query.container,
        method: 'GET',
        headers: {
            'X-Auth-Token' : JSON.stringify(res.locals.token),
        },
        },function(err, httpRes, body){
        console.log(body);
        res.send(body);    
    });
}

function delObject(req, res){
    console.log(req.query.object);
    console.log(req.query.container);
     request({
        uri: "http://" + url + ":8080/v1/" + res.locals.account + "/" + req.query.container + "/" + req.query.object,
        method: 'DELETE',
        headers: {
            'X-Auth-Token' : JSON.stringify(res.locals.token),
        },
        },function(err, httpRes, body){
        console.log(body);
        res.send(body);    
    });
}
function delContainer(req, res){
    console.log(req.query.container);
     request({
        uri: "http://" + url + ":8080/v1/" + res.locals.account + "/" + req.query.container,
        method: 'DELETE',
        headers: {
            'X-Auth-Token' : JSON.stringify(res.locals.token),
        },
        },function(err, httpRes, body){
        console.log(body);
        res.send(body);    
    });
}

function addObject(req, res){
    console.log(req.files);
    if(req.query.effect === "preview");
    else if(req.query.effect === "flip");
    else if(req.query.effect === "grey");
    else if(req.query.effect === "rotate");
    else
        req.query.effect = '';
     request({
        uri: "http://" + url + ":8080/v1/" + res.locals.account + "/" + req.query.container + "/" + req.query.object,
        method: 'PUT',
        headers: {
            'X-Auth-Token' : JSON.stringify(res.locals.token),
            'effect' : req.query.effect,
        },
        },function(err, httpRes, body){
        console.log(body);
        res.send(body);    
    });
}

function addContainer(req, res){
    console.log(req.query.container);
     request({
        uri: "http://" + url + ":8080/v1/" + res.locals.account + "/" + req.query.container,
        method: 'PUT',
        headers: {
            'Content-Length': 0,
            "X-Container-Read": ".r:*",
            "X-Container-Write": ".r:*" ,
            'X-Auth-Token' : JSON.stringify(res.locals.token),
        },
        },function(err, httpRes, body){
        console.log(body);
        res.send(body);    
    });
}
function getContainer(req, res){

     request({
        uri: "http://" + url + ":8080/v1/" + res.locals.account,
        method: 'GET',
        headers: {
            'X-Auth-Token' : JSON.stringify(res.locals.token),
        },
        },function(err, httpRes, body){
        console.log(body);
        res.send(body);    
    });
}


function getToken(req, res, next){
    
    console.log(req.query.name);
    let acc;
    res.locals.account = req.query.name;
    if(req.query.name === "AUTH_ec5d88475d4a4351a193cefb78f66220")
        acc = "admin";
    else
        acc = "demo";
    let postThis = {
        'auth': {
            'identity' : {
                'methods' : ['password'],
                'password' : {
                    'user' : {
                        'name' : acc,
                        'domain' : {
                            'name' : 'default'
                        },
                        'password' : 'cloud'
                     }
                  }
              },
            'scope' : {
               'project' : {
                   'name' : acc, 
                   'domain' :{
                       'name' : 'default'
                   }
               }
           }
       }
     };
     request({
        uri: "http://" + url + ":35357/v3/auth/tokens",
        method: 'POST',
	    body: JSON.stringify(postThis),
        headers: {
            'Content-Type': 'application/json'
        },
        },function(err, httpRes, body){
           res.locals.token = httpRes['caseless']['dict']['x-subject-token'];
            console.log(res.locals.token);
           next();
    });
}


