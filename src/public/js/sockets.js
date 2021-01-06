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
      console.log("Login user: ", socket.nickname);
      
      res({
        nickName: socket.nickname,
        Ok: true,
      });
      var newUser = new Users({
        nickName: req?.nickName,
        position: req?.position,
        online: req?.online,
        updated: Date.now(),
      });
      //console.log("Login user newUser: ", newUser);
      //await newUser.save();

      /*await Users.remove({nickName: req?.nickName},  (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Data Deleted!", data);
        }
      });*/
          
      await Users.updateOne(
        {nickName: req?.nickName},
         {
            position: req?.position,
            online: false,
            updated: Date.now()
           },
           (err, data) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Data updated!", data);
            }
          }
        
      );
      let UsersList = await Users.find({}).sort("_id");
      console.log('UsersList: ', UsersList)

      //Se escucha el evento emitido userCoordinates.
      socket.on("userCoordinates", (coords) => {
        console.log("userCoordinates: ", coords);
        //Se transmite y emite a todos los usuarios conectados
        socket.broadcast.emit("newUserCordinates", coords);
      });
    });
    socket.on("disconnect", () => {
      console.log("Disconnect only ...");
    });
  });
};
