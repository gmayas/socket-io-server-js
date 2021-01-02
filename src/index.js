/*var express = require('express');
const http = require("http");
const index = require("./routes/routes");

// App setup
var app = express();
app.use(index);
var socket = require('socket.io')
const port = process.env.PORT || 4001;
var server = app.listen(port, () => console.log(`Listening on port ${port}`));

let io = socket(server)
io.on('connection', function(socket){
  console.log(`${socket.id} is connected`);
});*/


const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/routes");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));
