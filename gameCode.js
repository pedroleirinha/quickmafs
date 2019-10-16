//Global Variables
var gameSeconds = 60;
var startDificulty = 1;

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

class Question {

    constructor(questionDificulty) {
        this.result = 0;
        this.status = null;
        this.question = "";
        this.chosenAnwser = 0;

        this.numberOperators = 0;
        this.numberOperations = 0;

        this.anwsers = new Array();
        this.availableOperators = ['+', '-', '*'];
        this.randomanswerFactor = 50;
        this.dificulty = questionDificulty;

        this.getNewQuestion(this.dificulty);
        this.result = eval(this.question);

        $(".questionNumber").html(this.question);
        $(".anwserNumber").each(function() {
            $(this).removeClass().addClass("anwserNumber undefinedAnwser");
        });

        this.generateAnwsers(this.result);
    }

    getNewQuestion(){
        let numbers = Array();
        let operators = Array();
        let maxRandomNumber;

        switch (this.dificulty) {
            case 1:
                this.numberOfOperations = 2;
                this.numberOfOperators = 1;
                maxRandomNumber = 20;
                break;
            case 2:
                this.numberOfOperations = 2;
                this.numberOfOperators = 1;
                maxRandomNumber = 50;
                break
            case 3:
                this.numberOfOperations = 3;
                this.numberOfOperators = 2;
                maxRandomNumber = 80;
                break
            case 4:
                this.numberOfOperations = 3;
                this.numberOfOperators = 2;
                maxRandomNumber = 90;
                break
            default:

        }

        for (let i = 0; i < this.numberOfOperations; i++) {
            numbers[i] = this.gerarRandomNumber(1, maxRandomNumber);
        }

        for (let i = 0; i < this.numberOfOperators; i++) {
            let number = this.gerarRandomNumber(0, this.availableOperators.length - 1);
            operators[i] = this.availableOperators[number];;
        }
        for (let i = 0; i < this.numberOfOperations; i++) {
            if (numbers[i] != null) {
                this.question += numbers[i];
            }
            if (operators[i] != null) {
                this.question += " " + operators[i] + " ";
            }
        }
    }

    gerarRandomNumber(min, max) {
        return Math.floor(Math.random() * (max + 1)) + min;
    }

    generateAnwsers(base) {
        var list = Array();

        for (let i = 0; i <= this.randomanswerFactor * 2; i++) {
            if (base - this.randomanswerFactor + i != base) {
                list.push(base - this.randomanswerFactor + i);
            }
        }

        for (let i = 0; i < 4; i++) {
            var rndAnwser = this.gerarRandomNumber(0, list.length - 1);
            this.anwsers[i] = list[rndAnwser];
            list.splice(rndAnwser, 1);

        }

        let index = this.gerarRandomNumber(0, 3);
        this.anwsers[index] = base;

        for (let i = 0; i < 4; i++) {
            $("#anwserTile div span")[i].innerHTML = this.anwsers[i];
        }

    }
}

class Clock {
  constructor(gameSeconds,game) {
    this.totalSeconds = gameSeconds;
    this.game = game;
  }

  start(){
    self = this;
    this.interval = setInterval(function() {
        self.totalSeconds--;
        let temp = self.totalSeconds.toString().padStart(2,"0");

        $("#clock").text("00:"+temp);

        if (self.totalSeconds <= 0) {
            $("#clock").text("Game Over!");
            self.pause();
            $("#game").hide();
            $("#questionTile,#anwserTile,#gametitle").hide();

            self.game.ui.generateScoreTile();
        }

    }, 1000);
  }

  pause() {
      clearInterval(this.interval);
      delete this.interval;
  }

  resume() {
      if (!this.interval) this.start();
  }

  reset() {
      this.totalSeconds = gameSeconds;
      this.start();
  }
}

class Game {

    constructor() {
        this.clock = new Clock(gameSeconds,this);

        this.questionList = new Array();
        this.currentQuestion = null;
        this.maxDificulty = 0;
        this.maxStreak = 0;
        this.currentScore = 0

        this.dificulty = startDificulty;
        this.correctAnwserStreak = 0;
        this.basePoints = 50;
        this.ui = new UI(this);
        this.newGame();
    }

    checkCorrectAnwser(pickedAnswer) {
        this.currentQuestion.status = pickedAnswer == this.currentQuestion.result ? 0 : 1;
        return pickedAnswer == this.currentQuestion.result;
    }

    updateInfo() {
        //Update
        $("#dificulty").html(this.dificulty);
        $("#score").html(this.currentScore);
        $("#streak").html(this.correctAnwserStreak);
    }
    ajustDificulty() {
        //Ajust Dificulty
        if (this.correctAnwserStreak < 5) {
            this.dificulty = 1;
        } else if (this.correctAnwserStreak < 10) {
            this.dificulty = 2;
        } else if (this.correctAnwserStreak < 15) {
            this.dificulty = 3;
        } else {
            this.dificulty = 4;
        }

        this.maxDificulty = Math.max(this.dificulty, this.maxDificulty);
    }
    resetInfo() {
        this.resetStreak();
        this.currentScore = 0;
        this.dificulty = startDificulty;
        this.maxStreak = 0;
        this.maxDificulty = 0;
        this.updateInfo();
    }

    resetStreak() {
        this.correctAnwserStreak = 0;
    }
    addStreak() {
        this.correctAnwserStreak++;
        this.currentScore += (this.basePoints * this.dificulty) + (this.correctAnwserStreak * this.dificulty);
        this.maxStreak = Math.max(this.correctAnwserStreak, this.maxStreak);

    }

    newQuestion() {
        var tempQuestion = new Question(this.dificulty);
        this.questionList.push(tempQuestion);
        this.currentQuestion = tempQuestion;
    }

    newGame() {
        this.questionList = new Array();
        this.newQuestion();
        this.resetInfo();
        this.clock.reset();
        $("#scoreTitle,#scoreTile").remove();
        $("#questionTile,#anwserTile,#gametitle").fadeIn();
    }

    resolveQuestion(question) {
        return eval(question);
    }
    checkIfExist(array, baseNumber) {
        return array.indexOf(baseNumber)!=-1;
    }
}


$(function(){
    let game = new Game();
});
