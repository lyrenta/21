let http = require('http')
let fs = require('fs')
let path = require('path')

let server = http.createServer(function (request, response) { 
  response.end("hello world!");
});

server.listen(3000)