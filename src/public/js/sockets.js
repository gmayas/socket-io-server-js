const dataServices = require("../js/dataServices");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    console.log("There is a new connection...");
    socket.emit("new connection", "Hello, welcome to Map & Chat");
    socket.on("login user", async (req, res) => {
      socket.nickname = req.nickName;
      const findUser = await dataServices.findUser(socket.nickname);
      if (findUser) {
        res({
          nickName: socket.nickname,
          Ok: false,
          position: [],
          msg: "Hello, there is already a user connected with that name, use another",
        });
        return;
      } else {
        await dataServices.addNewUser(req);
        res({
          nickName: socket.nickname,
          Ok: true,
          position: req.position,
          msg: `Welcome: ${socket.nickname}`,
        });
        welcomeToChat(socket.nickname);
        ListRefreshMap();
      }
    });

    socket.on("getRoomData", async (req, res) => {
      ListRefreshChat();
      res(true);
    });

    socket.on("loadoldmsgs", async (req, res) => {
      let msgOlds = await dataServices.getMessages();
      res(msgOlds);
    });

    socket.on("sendMessage", async (req, callback) => {
      let { name, message } = req;
      await dataServices.addNewMsg(name, message);
      socket.broadcast.emit("message", {
        user: name,
        text: message,
      });
      callback();
    });

    socket.on("userCoordinates", async (position) => {
      if (JSON.stringify(position) != "{}") {
        await dataServices.updateUser(position);
        ListRefreshMap();
      } else {
        console.log("vacio");
      }
    });

    socket.on("userLogout", async (req, res) => {
      if (!req.nickName) {
        console.log("No userLogout ...");
        return;
      }
      await dataServices.deleteUser(req.nickName);
      byeUser(req.nickName);
      res({ logOut: true });
    });

    socket.on("disconnect", async () => {
      console.log("Disconnect socket.nickname:", socket.nickname);
      if (!socket.nickname) {
        console.log("Disconnect only ...");
        return;
      }
      await dataServices.deleteUser(socket.nickname);
      byeUser(socket.nickname);
    });

    const welcomeToChat = (nickname) => {
      setTimeout(() => {
        socket.broadcast.emit("message", {
          user: "Admin",
          text: `${nickname} has joined!`,
        });
        ListRefreshChat();
      }, 1000);
    };

    const byeUser = (nickname) => {
      setTimeout(() => {
        console.log("byeUser: ", true, nickname);
        socket.broadcast.emit("message", {
          user: "Admin",
          text: `${nickname} has left.`,
        });
        ListRefreshChat();
        ListRefreshMap();
      }, 1000);
    };

    const ListRefreshMap = () => {
      setTimeout(async () => {
        let userList = await dataServices.userList();
        socket.broadcast.emit("userListRefreshMap", userList);
      }, 1000);
    };

    const ListRefreshChat = () => {
      setTimeout(async () => {
        let userList = await dataServices.userList();
        socket.broadcast.emit("roomData", userList);
      }, 1000);
    };
  });
};
