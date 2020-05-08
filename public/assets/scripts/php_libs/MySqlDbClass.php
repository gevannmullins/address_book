<?php

require_once "../Application/Models/Autoloader.php";

class MySqlDbClass
{

    public $database_name;
    public $database_user;
    public $database_pass;
    public $database_host;
    public $database_link;


    public function __construct()
    {
        // $this->database_user = $database_user;
        // $this->database_pass = $database_pass;
        // $this->database_host = $database_host;
        // $this->database_name = $database_name;
        $this->database_user = "interact";
        $this->database_pass = 'Ch4rl13br0wn';
        $this->database_host = 'feds.bastionflowe.com';
        $this->database_name = 'platform';

    }

    public function canConnect()
    {
        $con = mysqli_connect($this->database_host,$this->database_user,$this->database_pass,$this->database_name);
        if (!$con){
            return false;
        }
        return true;
    }

    public function connect()
    {


		$con = mysqli_connect($this->database_host,$this->database_user,$this->database_pass,$this->database_name);
		if (!$con){
		    die('Could not connect: ' . mysqli_error());
		}
		return $con;


    }

    public function query($sql)
    {
    	$return_data = array();
    	$result = mysqli_query($this->connect,$sql) or die(mysqli_error());
        if(mysqli_num_rows($result)>0){
            while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){

            	$return_data[] = $row;

            }
        }
        return $return_data;

    }





}




