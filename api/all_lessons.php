<?php
    include "auth.php";
	require_once('connect.php');

	$connection = EIT_DAO::getConnection();
	
	$query = "SELECT lessons.k AS lessonID, subject.name AS lessonName, theme.name AS themeName, (UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(lessons.date_start)) AS timeToNowDiff FROM lessons INNER JOIN subject ON subject.k = lessons.subject INNER JOIN theme ON theme.k = lessons.theme WHERE lessons.active LIKE 1 ORDER BY lessons.k ASC";

	$subjects = array();
	foreach ($connection->query($query) as $row) {
        array_push($subjects, $row);
    }  

	$json_obj = json_encode($subjects);
	echo $json_obj;
?>