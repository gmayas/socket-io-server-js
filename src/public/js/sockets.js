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
        getMessages();
        ListRefreshMap();
        ListRefreshChat();
        res({
          nickName: socket.nickname,
          Ok: true,
          position: req?.position,
          msg: `Bienvenido: ${socket.nickname}`,
        });
      }
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
      await dataServices.deleteUser(req?.nickName);
      //Se transmite y emite a todos los usuarios conectados
      ListRefreshMap();
      ListRefreshChat();
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
      ListRefreshChat();
    });

    const ListRefreshMap = async () => {
      setTimeout(async () => {
        let userList = await dataServices.userList();
        socket.broadcast.emit("userListRefreshMap", userList);
      }, 2000);
    };

    const ListRefreshChat = async () => {
      setTimeout(async () => {
        let userList = await dataServices.userList();
        console.log("userListRefreshChat:", userList);
        socket.broadcast.emit("userListRefreshChat", userList);
      }, 2000);
    };

    const getMessages = async () => {
      setTimeout(async () => {
        let messages = await dataServices.getMessages();
        console.log("messages: ", messages);
      }, 2000);
    };
  });
};
