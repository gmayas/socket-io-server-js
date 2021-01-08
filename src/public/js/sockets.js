//const Chat = require('../../models/Chat');
const Users = require("../../models/Users");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    console.log("There is a new connection...");
    //let messages = await Chat.find({}).sort('_id');
    //console.log('messages: ', messages)

    socket.emit("new connection", "Hola bienvenido a nuestra apliación.");
    socket.on("login user", async (req, res) => {
      console.log("Login user req: ", req);
      socket.nickname = req.nickName;
      const findUser = await Users.findOne(
        { nickName: socket.nickname },
        (err, data) => {
          if (err) {
            console.log("Error findOne", err);
          } else {
            console.log("Data findOne Ok");
          }
        }
      );
      console.log("findUser: ", findUser);
      if (findUser) {
        res({
          nickName: socket.nickname,
          Ok: false,
          position: [],
          msg: "Ya existe un usuario conectado con ese nombre, utilice otro.",
        });
        return;
      } else {
        var newUser = new Users({
          nickName: req?.nickName,
          position: req?.position,
          online: req?.online,
          updated: Date.now(),
        });
        console.log("Login user newUser: ", newUser);
        await newUser.save();
        let userList = await Users.find({}).sort("_id");
        //Se transmite y emite a todos los usuarios conectados
        socket.broadcast.emit("userListRefresh", userList);
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
      console.log("userCoordinates: ", position);
      // Se actulizan las position de los usuarios.
      if (JSON.stringify(position) != "{}") {
        //execute
        await Users.updateOne(
          { nickName: position?.userData?.nickName },
          {
            position: position.LatLng,
            updated: Date.now(),
          },
          (err, data) => {
            if (err) {
              console.log("Error updated!", err);
            } else {
              console.log("Data updated!");
            }
          }
        );
        let userList = await Users.find({}).sort("_id");
        //Se transmite y emite a todos los usuarios conectados
        socket.broadcast.emit("newUserCordinates", userList);
      } else {
        console.log("vacio");
      }
    });
    //sockets.emit('userLogout', socket.nickname);
    socket.on("userLogout", async (req, res) => {
      console.log("User Logout: ", req?.nickName);
      await Users.remove({ nickName: req?.nickName },  (err) => {
        if (err) {
          console.log("Error removed!", err);
        } else {
          console.log("Data removed!");
        }
      });
      let userList = await Users.find({}).sort("_id");
      //console.log("userList: ", userList);
      //Se transmite y emite a todos los usuarios conectados
      res(
        { logOut: true } 
      )
      socket.broadcast.emit("userListRefresh", userList);
    });
    socket.on("disconnect", () => {
      console.log("Disconnect only ...");
    });
  });
};
