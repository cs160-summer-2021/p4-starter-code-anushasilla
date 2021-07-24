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
        updateIconHtml(data, curr_displayed_icon);

        console.log(data);
        console.log(ranking);
    }

    function updateIconHtml(data, displayed_icon) {
        displayed_icon = "restroom"; // for testing water fountain - update later
        $("#displayed-icon").empty();
        $("#displayed-icon").append("<h2>" + display_names[displayed_icon] + "</h2>");
        $("#displayed-icon").append("<p>  Thumbs Up: " + data[displayed_icon]["up"] + "  </p>");
        $("#displayed-icon").append("<p>  Thumbs Down: " + data[displayed_icon]["down"] + "  </p>");
        $("#displayed-icon").append("<p>  Hearts: " + data[displayed_icon]["heart"] + "  </p>");
        $("#displayed-icon").append("<h6>  Comments:  </h6><br>");
        for (var i=0; i < data[displayed_icon]["comments"].length; i++) {
            var comment = data[displayed_icon]["comments"][i];
            if (i < data[displayed_icon]["comments"].length - 1) {
                comment += ", "
            }
            $("#displayed-icon").append( "<p>  " + comment + "  </p>" );
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