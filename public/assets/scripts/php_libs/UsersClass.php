<?php

require_once "../Application/Models/Autoloader.php";

class UsersClass
{

	/**
	 * Constructor Function
	 * @Description: Initiates the Database Class 
	 */
	public function __construct()
	{
        $this->dbConn = new DbClass();
        $this->dbMConn = new MySqlDbClass();
		
	}

	/**
	 * getAllUsers Function
	 *
	 * @return Returns all the users and user information.
	 */
	public function getAllUsers()
	{
		$dbConn = $this->dbConn;
        $sql = "SELECT * FROM plat_users";
        return $dbConn->query($sql)[0];
	}

	/**
	 * Undocumented function
	 *
	 * @param [type] $user_id
	 * @return void Returns user information using the user_id
	 */
	public function getUserInfo($user_id)
	{
		$dbConn = $this->dbConn;
        $sql = "SELECT * FROM plat_users WHERE user_id='$user_id'";
        return $dbConn->query($sql)[0];
	}

	public function getUserAccounts($user_id)
	{
		$dbConn = $this->dbConn;
        $sql = "SELECT * FROM plat_users_accounts WHERE user_id='$user_id'";
        return $dbConn->query($sql);
	}

	public function getUserCampaigns($user_id)
	{
		$dbConn = $this->dbConn;
		$sql = "SELECT 	T1.id,
		T3.client_name,
		T1.campaign_name,
		T1.campaign_channels,
		T1.campaign_used,
		T1.campaign_status,
		T1.approval_status,
		T1.audit_date
		FROM 	platform.lg_campaigns AS T1
		INNER JOIN 	platform.lg_campaigns_clients AS T2
		ON 		T1.id = T2.campaign_id
		INNER JOIN 	platform.plat_clients AS T3
		ON 		T2.client_id = T3.client_id
		WHERE 	T3.client_id > 0						 
		AND     T1.approval_status IN (0,2,1,4,5) 
		AND     T1.brief IN (2,3);";
        return $dbConn->query($sql);
	}

	public function getUserBriefs($user_id)
	{
		$dbConn = $this->dbConn;
		$sql = "SELECT 	T1.id,
		T3.client_name,
		T1.campaign_name,
		T1.campaign_channels,
		T1.campaign_used,
		T1.campaign_status,
		T1.approval_status,
		T1.audit_date
		FROM 	platform.lg_campaigns AS T1
		INNER JOIN 	platform.lg_campaigns_clients AS T2
		ON 		T1.id = T2.campaign_id
		INNER JOIN 	platform.plat_clients AS T3
		ON 		T2.client_id = T3.client_id
		WHERE 	T3.client_id > 0						 
		AND     T1.approval_status IN (0,2) 
		AND     T1.brief IN (0,1)
		AND 	T2.offernet_account_id IN ($offernet_account_id);";
		return $dbConn->query($sql);

	}

	public function getUserApprovedCampaigns($user_id, $offernet_account_id=754)
	{
		$dbConn = $this->dbConn;
		$sql = "SELECT DISTINCT (T1.id),
		T3.client_name,
		T1.campaign_name,
		T1.campaign_channels,
		T1.campaign_used,
		T1.campaign_status,
		T1.audit_date
		FROM lg_campaigns AS T1
		INNER
		JOIN lg_campaigns_clients AS T2
		ON T1.id = T2.campaign_id
		INNER
		JOIN plat_clients AS T3
		ON T2.client_id = T3.client_id
		LEFT
		JOIN plat_client_accounts AS T4
		ON T3.client_id = T4.client_id
		LEFT
		JOIN plat_users_accounts AS T5
		ON T4.account_id = T5.account_id
		WHERE T3.client_id > 0
		AND	T5.user_id = $user_id
		AND T2.offernet_account_id IN ($offernet_account_id)
		AND T1.approval_status IN (1,5)
		AND T1.campaign_status = 1;";
		return $dbConn->query($sql);
	}


}