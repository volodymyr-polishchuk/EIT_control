<?php
    include "auth.php";
	require_once('connect.php');
	$code = $_GET["subject_code"];

	$connection = EIT_DAO::getConnection();

	$query = "SELECT k, name FROM theme WHERE subject LIKE ?";
	$sth = $connection->prepare($query);
	$sth->execute(array($code));

	$json_obj = json_encode($sth->fetchAll());
	echo $json_obj;
?>