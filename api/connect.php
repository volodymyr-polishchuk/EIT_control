<?php 
class EIT_DAO {
	private function __construct(){}

	public static function getConnection(){
		try {
			$dbh = new PDO('mysql:host=localhost;dbname=hworknet_test;charset=utf8', 'user', 'password', array(PDO::ATTR_PERSISTENT => true));
			return $dbh;
		} catch (PDOException $e) {
			http_response_code(500);
			print "Error! : " . $e->getMessage() . "<br/>"; 
			die(); 
		} 
	}
} 
?>