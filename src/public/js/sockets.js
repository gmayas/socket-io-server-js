const dataServices = require("../js/dataServices");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    console.log("There is a new connection...");
    socket.emit("new connection", "Hola bienvenido a nuestra apliación.");
    socket.on("login user", async (req, res) => {
      socket.nickname = req.nickName;
      const findUser = await dataServices.findUser(socket.nickname);
      if (findUser) {
        res({
          nickName: socket.nickname,
          Ok: false,
          position: [],
          msg: "Ya existe un usuario conectado con ese nombre, utilice otro.",
        });
        return;
      } else {
        await dataServices.addNewUser(req);
        //getMessages();
        res({
          nickName: socket.nickname,
          Ok: true,
          position: req?.position,
          msg: `Bienvenido: ${socket.nickname}`,
        });
        welcomeToChat(socket.nickname);
        ListRefreshMap();
      }
    });
    // receive a message a broadcasting
    socket.on("sendMessage", async (req, callback) => {
      //await dataServices.addNewMsg(msg, socket.nickname);
      console.log("Emits message: ", req);
      socket.broadcast.emit("message", {
        user: req?.name,
        text: req?.message,
      });
      callback();
    });
    //Se escucha el evento emitido userCoordinates.
    socket.on("userCoordinates", async (position) => {
      // Se actulizan las position de los usuarios.
      if (JSON.stringify(position) != "{}") {
        await dataServices.updateUser(position);
        //Se transmite y emite a todos los usuarios conectados
        ListRefreshMap();
      } else {
        console.log("vacio");
      }
    });
    socket.on("userLogout", async (req, res) => {
      if (!req?.nickName) {
        console.log("No userLogout ...");
        return;
      }
      socket.broadcast.emit("message", {
        user: "admin",
        text: `${req?.nickName}  has left`,
      });
      await dataServices.deleteUser(req?.nickName);
      //Se transmite y emite a todos los usuarios conectados
      ListRefreshMap();
      res({ logOut: true });
    });

    socket.on("disconnect", async () => {
      console.log("Disconnect socket.nickname:", socket.nickname);
      if (!socket.nickname) {
        console.log("Disconnect only ...");
        return;
      }
      await dataServices.deleteUser(socket.nickname);
      ListRefreshMap();
    });

    const welcomeToChat = async (nickname) => {
      setTimeout(async () => {
        console.log("welcomeToChat: ", true, nickname);
        socket.emit("message", {
          user: "admin",
          text: `${nickname}, welcome to chat.`,
        });
        socket.broadcast.emit("message", {
          user: "admin",
          text: `${nickname} has joined!`,
        });
        let userList = await dataServices.userList();
        socket.broadcast.emit("roomData", userList);
      }, 2000);
    };

    const ListRefreshMap = async () => {
      setTimeout(async () => {
        let userList = await dataServices.userList();
        socket.broadcast.emit("userListRefreshMap", userList);
      }, 2000);
    };

    const getMessages = async () => {
      setTimeout(async () => {
        let messages = await dataServices.getMessages();
        console.log("messages: ", messages);
        socket.emit("load old msgs", messages);
      }, 2000);
    };
  });
};
