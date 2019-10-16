<?php
    date_default_timezone_set('Europe/Lisbon');
    function BDconnection() {

        $server = "seemyfortunecom.ipagemysql.com";
        $username = "thunder";
        $pass = "pass1";
        $db = "quickmath";

/*
        $server = "localhost";
        $username = "root";
        $pass = "";
        $db = "quickmath";
*/
        $conn = new mysqli($server, $username, $pass, $db);

        createTables($conn);

        return $conn;
    }
    function createTables($connection){
        $queryTablePlayer = "CREATE TABLE IF NOT EXISTS player (id int not null auto_increment, name varchar(255) not null, scoreID int not null, PRIMARY KEY (id) , FOREIGN KEY(scoreID) REFERENCES Score(id));";
        $queryTableScore = "CREATE TABLE IF NOT EXISTS score (id int not null auto_increment, maxStreak int not null default 0, maxDificulty int not null default 0, score int not null default 0, PRIMARY KEY (id));";
        $queryTableQuestion = "CREATE TABLE IF NOT EXISTS question (id int not null auto_increment, questionText varchar(255) not null, rightAnwser int not null default 0, chosenAnwser int not null default 0, dificulty int not null default 0, playerID int not null, PRIMARY KEY(id), FOREIGN KEY(playerID) REFERENCES Player(id));";

        return ($connection->query($queryTableScore) === TRUE && ($connection->query($queryTablePlayer) === TRUE) && ($connection->query($queryTableQuestion) === TRUE));
    }
    function getMessage($number){
        $text = "";
        switch ($number) {
            case 1:
                $text = "1 - Success.";
                break;
        }

        echo $text;
    }
    function getErrorMessage($number){
        $text = "";
        switch ($number) {
            case 1:
                $text = "1 - Wrong type of request.";
                break;
            case 2:
                $text = "2 - Error Connecting to Database.";
                break;
            case 3:
                $text = "3 - Invalid parameters.";
                break;
            case 4:
                $text = "4 - Unable to store the info to the database.";
                break;
            case 5:
                $text = "5 - Error retrieving info from the database.";
                break;
            default:

                # code...
                break;
        }
        echo $text. "\n";
    }
    function writeScoreInfoDatabase($connection, $maxStreak, $maxDificulty, $score){

        $query = "INSERT INTO score (maxStreak, maxDificulty, score) VALUES ('$maxStreak','$maxDificulty','$score')";
        writeQuery($connection, $query);
        return $connection->insert_id;
    }
    function writePlayerInfoDatabase($connection, $name, $scoreID)
    {
        $query = "INSERT INTO player (name, scoreID) VALUES ('$name','$scoreID')";
        writeQuery($connection, $query);
        return $connection->insert_id;
    }

    function writeQuestionDatabase($connection , $questions, $playerID){

        for ($i=0; $i < sizeof($questions) ; $i++) {
            $result = $questions[$i]->result;
            $status = $questions[$i]->status;
            $questionText = $questions[$i]->question;
            $correctAnwser = $questions[$i]->chosenAnwser;
            $dificulty = $questions[$i]->dificulty;

            $query = "INSERT INTO question (questionText, rightAnwser, chosenAnwser, dificulty, playerID) values ('$questionText','$result','$correctAnwser','$dificulty','$playerID')";

            writeQuery($connection, $query);
        }
    }

    function writeQuery($conn , $query){
        if ($conn->query($query) === TRUE) {
            //printf("\nQuery executed with Success.\n");
        }
        else{
            echo getErrorMessage(4);
        }
    }

    //Verifies if every requirement was met
    function verifyPostData($postData){
        return isset($postData["name"]) && isset($postData["score"]) && isset($postData["maxStreak"]) && isset($postData["dificulty"]) && isset($postData["questions"]);
    }

    function getQuery($conn, $query){

        if ($result = $conn->query($query)) {
            $questionsObject = array();

            for ($i = 0; $row = $result->fetch_row() ; $i++) {
                # code...
                $questionsObject[$i] = $row;
            }
            return json_encode($questionsObject);
        }
        else{
            echo getErrorMessage(4);
        }
    }




 ?>
