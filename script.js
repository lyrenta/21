const jokesContainer = document.getElementById("jokes_container")
const jokeForm = document.getElementById("joke_form")
const jokeInput = document.getElementById("joke_input")
const effects = document.getElementById("effects_container")

const likeSound = document.getElementById("like_sound")
const dislikeSound = document.getElementById("dislike_sound")
const boomSound = document.getElementById("boom_sound")

const xhr = new XMLHttpRequest();

document.addEventListener("click", function(e){

    if(e.target.closest(".like_btn")){

        const joke = e.target.closest(".joke")
        const count = joke.querySelector(".likes_count")

        count.textContent = Number(count.textContent) + 1

        likeSound.currentTime = 0
        likeSound.play()

        spawnEffect("👍", e)

    }

    if(e.target.closest(".dislike_btn")){

        const joke = e.target.closest(".joke")
        const count = joke.querySelector(".dislikes_count")

        count.textContent = Number(count.textContent) + 1

        dislikeSound.currentTime = 0
        dislikeSound.play()

        spawnEffect("👎", e)

    }

})

function spawnEffect(icon, e){

    const element = document.createElement("div")
    element.className = "pop_icon"
    element.textContent = icon

    element.style.left = e.clientX + "px"
    element.style.top = e.clientY + "px"

    effects.appendChild(element)

    setTimeout(()=>{
        element.remove()
    },800)

}

jokeForm.addEventListener("submit", function(e){

    e.preventDefault()

    const text = jokeInput.value.trim()

    if(!text) return

    spawnStars()

    setTimeout(()=>{

        addJoke(text)

        boomSound.currentTime = 0
        boomSound.play()

    },500)

    jokeInput.value = ""

})

function addJoke(text){

    const joke = document.createElement("div")
    joke.className = "joke"

    joke.innerHTML = `

        <p class="joke_text">${text}</p>

        <div class="joke_actions">

            <button class="like_btn">👍 | Like</button>
            <span class="likes_count">0</span>

            <button class="dislike_btn">👎 | Dislike</button>
            <span class="dislikes_count">0</span>

        </div>

    `

    jokesContainer.prepend(joke)

}

function spawnStars(){

    for(let i=0;i<6;i++){

        const star = document.createElement("div")
        star.className = "star"
        star.textContent = "⭐"

        star.style.left = (window.innerWidth/2 + Math.random()*120-60) + "px"
        star.style.top = (window.innerHeight/2) + "px"

        effects.appendChild(star)

        setTimeout(()=>{
            star.remove()
        },900)

    }

}

xhr.open('GET', 'http://localhost:3000/jokes');
xhr.send();
xhr.onload = () => console.log(xhr.responce)