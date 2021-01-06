module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("There is a new connection...");
    socket.emit("new connection", "Hola bienvenido a nuestra apliación.");
    socket.on("login user", (req, res) => {
      socket.nickname = req;
      console.log("Login user: ", socket.nickname);
      res({
        Ok: true,
        nickName: socket.nickname,
      });
      //Se escucha el evento emitido userCoordinates. 
      socket.on('userCoordinates', (coords) => {
        console.log('userCoordinates: ', coords);
        //Se transmite y emite a todos los usuarios conectados
        socket.broadcast.emit('newUserCordinates', coords);
    });
    });
    socket.on("disconnect", () => {
      console.log("Disconnect only ...");
    });
  });
};
