<?php

require_once "../Application/Models/Autoloader.php";

class UserTools {  
  
    //Log the user in. First checks to see if the  
    //firstname and password match a row in the database.  
    //If it is successful, set the session variables  
    //and store the user object within.  
    public function login($username, $password)  
    {  
  
        $hashedPassword = md5($password);  
        $result = mysql_query("SELECT * FROM plat_users WHERE username = '$username' AND password = '$hashedPassword' LIMIT 1;");  
  		
        if(mysql_num_rows($result) == 1)  
        {  
			$_SESSION["user"] = serialize(new User(mysql_fetch_assoc($result)));  
            $_SESSION["login_time"] = time();  
            $_SESSION["logged_in"] = 1; 
			$_COOKIE['cookname'];
			$_COOKIE['cookpass'];
			session_cache_expire( 20 );
            return true;  
        }else{  
            return false;  
        }  
    } 
	
	 public function Adminlogin($username, $password){
//		unset($_SESSION['user']);  
//        unset($_SESSION['login_time']);  
//        unset($_SESSION['logged_in']);  
//        session_destroy();
			
        $hashedPassword = $password;  
        $result = mysql_query("SELECT * FROM plat_users WHERE username = '$username' AND password = '$hashedPassword'");  
  		
        if(mysql_num_rows($result) == 1){  
			$_SESSION["user"] = serialize(new User(mysql_fetch_assoc($result)));  
            $_SESSION["login_time"] = time();  
            $_SESSION["logged_in"] = 1; 
			//$_COOKIE['cookname'];
			//$_COOKIE['cookpass'];
			session_cache_expire( 20 );
            return true;  
        }else{  
            return false;  
        }  
    }   
	

    //Log the user out. Destroy the session variables.  
    public function logout($user_id) {  
		$result = mysql_query("UPDATE plat_users SET logged_in = 0 WHERE user_id = '$user_id'");
        unset($_SESSION['user']);  
        unset($_SESSION['login_time']);  
        unset($_SESSION['logged_in']);  
        session_destroy();  
    }  
  
    //Check to see if a email exists.  
    //This is called during registration to make sure all emails are unique.  
    public function checkfirstnameExists($username) {  
        $result = mysql_query("SELECT user_id FROM plat_users WHERE username='$username'");  
        if(mysql_num_rows($result) == 0)  
        {  
            return false;  
        }else{  
            return true;  
        }  
    }  
  
    //get a user  
    //returns a User object. Takes the users id as an input  
    public function get($user_id)  
    {  
        $db = new DB();  
        $result = $db->select('plat_users', "user_id = $user_id");  
  
        return new User($result);  
    }  

	public function accountActive($username, $password)  
    {   
		$hashedPassword = md5($password);  
		
		$result =  mysql_query("SELECT * FROM plat_users WHERE username = '$username' AND password = '$hashedPassword' AND active = 1");
		
        if(mysql_num_rows($result) == 1)  
        {  
            return true; 
        }else{  
            return false;  
        }  
    } 
	
	public function loggedIn($username, $password)  
    {   
		$ipaddress = $_SERVER["REMOTE_ADDR"];
		$hashedPassword = md5($password);  
		
		$result =  mysql_query("SELECT * FROM plat_users WHERE username = '$username' AND password = '$hashedPassword' LIMIT 1;");
		
        if(mysql_num_rows($result) == 1)  
        {   
			$sql = "SELECT * FROM plat_users WHERE username = '$username' AND password = '$hashedPassword'";
			$result = mysql_query($sql) or die(mysql_error());
			while($row = mysql_fetch_array($result)){$user_id = $row["user_id"];}
			$result = mysql_query("INSERT log_logins (user_id,username,password,ip) VALUES ('$user_id','$username','$hashedPassword','$ipaddress')");
			$result = mysql_query("UPDATE plat_users SET logged_in = 1 WHERE user_id = '$user_id'");
			return true;
        }else{  
            return true;  
        }  
    } 
	
	public function incorrectLogin($username, $password)  
    {   
		$ipaddress = $_SERVER["REMOTE_ADDR"];
		
		$sql = "INSERT log_incorrect_logins (username,password,ip) VALUES ('$username','$password','$ipaddress')";
		$result = mysql_query($sql) or die(mysql_error());
		return true;   
    } 
	
	public function GetAllUserBranchIds($usr_id,$clnt_id){
		$sql = "SELECT branch_id FROM platform.plat_client_branches_users WHERE user_id = $usr_id AND client_id = $clnt_id;";
		$result = mysql_query($sql) or die(mysql_error());
		$num = mysql_num_rows($result);
		$Branch_Ids = 0;
		if($num>0){
			while($row = mysql_fetch_array($result)){
				$Branch_Ids.= $row["branch_id"].',';
			}
			$Branch_Ids=substr($Branch_Ids, 0, -1);
			return $Branch_Ids;
		}else{
			return $Branch_Ids;
		}
	}
	
	public function GetBranchAvailableIndustries($branchid){
		$sql = "SELECT * FROM platform.plat_client_branches WHERE branch_id = $branchid;";
		$result = mysql_query($sql) or die(mysql_error());
		$num = mysql_num_rows($result);
		$Induxtry_Ids = '';
		if($num>0){
			while($row = mysql_fetch_array($result)){
				$Induxtry_Ids.= $row["branch_available_industries"].',';
			}
			$Induxtry_Ids=substr($Induxtry_Ids, 0, -1);
			return $Induxtry_Ids;
		}else{
			return $Induxtry_Ids;
		}
	}
	
	public function GetBranchAvailableCahnnels($branchid){
		$sql = "SELECT * FROM platform.plat_client_branches WHERE branch_id = $branchid;";
		$result = mysql_query($sql) or die(mysql_error());
		$num = mysql_num_rows($result);
		$Induxtry_Ids = '';
		if($num>0){
			while($row = mysql_fetch_array($result)){
				$Induxtry_Ids.= $row["branch_available_channel"].',';
			}
			$Induxtry_Ids=substr($Induxtry_Ids, 0, -1);
			return $Induxtry_Ids;
		}else{
			return $Induxtry_Ids;
		}
	}
	
	public function GetUserClientBranchLatLngFromBranchId($id,$latlng){
		$sql = "SELECT `".$latlng."` AS LatLng FROM platform.plat_client_branches WHERE branch_id = $id;";
		$result = mysql_query($sql) or die(mysql_error());
		$num = mysql_num_rows($result);
		if($num>0){
			while($row = mysql_fetch_array($result)){
				$LatLng = $row['LatLng'];
			}
		}else{
			$LatLng = 0;
		}
		return $LatLng;	
	}
	
	public function GetUserClientBranchInfoFromId($id,$info){
		$sql = "SELECT `".$info."` AS Info FROM platform.plat_client_branches WHERE branch_id = $id;";
		$result = mysql_query($sql) or die(mysql_error());
		$num = mysql_num_rows($result);
		if($num>0){
			while($row = mysql_fetch_array($result)){
				$Info = $row['Info'];
			}
		}else{
			$Info = '';
		}
		return $Info;	
	}
	
	public function GetUserClientBranchId($usr_id,$clnt_id){
		$sql = "SELECT * FROM platform.plat_client_branches_users WHERE user_id = $usr_id AND client_id = $clnt_id AND primary_branch = 1;";
		$result = mysql_query($sql) or die(mysql_error());
		$num = mysql_num_rows($result);
		if($num>0){
			while($row = mysql_fetch_array($result)){
				$branch_id = $row['branch_id'];
			}
		}else{
			$branch_id = 0;
		}
		return $branch_id;	
	}
	
	public function GetUserClientLogo($clnt_id,$branch_id){
		$sql = "SELECT * FROM platform.plat_client_branches WHERE client_id = $clnt_id AND branch_id = $branch_id;";
		$result = mysql_query($sql) or die(mysql_error());
		$num = mysql_num_rows($result);
		if($num>0){
			while($row = mysql_fetch_array($result)){
				$logo = $row['branch_logo'];
			}
		}else{
			$logo = 'bf-logo.png';
		}
		return $logo;	
	}
	
	public function GetUserClientBranchPricingFromId($client_id,$client_branch_id,$channel,$info){
		$sql = "SELECT `".$info."` AS Info FROM platform.plat_client_branch_pricing WHERE client_id = $client_id AND client_branch_id = $client_branch_id AND channel_id = $channel;";
		$result = mysql_query($sql) or die(mysql_error());
		$num = mysql_num_rows($result);
		if($num>0){
			while($row = mysql_fetch_array($result)){
				$Info = $row['Info'];
			}
		}else{
			$Info = 0;
		}
		return $Info;	
	}
}   
 
class AdminTools { 
	public function getInfoFromTable($What,$Table,$WhereInfo)
    {   
		$sql = "SELECT * FROM `platform`.`$Table` $WhereInfo;";
		//return $sql;
		$result = mysql_query($sql) or die(mysql_error());
		if(mysql_num_rows($result)>1){
			$ReturnArray = '';
			while($row = mysql_fetch_array($result)){
				$ReturnArray.= $row[$What].',';
			}
			return substr($ReturnArray, 0, -1);
			return true;
		}else if(mysql_num_rows($result)==1){
			while($row = mysql_fetch_array($result)){
				return $row[$What];
			}
			return true;
		}else{
			return '';
			return false;
		}
    }	
}
?>