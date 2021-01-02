// Function JQUERY
$(function () {
    const socket = io(); //Global variable io, the server connects and returns a socket to send and listen to events.

    // Obtaining DOM elements from the interface

    // Select the id nickForm
    const $nickForm = $('#nickForm');
    // Select the id nickError
    const $nickError = $('#nickError');
    // Select the id nickName
    const $nickName = $('#nickName');
    // Select the id userNames
    const $userNames = $('#userNames');
    // Select the id message-form
    const $messageForm = $('#message-form');
    // Select the id message
    const $messageBox = $('#message');
    // Select the id chat
    const $chat = $('#chat');

    // Events
    // $nickForm
    $nickForm.submit(e => {
        e.preventDefault();  // Evita el evento de resfrecar la pagina
        if (!($nickName.val().trim() == '')) {
            socket.emit('new user', $nickName.val(), dataResponse => {
                if (dataResponse.Ok) {
                    $('#nickWrap').hide();
                    $('#contentWrap').show();
                    scrollToBottom();
                    $('#message').focus();
                } else {
                    $nickError.html(`<div class="alert alert-danger text-center"><h5>That username already Exists.</h5></div>`);
                };
            });
        }
        $nickName.val(null);
    });
    // $messageForm
    $messageForm.submit(e => {
        e.preventDefault();  // 
        if (!($messageBox.val().trim() == '')) {
            socket.emit('send message', $messageBox.val(), data => {
                $chat.append(`<h5 class="error"><i class="fas fa-exclamation-triangle"></i> ${data}</h5>`)
                scrollToBottom();
            }); // Se emite el mensaje
        }
        $messageBox.val(null);
    });
    // Se escucha el evento new message
    socket.on('new message', (message) => {
        displayMsg(message);

    });
    // Se escucha el evento usernames
    socket.on('usernames', (userNames) => {
        let html = '';
        userNames.map((currentValue) => {
            html += (`<h5><i class="fas fa-user"></i> ${currentValue} </h5>`);
        });
        $userNames.html(html);
    });

    socket.on('whisper', data => {
        $chat.append(`<h5><i class="fas fa-user"></i> ${data.nick} says in private: <b class="whisper">${data.msg}</b></h5>`);
        scrollToBottom();
    });

    socket.on('load old msgs', msgs => {
        msgs.map((currentValue) => {
            displayMsg(currentValue);
        });
    });

    socket.on('msg new user', data => {
        displayMsgNewUser(data);
    });

    socket.on('msg user logout', data => {
        displayMsgUserLogout(data);
    });

    displayMsg = (data) => {
        $chat.append(`<h5><i class="fas fa-user"></i> ${data.nick} says: <b class="text-info">${data.msg}</b></h5>`);
        scrollToBottom();
    }

    displayMsgNewUser = (data) => {
        $chat.append(`<h5 class="new-user"><i class="fas fa-user-plus"></i> ${data} joined the Chat...</h5>`);
        scrollToBottom();
    };

    displayMsgUserLogout = (data) => {
        $chat.append(`<h5 class="text-danger"><i class="fas fa-user-minus"></i> ${data} left the Chat...</h5>`);
        scrollToBottom();
    };

    scrollToBottom = () => {
        $($chat).scrollTop(Math.pow($($chat).height(), 2));
    };
});

