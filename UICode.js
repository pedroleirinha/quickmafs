class UI {

    constructor(oldgame) {
        this.game = oldgame;
        this.currentlyShowingPlayer = "";
        this.currentlyShowingScore = 0;
        this.gameName = "Quick Mafs";

        $("h1.title").html(this.gameName);
        this.enableClicks(oldgame);
    }

    generateScoreTile() {

        $("#game").append("<div id='scoreTitle'><h1 class='subtitle newgame'>New Game</h1> <h1 class='subtitle save'>Save</h1></div>");
        $("#game").append("<div style='display: flex;'><input id='playerName' type='text' placeholder='Player Name'/></div>");
        $("h1.subtitle.newgame").on("click", () => {this.game.newGame()});

        $("h1.subtitle.save").on("click", () => {

                if ($("#playerName").is(":visible") && $("#playerName").val() != "") {
                        apiRequest("addscore.php", "POST", {
                            "name": $("#playerName").val(),
                            "score": this.game.currentScore,
                            "maxStreak": this.game.maxStreak,
                            "dificulty": this.game.maxDificulty,
                            "questions": JSON.stringify(this.game.questionList),
                        });

                        $("#playerName").fadeOut();
                    } else {
                        $("#playerName").fadeIn();
                    }


                });

            $("#game").append("<div id='scoreTile'></div>"); $("#scoreTile").append("<table class='display'>");
            for (let i = 0; i < self.game.questionList.length; i++) {

                $("#scoreTile table").append("<tr><td>Question " + (i + 1) + ":</td><td> " + self.game.questionList[i].question + " </td><td><span class='" + (self.game.questionList[i].status == 0 ? 'fa fa-check-circle greenAnwser' : 'fa fa-close redAnwser') + "'></span></td></tr>");

            }
            $("#scoreTile").append("</tr></table>");

            $("#game").fadeIn();
        }

        enableClicks() {
            $(".anwserNumber").each(function() {
                $(this).on("click", function() {
                    if (!self.game.checkCorrectAnwser($(this).children()[0].textContent)) {
                        $(this).removeClass("undefinedAnwser").addClass("wrongAnwser");
                        self.game.resetStreak();
                    } else {
                        $(this).removeClass("undefinedAnwser").addClass("rightAnwser");
                        self.game.addStreak();
                    }
                    self.game.currentQuestion.chosenAnwser = $(this).children().html();
                    self.game.ajustDificulty();
                    self.game.updateInfo();
                    $("#anwserTile").fadeOut(400, function() {
                        //New Question
                        self.game.newQuestion();
                        $(this).fadeIn(400);
                    });
                });
            });

            $("#menu span").on("click", function() {
                $("#sideMenu").width(350);
                $("#game,#info").css({
                    opacity: 0.2
                });
                //Clock.pause();
            });
            $(".closebtn").on("click", function() {
                $("#sideMenu").width(0);
                $("#game,#info").css({
                    opacity: 1
                });
                //Clock.resume();
            });
        }
}
