window.onload = function() {

    var user_name = "You";
    var user_pts = 0;
    var pts_per_action = 5;

    $(".up, .down, .heart, .comment").click(function() {
        var name = $(this).attr('id');
        send_info($(this).attr('class'), name, $("#" + name).val());
        console.log(name);
        if ($(this).attr('class') == "comment") {
            var comment = "Latest Update by Anonymous (0 minutes ago): " + $("#" + name).val();
            $("#latest").empty();
            $("#latest").append(comment);
        } else {
            var content = parseInt($('#' + $(this).attr('class')).text()) + 1;
            $("#" + $(this).attr('class')).empty();
            $("#" + $(this).attr('class')).append(content);
        }
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