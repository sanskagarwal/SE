var socket = io();

function scrollToBottom() {
    var messages = $("#message-list");
    var newMessage = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    console.log("connected to server");
});

socket.on('disconnect', function () {
    console.log("Disconnected from server");
});

socket.on("newMessage", function (message) {
    var template = $("#message-template").html();
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var html = Mustache.render(template, {
        text: message.text,
        admin: message.admin,
        createdAt: formattedTime,
        from: message.from
    });
    $("#message-list").append(html);
    scrollToBottom();
});

$("#message-form").on("submit", function (e) {
    e.preventDefault();
    var messageText = $("[name='message']").val().trim();
    if (messageText === "") {
        return false;
    }
    socket.emit("createMessage", { text: messageText }, function () {
        $("[name='message']").val("");
    });
});
