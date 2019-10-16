<?php
    include("function.php");

    if ($_SERVER["REQUEST_METHOD"] == "POST"){

        if(verifyPostData($_POST)){
            $connection = BDconnection();

            if($connection != null){
                $name = $_POST["name"];
                $score = $_POST["score"];
                $maxStreak = $_POST["maxStreak"];
                $maxDificulty = $_POST["dificulty"];
                $questions = $_POST["questions"];
                $questionJSON = json_decode($questions);
                $numberQuestions = sizeof($questionJSON);

                $scoreID = writeScoreInfoDatabase($connection, $maxStreak, $maxDificulty ,$score);
                $playerID = writePlayerInfoDatabase($connection, $name, $scoreID);
                writeQuestionDatabase($connection , $questionJSON , $playerID);

                echo getMessage(1);
            }else {
                echo getErrorMessage(2);
            }
        }else{
            echo getErrorMessage(3);
        }

    }else{
        echo getErrorMessage(1);
    }

 ?>
