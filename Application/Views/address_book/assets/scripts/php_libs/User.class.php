<?php

require_once "../Application/Models/Autoloader.php";
  
class User {  
  	//public $idno;
    public $user_id;  
	public $username;
    public $first_name; 
	public $surname;
	public $title;
    //public $hashedPassword;  
    public $email;
	public $client_id;
	public $client_accounts;
	public $user_level;
	//public $user_credits;
	public $user_sandbox_mode;
	public $user_file_manager;
	public $leadgen_location_national;
	public $leadgen_location_province;
	public $leadgen_location_specific;
	public $leadgen_location_store;
	public $prod_kmc;
	public $prod_umc;
	public $prod_bapp;
	public $prod_camp;
	public $prod_finder;
	public $audit_date;
	public $logged_in;
	
	public $offernet_account_id;
  
    //Constructor is called whenever a new object is created.  
    //Takes an associative array with the DB row as an argument.  
    function __construct($data) {  
        $this->user_id = (isset($data['user_id'])) ? $data['user_id'] : ""; 
		$this->username = (isset($data['username'])) ? $data['username'] : ""; 
        $this->first_name = (isset($data['first_name'])) ? $data['first_name'] : ""; 
		$this->surname = (isset($data['surname'])) ? $data['surname'] : ""; 
		$this->title = (isset($data['title'])) ? $data['title'] : "";
        //$this->hashedPassword = (isset($data['password'])) ? $data['password'] : "";  
        $this->email = (isset($data['email_address'])) ? $data['email_address'] : "";
		$this->client_id = (isset($data['client_id'])) ? $data['client_id'] : "";
		$this->client_accounts = (isset($data['client_accounts'])) ? $data['client_accounts'] : "";
		$this->user_level = (isset($data['user_level'])) ? $data['user_level'] : "";
		//$this->user_credits = (isset($data['credits'])) ? $data['credits'] : "";
		$this->user_sandbox_mode = (isset($data['sandbox'])) ? $data['sandbox'] : "";
		$this->user_file_manager = (isset($data['file_manager'])) ? $data['sandbox'] : "";
		$this->leadgen_location_national = (isset($data['leadgen_location_national'])) ? $data['leadgen_location_national'] : "";
		$this->leadgen_location_province = (isset($data['leadgen_location_province'])) ? $data['leadgen_location_province'] : "";
		$this->leadgen_location_specific = (isset($data['leadgen_location_specific'])) ? $data['leadgen_location_specific'] : "";
		$this->leadgen_location_store = (isset($data['leadgen_location_store'])) ? $data['leadgen_location_store'] : "";
		$this->prod_kmc = (isset($data['prod_kmc'])) ? $data['prod_kmc'] : "";
		$this->prod_umc = (isset($data['prod_umc'])) ? $data['prod_umc'] : "";
		$this->prod_bapp = (isset($data['prod_bapp'])) ? $data['prod_bapp'] : "";
		$this->prod_camp = (isset($data['prod_camp'])) ? $data['prod_camp'] : "";
		$this->prod_finder = (isset($data['prod_finder'])) ? $data['prod_finder'] : "";
		$this->logged_in = (isset($data['logged_in'])) ? $data['logged_in'] : "";
        $this->audit_date = (isset($data['audit_date'])) ? $data['audit_date'] : "";  
        $this->offernet_account_id = (isset($data['offernet_account_id'])) ? $data['offernet_account_id'] : "0";  
    }    
}  
  

?>