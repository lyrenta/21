const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const dataPath = path.join(__dirname, 'data')

const server = http.createServer((request, response) => { 
    try {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (request.method === 'OPTIONS') {
            response.writeHead(204);
            return response.end();
        }

        if (request.url == "/jokes" && request.method === 'GET') {
            getAllJokes(response)
        } else if (request.url == "/jokes" && request.method === 'POST') {
            addJoke(request, response)
        } else if (request.url.startsWith('/like')) {
            like(request, response)
        } else if (request.url.startsWith('/dislike')) {
            dislike(request, response)
        } else {
            response.statusCode = 404
            response.end('Not Found')
        }
    } catch(e) {
        response.statusCode = 500;
        response.end('Error 500')
    } 
})

server.listen(3000, () => console.log('Server running on port 3000'))

function getAllJokes(response) {
    let dir = fs.readdirSync(dataPath).filter(f => f.endsWith('.json'))
    let allJokes = []

    for (let i = 0; i < dir.length; i++) {
        let file = fs.readFileSync(path.join(dataPath, dir[i]))
        let joke = JSON.parse(file)
        joke.id = i
        allJokes.push(joke)
    }

    response.end(JSON.stringify(allJokes))
}

function addJoke(request, response) {
    let data = ''
    request.on('data', chunk => data += chunk)
    request.on('end', () => {
        let joke = JSON.parse(data)
        joke.likes = 0
        joke.dislikes = 0

        let dir = fs.readdirSync(dataPath)
        let fileName = dir.length + '.json'
        fs.writeFileSync(path.join(dataPath, fileName), JSON.stringify(joke))

        response.end()
    })
}

function like(request, response) {
    const params = url.parse(request.url, true).query
    const id = params.id
    if (id !== undefined) {
        const filePath = path.join(dataPath, id + '.json')
        const joke = JSON.parse(fs.readFileSync(filePath))
        joke.likes++
        fs.writeFileSync(filePath, JSON.stringify(joke))
    }
    response.end()
}

function dislike(request, response) {
    const params = url.parse(request.url, true).query
    const id = params.id
    if (id !== undefined) {
        const filePath = path.join(dataPath, id + '.json')
        const joke = JSON.parse(fs.readFileSync(filePath))
        joke.dislikes++
        fs.writeFileSync(filePath, JSON.stringify(joke))
    }
    response.end()
}