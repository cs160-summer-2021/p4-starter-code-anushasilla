window.onload = function() {

    var user_name = "Steve Rogers";
    var user_pts = 0;
    var pts_per_action = 5;

    $(".thumbs-up, .thumbs-down, .hearts, .comment").click(function() {
        var name = $(this).attr('id');
        send_info($(this).attr('class'), name, $("#" + name).val());
    });

    var socket = new WebSocket('ws://' + window.location.host + '/ws/draw'); 
    function send_info(type, name, content) {
        user_pts += pts_per_action;
        socket.send("{\"type\" : \"" + type + "\", \"name\" : \"" + name + 
            "\", \"content\" : \"" + content + "\", \"user_name\" : \"" + user_name + "\", \"points\" : " + user_pts + "}" );
    }

    socket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };
}