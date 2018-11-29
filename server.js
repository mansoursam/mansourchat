const express = require('express');
const socketIO = require('socket.io');
const fs = require('fs')
const app = express();
const moment = require('moment');
var port = process.env.PORT || 8002;

app.use(express.static('public'));
var server = app.listen(port, () => {
    console.log('Server started');
});

const io = socketIO(server)
var connections = []
var connectedUsers = 0
io.on('connection', (socket) => {
    connections.push(socket)
    connectedUsers++;
    io.sockets.emit('userCount', {
        user: connectedUsers
    })
    console.log(`${connections.length}user is connected`);
    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1)
        connectedUsers--;
        io.sockets.emit('userCount', {
            user: connectedUsers
        })
        console.log(`${connections.length} user  connected `)
    })
    socket.on('chat', (message) => {
        fs.readFile('./public/chat.json', (err, data) => {
            if (err) throw err
            let json = JSON.parse(data)
            console.log(data);
            json.push(message)
            console.log(message)
            fs.writeFile('./public/chat.json', JSON.stringify(json), (err) => {
                console.log(json)
            })
        })
        io.emit('Chat', message)
    })
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data)
    })
    socket.on('login', (username) => {
        fs.readFile('./public/chat.json', (err, data) => {
            if (err) console.log(err)
            const json = JSON.parse(data)
            socket.emit('login', json)
        })
    })
})