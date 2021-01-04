const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
const dotenv = require('dotenv'); 
dotenv.config();

const port = process.env.PORT || 4001;
const index = require("./routes/routes");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

// Sockets
require('../src/public/js/sockets')(io);

server.listen(port, () => console.log(`Listening on port ${port}`));
