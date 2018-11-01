<?php
	$login = urldecode($_POST['login']);
	$password = urldecode($_POST['password']);

	require_once('connect.php');
	$connection = EIT_DAO::getConnection();
	
	$query = "SELECT k, password_hash FROM users_eit WHERE login LIKE ? AND password LIKE ?;";

	$sth = $connection->prepare($query);
	$sth->execute(array($login, $password));

	foreach ($sth->fetchAll() as $row) {
        setcookie('auth-token', $row['password_hash'], time() + 3600 * 24 * 30, "/polishchuk/eit");
        setcookie('auth-k', $row['k'], time() + 3600 * 24 * 30, "/polishchuk/eit");
        header("Location: https://hwork.net/polishchuk/eit/index.html");
        http_response_code(303);
        die();
    } 
    http_response_code(403);
    die();
?>