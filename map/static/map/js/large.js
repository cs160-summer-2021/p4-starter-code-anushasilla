window.onload = function() {

    var points = {"Jane": 25, "Alex": 10, "John": 5, "Anonymous": 15, "Mary": 5};
    var ranking = updateRankingHtml(points);
    
    var socket = new WebSocket(
        'wss://' + window.location.host + '/wss/draw'); 

    socket.onmessage = function(receivedMessage) {
        var obj = JSON.parse(receivedMessage.data);
        points[obj['user_name']] = obj['points'];

        // update HTML with jquery
        ranking = updateRankingHtml(points);
        updateIconHtml(obj);
    }

    function updateIconHtml(obj) {

        if (obj['type'] == "comment") {
            var content = obj['name'].toUpperCase() + ": Latest Update by Anonymous (0 minutes ago) - " + obj['content'];
            $("#" + obj['name']).empty();
            $("#" + obj['name']).append(content);
        } else {
            var content = parseInt($('#' + obj['type']).text()) + 1;
            $("#" + obj['type']).empty();
            $("#" + obj['type']).append(content);
        }
    }

    function updateRankingHtml(points) {
        var names_lst = Object.keys(points);
        var new_ranking = [];
        var names_len = names_lst.length;
        for (var i=0; i < names_len; i++) {
            var max_points = points[names_lst[0]];
            var max_index = 0;
            for (var j=0; j < names_lst.length; j++) {
                if (points[names_lst[j]] > max_points) {
                    max_points = points[names_lst[j]];
                    max_index = j;
                }
            }
            new_ranking.push({"name": names_lst[max_index], "points": max_points, "rank": new_ranking.length + 1})
            names_lst.splice(max_index, 1);
        }

        $("#ranking").empty();
        for (var i=0; i < new_ranking.length; i++) {
            var r = new_ranking[i]["rank"];
            var n = new_ranking[i]["name"];
            var p = new_ranking[i]["points"];
            $("#ranking").append("<tr><td>" + r + "</td><td>" + n + "</td><td>" + p + "</td></tr>");
        }
        return new_ranking;
    }

    socket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };
}