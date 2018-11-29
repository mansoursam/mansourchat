var socket = io.connect('https://shrouded-forest-10326.herokuapp.com')
//Query DOM
var message = document.getElementById('message');
formElement = document.getElementById('formElement')
username = document.getElementById('username');
output = document.getElementById('output');
button = document.getElementById('send');
feedback = document.getElementById('feedback')
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
var d = new Date();
var m = addZero(d.getMinutes());
var h = addZero(d.getHours());
var messageTime = h + ":" + m
console.log(h + ":" + m)
// Emit events
formElement.addEventListener('submit', (e) => {
    e.preventDefault()
    socket.emit('chat', {
        username: username.value,
        message: message.value,
        time: messageTime
    })
    formElement.reset()
});
message.addEventListener('keypress', () => {
    socket.emit('typing', username.value);
});
socket.on('typing', (data) => {
    feedback.innerHTML = data + ' is typing ...';
    console.log(data);
})
let messagesArray = []
let renderMessages = (array) => {
    console.log(array);
    let html = ''

    array.forEach(data => {
        console.log(data);
        html += '<div><p><strong>' + data.username + ':</strong>' + " " + data.message + '</p>' + '<sub style="color:grey"><i>' + data.time + '</i></sub></div>';

    });
    output.innerHTML = html

}
socket.on('Chat', (message) => {
    console.log(message)
    messagesArray.push(message)
    renderMessages(messagesArray)
    console.log(messagesArray);
})

const userFormElement = document.getElementById('usernameElement')
const userInputElement = document.getElementById('username')
let loginName = ''
userFormElement.addEventListener('submit', (event) => {
    event.preventDefault()
    loginName = userInputElement.value
    userFormElement.classList.toggle('hidden')
    document.getElementById('logInmessage').innerHTML = 'you are logged as ' + '<h5><b><i>' + loginName + '</i></b></h5>';
    socket.emit('login', loginName)
})
socket.on('login', (messages) => {
    messagesArray = [...messages]
    renderMessages(messagesArray)
})
socket.on('userCount', (data) => {
    connectedusers.innerHTML = '<h6><b>' + data.user + ' users are connected</b></h6>'
})



