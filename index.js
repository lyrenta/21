const http = require('http')
const fs = require('fs')
const path = require('path')

const dataPath = path.join(__dirname, 'data')

const server = http.createServer((request, response) => { 
    if (request.url == "/jokes" && request.method == 'GET') {
        getAllJokes(request, response)
    }
});

server.listen(3000)