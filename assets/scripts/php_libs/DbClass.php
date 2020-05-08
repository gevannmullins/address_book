<?php

require_once "../Application/Classes/Autoloader.php";

class DbClass
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
        $this->database_link = mysql_connect($this->database_host, $this->database_user, $this->database_pass);
        if(!isset($this->database_link)) {
            return false;
        }
        return true;
    }

    public function connect()
    {
        $this->database_link = mysql_connect($this->database_host, $this->database_user, $this->database_pass)
        or die("Could not make connection to MySQL");
        mysql_select_db($this->database_name) or die ("Could not open database: ". $this->database_name);
    }


    public function iquery($qry)
    {
        if(!isset($this->database_link)) $this->connect();
        $temp = mysql_query($qry, $this->database_link) or die("Error: ". mysql_error());
    }


    public function query($qry)
    {
        if(!isset($this->database_link)) $this->connect();
        $result = mysql_query($qry, $this->database_link) or die("Error: ". mysql_error());
        $returnArray = array();
        $i=0;
        while ($row = mysql_fetch_array($result, MYSQL_BOTH))
            if ($row)
                $returnArray[$i++]=$row;
        mysql_free_result($result);
        return $returnArray;
    }




    public function disconnect()
    {
        if(isset($this->database_link)) mysql_close($this->database_link);
        else mysql_close();
    }






}