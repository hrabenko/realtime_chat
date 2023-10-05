const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname+"/public")))

const registeredUsernames = [];

io.on("connection", function(socket) {
    socket.on("newuser", function(username) {
        if (registeredUsernames.includes(username)) {
            socket.emit("error");
        } else {
            registeredUsernames.push(username);
            socket.broadcast.emit("update", username + " joined the conversation");
            socket.emit("success");
        }
    });
    socket.on("exituser", function(username) {
        socket.broadcast.emit("update", username + " left the conversation");
        const index = registeredUsernames.indexOf(username);
        if (index !== -1) {
            registeredUsernames.splice(index, 1);
        }
    });
    socket.on("chat", function(message) {
        socket.broadcast.emit("chat", message);
    });
});

server.listen(3000);