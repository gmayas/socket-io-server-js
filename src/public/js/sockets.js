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
    });
    socket.on("disconnect", () => {
      console.log("Disconnect only ...");
    });
  });
};
