window.onload = function() {

    var points = {"Bob Johnson": 15, "Emily Williams": 5, "Jessica Johnson": 25};
    var ranking = updateRankingHtml(points);
    
    var empty = {"comments": [], "up": 0, "down": 0, "heart": 0};
    var data = {"water": JSON.parse(JSON.stringify(empty)), "study": JSON.parse(JSON.stringify(empty)), 
        "restroom": JSON.parse(JSON.stringify(empty))};

    var curr_displayed_icon = ""; // icon user clicked on (default empty string)
    var display_names = {"water": "Water Fountain", "restroom": "Restroom", "study": "Study Spot"};
    
    var socket = new WebSocket(
        'ws://' + window.location.host + '/ws/draw'); 

    socket.onmessage = function(receivedMessage) {

        var obj = JSON.parse(receivedMessage.data);
        var new_data = data[obj['name']];
        if (obj['type'] == "comment") {
            new_data["comments"].push(obj['content']);
        } else {
            new_data[obj['type']] += 1;
        }

        points[obj['user_name']] = obj['points'];

        // update HTML with jquery
        ranking = updateRankingHtml(points);
        updateIconHtml(data, curr_displayed_icon, obj);

        console.log(data);
        console.log(ranking);
    }

    function updateIconHtml(data, displayed_icon, obj) {

        if (obj['type'] == "comment") {
            var content = obj['name'].toUpperString() + ": Latest Update by Anonymous (0 minutes ago) - " + obj['content'];
            
        } else {
            var content = $('#' + obj['name']).text().parseInt() + 1;
        }
        $("#" + obj['name']).empty();
        $("#" + obj['name']).append(content);
        
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
            $("#ranking").append("<span>  " + new_ranking[i]["rank"] + "  </span>");
            $("#ranking").append("<span>  " + new_ranking[i]["name"] + "  </span>");
            $("#ranking").append("<span>  " + new_ranking[i]["points"] + "  </span><br><br>");
        }
        return new_ranking;
    }

    socket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };
}