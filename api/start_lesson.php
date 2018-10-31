<?php
    include "auth.php";
	require_once('connect.php');
	$subject = urldecode($_POST["subject"]);
	$theme_name = urldecode($_POST["theme"]);

	$connection = EIT_DAO::getConnection();
	
	$querySearchTheme = "SELECT k FROM theme WHERE name LIKE ?";

	$sth = $connection->prepare($querySearchTheme);
	$sth->execute(array($theme_name));

	$theme_id = -1;
	if ($sth->rowCount() == 0) {
		$queryInsertTheme = "INSERT INTO theme(name, subject) VALUES (?, ?)";
		$sth2 = $connection->prepare($queryInsertTheme);
		$sth2->execute(array($theme_name, $subject));
		$theme_id = $connection->lastInsertId();
	} else {
		$theme_id = $sth->fetch(PDO::FETCH_ASSOC)['k'];
	}
	$queryInsertLesson = "INSERT INTO lessons (subject, theme, active) VALUES (?, ?, 1)";
	$sth3 = $connection->prepare($queryInsertLesson);
	$sth3->execute(array($subject, $theme_id));

	if ($sth3->rowCount() > 0) {
		http_response_code(200);
		$insert_id_for_lesson = $connection->lastInsertId();
		exit("Insert successful. New lesson ID = [$insert_id_for_lesson]\n");
	}
	http_response_code(500);
	echo "Cannot insert new lesson. Error from database: " . $sth3->errorInfo();
?>