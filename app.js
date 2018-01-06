'use strict';
const express = require('express');
const app = express();
var fs = require('fs');
const request = require('request');
var url = "192.168.2.101"

app.listen(3000);

app.use('/', express.static('public'));
app.get('/api/container', getToken, getContainer);
app.get('/api/object', getToken, getObject);
app.get('/api/object/download', getToken, downloadObject);
//app.get('/api/get', getToken,getIps);
//app.get('/api/create', getToken, getImage, getFlavor, postServer, getServerDetail);
//app.get('/', getToken, getStorageInfo, createStorageAccount);
function getNetworks(req,res){
    console.log(res.locals.serverId);
    request({
        uri: "http://" + url + "//" ,
        method: 'GET',
        headers: {
            'X-Auth-Token' : JSON.stringify(res.locals.token),
        }}, function(err, httpRes, body){
            console.log(body);
    });

}

function getIps(req,res, next){
    //console.log(res.locals.serverId);
    request({
        uri: "http://" + url + "/compute/v2.1/servers/" + app.locals.serverId + "/ips" ,
        method: 'GET',
        headers: {
            'X-Auth-Token' : JSON.stringify(res.locals.token),
        }}, function(err, httpRes, body){
            //console.log(res.locals.serverName);
            console.log(body);
            JSON.parse(body);
            res.json((body));
            //next();
    });

}

function getServerDetail(req,res){

    request({
        uri: "http://" + url + "/compute/v2.1/servers/detail",
        method: 'GET',
        headers: {
            'X-Auth-Token' : JSON.stringify(res.locals.token),
        }}, function(err, httpRes, body){
        let servers = JSON.parse(body).servers;
        for(let i = 0; i < servers.length; i++){
            if(servers[i].name === res.locals.serverName){
                res.locals.serverId = servers[i].id;
                app.locals.serverId = servers[i].id;
                app.locals.serverName = res.locals.serverName;
                console.log(res.locals.serverId);
                break;
            }
        }
        let sendThis = {'name': app.locals.serverName, 'id': app.locals.serverId};
        res.json(sendThis);
    });

}

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

function getStorageInfo(req, res, next){

     var eq =request({
        uri: "http://" + url + ":8080/v1/AUTH_ec5d88475d4a4351a193cefb78f66220/gaga/baba.txt",
        method: 'PUT',
        headers: {
            'X-Auth-Token' : JSON.stringify(res.locals.token),
        },
        },function(err, httpRes, body){
           console.log(body);
            next();
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


