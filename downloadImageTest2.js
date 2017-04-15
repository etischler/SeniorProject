var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.post('/', function(req, res) {
    'use strict';
    console.log(req);
    console.log(req.body);
    console.log(req.body.hello);
    res.send(200);
});

app.listen('127.0.0.1',3000);
console.log('listening');