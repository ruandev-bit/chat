//login elements 
const login = document.querySelector(".login")
const loginForm = document.querySelector(".login-form")
const loginInput = document.querySelector(".login-input")

//chat elements 
const chat = document.querySelector(".chat")
const chatForm = document.querySelector(".chat-form")
const chatInput = document.querySelector(".chat-input")
const chatmessages = document.querySelector(".chat-messages")



const colors = [
    "aqua",
    "blueviolet",
    "chartreuse",
    "goldenrod",
    "lightpink",
    "yellow",
    "gold"
]

const user = { id: "", name: "", color: "" }

let websocket

function createMessageSelfElement(content) {
    const div = document.createElement("div")

    div.classList.add("message-self")
    div.innerHTML = content

    return div
}

function createMessageOtherElement(content, sender, senderColor) {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message-other")

    div.classList.add("message-self")
    span.classList.add("message-sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}


function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

function scrollScreen() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}


function processMessage({ data }) {
    const { useId, userName, userColor, content } = JSON.parse(data)

    const message = useId == user.id 
    ? createMessageSelfElement(content) 
    : createMessageOtherElement(content, userName, userColor)

    chatmessages.appendChild(message)

    scrollScreen()
}


const handleLogin = (event) => {
    event.preventDefault()
    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"


    websocket = new WebSocket("ws://localhost:8080")
    websocket.onmessage = processMessage



}

function sendMessage(event) {
    event.preventDefault()

    const message = {
        useId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ""

}


loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)