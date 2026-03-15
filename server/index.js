const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const dataPath = path.join(__dirname, 'data')

const server = http.createServer((request, response) => { 
    if (request.url == "/jokes" && request.method == 'GET') {
        getAllJokes(request, response)
    }

    if (request.url == "/jokes" && request.method == 'POST') {
        addJoke(request, response)
    }

    if (request.url.startsWith('/like')) {
        like(request, response)
    }

    if (request.url.startsWith('/dislike')) {
        dislike(request, response)
    }
});


server.listen(3000)

function getAllJokes(request, responce) {
    let dir = fs.readdirSync(dataPath)
    let allJokes = [];

    for (let i = 0; i < dir.length; i++) {
        let file = fs.readFileSync(
            path.join(dataPath, i + '.json')
        )

        let jokeJson = Buffer.from(file).toString()
        let joke = JSON.parse(jokeJson)

        joke.id = i;

        allJokes.push(joke);
    }

    responce.end(JSON.stringify(allJokes))
}

function addJoke(request, responce) {
    let data = ''
    request.on('data', function (chunk) {
        data += chunk
    })

    request.on('end', function () {
        let joke = JSON.parse(data)
        joke.likes = 0;
        joke.dislikes = 0;

        let dir = fs.readdirSync(dataPath)
        let fileName = dir.length + '.json'
        let filePath = path.join(dataPath, fileName)

        fs.writeFileSync(filePath, JSON.stringify(joke))

        responce.end()
    })
}

function like(request, responce) {
    const url = require('url')
    const params = url.parse(request.url, true).query;
    let id = params.id
    if (id) {
        let filePath = path.join(dataPath, id + '.json')
        let file = fs.readFileSync(filePath)
        let jokeJSON = Buffer.from(file).toString();
        let joke = JSON.parse(jokeJSON)
        joke.likes++;
        fs.writeFileSync(filePath, JSON.stringify(joke))
    }
    responce.end()
}

function dislike(request, responce) {
    const url = require('url')
    const params = url.parse(request.url, true).query;
    let id = params.id
    if (id) {
        let filePath = path.join(dataPath, id + '.json')
        let file = fs.readFileSync(filePath)
        let jokeJSON = Buffer.from(file).toString();
        let joke = JSON.parse(jokeJSON)
        joke.dislikes++;
        fs.writeFileSync(filePath, JSON.stringify(joke))
    }
    responce.end()
}