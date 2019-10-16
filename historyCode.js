const FILEPATH = "http://www.incomevsexpense.com/quickmath/api/";
//const FILEPATH = "http://localhost/poleirinha/QuickMaths/api/";



var apiRequest = function(url, type, data, functionCallBack) {
    $.ajax({
        type: type,
        url: FILEPATH + url,
        data: data,
        success: function(returnedData) {
            if(type == "GET"){
                functionCallBack(returnedData);
            }
        }
    });
}

function historyUI(page){

    var historyQuestions = function(jsonText){

        $("#historySimpleView").append("<div class='subtitle'>Last Rounds!</div>");

        var obj = JSON.parse(jsonText);
        for (var i = 0; i < obj.length; i++) {
            let row = obj[i];
            if(i==0)
            {
                currentlyShowingPlayer = row[0];
                currentlyShowingScore = row[3];
                apiRequest("getscores.php?playerName="+currentlyShowingPlayer+"&score="+currentlyShowingScore,"GET",null, displayQuestionsInfo);
            }
            $("#historySimpleView").append("<div class='displayedQuestion'>"+row[0]+"<br>"+row[3]+"</div>");
        }

        $(".displayedQuestion").on("click",function(){
            let text = $(this).html().split("<br>");
            $("#historyDetail table").fadeOut();
            $("#historyDetail").empty();
            currentlyShowingPlayer = text[0];
            currentlyShowingScore = text[1];
            apiRequest("getscores.php?playerName="+currentlyShowingPlayer+"&score="+currentlyShowingScore,"GET",null, displayQuestionsInfo);
        });
    }

    var displayQuestionsInfo = function(returnedJSON){
        var obj = JSON.parse(returnedJSON);

        $("#historyDetail").append("<h1><span class='subtitle'>Name:</span> "+currentlyShowingPlayer+"     <span class='subtitle'>Score:</span> "+currentlyShowingScore+"</h1>");
        $("#historyDetail").append("<table style='display : none' class='display'></table>");

        for (let i = 0; i < obj.length; i++) {
            let row = obj[i];
            $("#historyDetail table").append("<tr><td>Question " + (i + 1) + ":</td><td> " + row[0] + " </td><td><span class='" + (row[1] == row[2] ? 'fa fa-check-circle greenAnwser' : 'fa fa-close redAnwser') + "'></span></td></tr>");

        }

        $("#historyDetail table").fadeIn();
    }


    $("#menu span").on("click", function() {
        $("#sideMenu").width(350);
        $("#historyDetail,#historySimpleView").css({
            opacity: 0.2
        });
        //Clock.pause();
    });
    $(".closebtn").on("click", function() {
        $("#sideMenu").width(0);
        $("#historyDetail,#historySimpleView").css({
            opacity: 1
        });
        //Clock.resume();
    });

    apiRequest("getscores.php" + (page == "highscores" ? "?type=highscores": "" ), "GET", null, historyQuestions);
}
