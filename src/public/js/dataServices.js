const Chat = require("../../models/Chat");
const Users = require("../../models/Users");

const getMessages = async () => {
  return await Chat.find({}, (err, data) => {
    if (err) {
      console.log("Error find", err);
    } else {
      console.log("Data find Ok");
    }
  }).sort("_id");
};

const addNewMsg = async (msg, nickName) => {
  let newMsg = new Chat({
    msg,
    nick: nickName
  });
  console.log("newMsg: ", newMsg);
  await newMsg.save((err, data) => {
    if (err) {
      console.log("Error addNewMsg", err);
    } else {
      console.log("Data addNewMsg Ok");
    }
  });
};

const userList = async () => {
  return await Users.find({}, (err, data) => {
    if (err) {
      console.log("Error find", err);
    } else {
      console.log("Data find Ok");
    }
  }).sort("_id");
};

const findUser = async (nickname) => {
  return await Users.findOne({ nickName: nickname }, (err, data) => {
    if (err) {
      console.log("Error findOne", err);
    } else {
      console.log("Data findOne Ok");
    }
  });
};

const addNewUser = async (req) => {
  let newUser = new Users({
    nickName: req?.nickName,
    position: req?.position,
    online: req?.online,
    updated: Date.now(),
  });
  //console.log("Login user newUser: ", newUser);
  await newUser.save((err, data) => {
    if (err) {
      console.log("Error addNewUser", err);
    } else {
      console.log("Data addNewUser Ok");
    }
  });
};

const updateUser = async (position) => {
  //console.log('updateUser position: ', position)
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
};

const deleteUser = async (nickname) => {
  //console.log('deleteUser nickname: ', nickname)
  await Users.deleteMany({ nickName: nickname }, (err) => {
    if (err) {
      console.log("Error removed!", err);
    } else {
      console.log("Data removed!");
    }
  });
};

module.exports = { getMessages, addNewMsg, userList, findUser, addNewUser, updateUser, deleteUser };
