<?php 
class EIT_DAO {
	private function __construct(){}

	public static function getConnection(){
		try {
			$dbh = new PDO('mysql:host=localhost;port=3306;dbname=eit_control', 'Volodymyr', '0000', array(PDO::ATTR_PERSISTENT => true));
			return $dbh;
		} catch (PDOException $e) {
			http_response_code(500);
			print "Error : " . $e->getMessage() . "<br/>";
			print $e->getCode();
            throw $e;
		}
	}
} 
?>