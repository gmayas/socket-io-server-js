const dataServices = require("../js/dataServices");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    console.log("There is a new connection...");
    //let messages = await Chat.find({}).sort('_id');
    //console.log('messages: ', messages)

    socket.emit("new connection", "Hola bienvenido a nuestra apliación.");
    socket.on("login user", async (req, res) => {
      //console.log("Login user req: ", req);
      socket.nickname = req.nickName;
      const findUser = await dataServices.findUser(socket.nickname);
      //console.log("findUser: ", findUser);
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
        //let userList = await dataServices.userList();
        //Se transmite y emite a todos los usuarios conectados
        ListRefresh();
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
      //console.log("userCoordinates: ", position);
      // Se actulizan las position de los usuarios.
      if (JSON.stringify(position) != "{}") {
        //execute
        await dataServices.updateUser(position);
        //let userList = await dataServices.userList();
        //console.log('userList: ', userList)
        //Se transmite y emite a todos los usuarios conectados
        ListRefresh();
        //newCordinatesList();
      } else {
        console.log("vacio");
      }
    });
    //sockets.emit('userLogout', socket.nickname);
    socket.on("userLogout", async (req, res) => {
      if (!req?.nickName) {
        console.log("No userLogout ...");
        return;
      }
      //console.log("User Logout: ", req?.nickName);
      await dataServices.deleteUser(req?.nickName);
      //let userList = await dataServices.userList();
      //console.log("userList: ", userList);
      //Se transmite y emite a todos los usuarios conectados
      ListRefresh();
      res({ logOut: true });
    });
    socket.on("disconnect", async () => {
      console.log("Disconnect socket.nickname:", socket.nickname);
      if (!socket.nickname) {
        console.log("Disconnect only ...");
        return;
      }
      await dataServices.deleteUser(socket.nickname);
      //let userList = await dataServices.userList();
      //console.log('Disconnect userList:', userList);
      ListRefresh();
    });

    const ListRefresh = async () => {
      setTimeout(async () => {
        let userList = await dataServices.userList();
        //console.log("ListRefresh:", userList);
        socket.broadcast.emit("userListRefresh", userList);
      }, 5000);
    };

    const newCordinatesList = async () => {
      setTimeout(async () => {
        let userList = await dataServices.userList();
        console.log("newCordinatesList:", userList);
        socket.broadcast.emit("newUserCordinates", userList);
    }, 5000);
    };
  });
};
