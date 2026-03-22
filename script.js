const jokesContainer = document.getElementById("jokes_container")
const jokeForm = document.getElementById("joke_form")
const jokeInput = document.getElementById("joke_input")
const effects = document.getElementById("effects_container")

const likeSound = document.getElementById("like_sound")
const dislikeSound = document.getElementById("dislike_sound")
const boomSound = document.getElementById("boom_sound")

let jokes = []

function fetchJokes() {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'http://localhost:3000/jokes')
    xhr.responseType = 'json'
    xhr.onload = () => {
        jokes = xhr.response || []
        renderJokes()
    }
    xhr.send()
}

function renderJokes() {
    jokesContainer.innerHTML = ''
    jokes.forEach(joke => {
        jokesContainer.innerHTML += `
        <div class="joke" data-id="${joke.id}">
            <p class="joke_text">${joke.text}</p>
            <div class="joke_actions">
                <button type="button" class="like_btn">👍 | Like</button>
                <span class="likes_count">${joke.likes}</span>
                <button type="button" class="dislike_btn">👎 | Dislike</button>
                <span class="dislikes_count">${joke.dislikes}</span>
            </div>
        </div>
        `
    })
}

document.addEventListener("click", e => {
    const jokeElem = e.target.closest(".joke")
    if (!jokeElem) return
    const id = jokeElem.dataset.id

    if (e.target.closest(".like_btn")) {
        e.preventDefault()
        sendReaction('like', id, jokeElem, e)
    }

    if (e.target.closest(".dislike_btn")) {
        e.preventDefault()
        sendReaction('dislike', id, jokeElem, e)
    }
})

function sendReaction(type, id, jokeElem, event) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', `http://localhost:3000/${type}?id=${id}`)
    xhr.onload = () => fetchJokes() 
    xhr.send()

    if(type === 'like'){
        likeSound.currentTime = 0
        likeSound.play()
        spawnEffect("👍", event)
    } else {
        dislikeSound.currentTime = 0
        dislikeSound.play()
        spawnEffect("👎", event)
    }
}

jokeForm.addEventListener("submit", e => {
    e.preventDefault()
    const text = jokeInput.value.trim()
    if(!text) return
    spawnStars()
    setTimeout(()=>{
        addJoke(text)
        boomSound.currentTime = 0
        boomSound.play()
    }, 500)
    jokeInput.value = ""
})

function addJoke(text) {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'http://localhost:3000/jokes')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = () => fetchJokes()
    xhr.send(JSON.stringify({text, likes:0, dislikes:0}))
}

function spawnEffect(icon, e) {
    const element = document.createElement("div")
    element.className = "pop_icon"
    element.textContent = icon
    element.style.left = e.clientX + "px"
    element.style.top = e.clientY + "px"
    effects.appendChild(element)
    setTimeout(()=> element.remove(), 800)
}

function spawnStars() {
    for(let i=0;i<6;i++){
        const star = document.createElement("div")
        star.className = "star"
        star.textContent = "⭐"
        star.style.left = (window.innerWidth/2 + Math.random()*120-60) + "px"
        star.style.top = (window.innerHeight/2) + "px"
        effects.appendChild(star)
        setTimeout(()=> star.remove(), 900)
    }
}

fetchJokes()