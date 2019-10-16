<?php
    include("function.php");

    if ($_SERVER["REQUEST_METHOD"] == "GET"){

        $connection = BDconnection();
        if($connection != null)
        {
            if (!empty($_GET)) {
                $playerName = $_GET["playerName"];
                $score = $_GET["score"];
                if (!empty($playerName) && $score != "")
                {
                    $query = "SELECT `questionText`,`rightAnwser`,`chosenAnwser`,`dificulty` from question INNER JOIN player ON question.playerID = player.id INNER JOIN score ON player.scoreID = score.id WHERE player.name = '$playerName' and score.score = $score";
                    $returedJSON = getQuery($connection, $query);
                    print_r(isset($returedJSON) ? $returedJSON : getErrorMessage(5));
                }else{
                    echo getErrorMessage(3);
                }
            }else
            {
                $query = "SELECT player.name, score.maxStreak, score.maxDificulty, score.score FROM `score` INNER JOIN player ON score.id = player.scoreID ORDER BY player.id desc LIMIT 10";
                $returedJSON = getQuery($connection, $query);
                print_r(isset($returedJSON) ? $returedJSON : getErrorMessage(5));
            }

        }else{
            echo getErrorMessage(2);
        }

    }else{
        echo getErrorMessage(1);
    }

 ?>
