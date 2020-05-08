<?php

require_once "../Application/Classes/Autoloader.php";

class AccountsClass
{

	public function __construct()
	{
        $this->dbConn = new DbClass();
        $this->dbMConn = new MySqlDbClass();
		
	}

	public function getAllAccounts()
	{
		$dbConn = $this->dbConn;
        $sql = "SELECT * FROM plat_client_accounts";
        return $dbConn->query($sql)[0];
	}

	public function getAccountInfo($account_id)
	{
		$dbConn = $this->dbConn;
		$sql = "SELECT * FROM plat_client_accounts WHERE account_id=$account_id";
		return $dbConn->query($sql)[0];
	}


}