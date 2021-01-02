const Chat = require('../../models/Chat');

module.exports = io => {

  let users = {};

  io.on('connection', async socket => {
    console.log('There is a new connection...')
    let messages = await Chat.find({}).sort('_id');
    socket.emit('load old msgs', messages);

    socket.on('new user', (data, cb) => {
      if (data in users) {
        cb({
          Ok: false,
          nickname: ''
        });
      } else {
        socket.nickname = data;
        users[socket.nickname] = socket;
        console.log('Enter the Chat: ', socket.nickname);
        io.sockets.emit('msg new user', socket.nickname);
        cb({
          Ok: true,
          nickname: socket.nickname
        });
        updateNicknames();
      }
    });

    // receive a message a broadcasting
    socket.on('send message', async (data, cb) => {
      var msg = data.trim();
      if (msg.substr(0, 1) === '@') {
        msg = msg.substr(1);
        var index = msg.indexOf(' ');
        if (index !== -1) {
          var name = msg.substring(0, index);
          var msg = msg.substring(index + 1);
          if (name in users) {
            console.log('Emits private message: ', socket.nickname);
            users[name].emit('whisper', {
              msg,
              nick: socket.nickname
            });
          } else {
            cb('Error! Enter a valid User');
          }
        } else {
          cb('Error! Please enter your message');
        }
      } else {
        var newMsg = new Chat({
          msg,
          nick: socket.nickname
        });
        await newMsg.save();
        console.log('Emits message: ', socket.nickname);
        io.sockets.emit('new message', {
          msg,
          nick: socket.nickname
        });
      }
    });

    socket.on('disconnect', () => {
      if (!socket.nickname) {
        console.log('Disconnect only ...');
        return;
      };
      console.log('Disconnects: ', socket.nickname);
      io.sockets.emit('msg user logout', socket.nickname);
      delete users[socket.nickname];
      updateNicknames();
    });

    updateNicknames = () => {
      io.sockets.emit('usernames', Object.keys(users));
    }
  });

};