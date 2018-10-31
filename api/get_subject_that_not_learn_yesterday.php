<?php
    include "auth.php";
	require_once('connect.php');

	$connection = EIT_DAO::getConnection();
	
	$query = "SELECT subject.name AS subjectName FROM subject WHERE k NOT IN (SELECT lessons.subject FROM lessons WHERE (lessons.date_start >= (CURDATE() - 1) AND lessons.date_end < CURDATE()) AND lessons.date_end > ('0000-00-00 00:00:00') GROUP BY lessons.subject)";

	$themes = array();
	foreach ($connection->query($query) as $row) {
        array_push($themes, $row);
    } 

	$json_obj = json_encode($themes);
	echo $json_obj;
?>