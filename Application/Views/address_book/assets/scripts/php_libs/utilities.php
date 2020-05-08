<?php


function ShowUserInfoPerColumn($user_id,$column){
    $sql = "SELECT `".$column."` AS ShowInfo FROM platform.plat_users WHERE user_id = $user_id;";
    $result = mysql_query($sql) or die(mysql_error());
    $num_count = mysql_num_rows($result);
    if($num_count>0){
        while($row = mysql_fetch_array($result)){
            $ShowInfo = $row['ShowInfo'];
        }
    }else{
        $ShowInfo = '';
    }
    return $ShowInfo;
}

function GetBranchCredit($branch_id,$column){
    $sql = "SELECT `".$column."` AS SelectThis FROM platform.plat_client_branches WHERE branch_id = $branch_id;";
    $result = mysql_query($sql) or die(mysql_error());
    $num_count = mysql_num_rows($result);
    if($num_count>0){
        while($row = mysql_fetch_array($result)){
            $SelectThis = $row['SelectThis'];
        }
    }else{
        $SelectThis = '0.00';
    }
    return number_format($SelectThis, 2, '.', ',');
}

function GetUserCampaignCountsPerChannelStatus($user_id,$column,$campaignstatus){
    $sql = "SELECT COUNT(`".$column."`) AS SelectThis FROM platform.leadgen_campaigns WHERE `$column` > 0 AND campaign_status = $campaignstatus AND user_id = $user_id;";
    $result = mysql_query($sql) or die(mysql_error());
    $num_count = mysql_num_rows($result);
    if($num_count>0){
        while($row = mysql_fetch_array($result)){
            $SelectThis = $row['SelectThis'];
            if(strlen($SelectThis)<2){
                $SelectThis = '0'.$SelectThis;
            }
        }
    }else{
        $SelectThis = '00';
    }
    return $SelectThis;
}

function GetUserCampaignCountsPerStatus($user_id,$campaignstatus){
    $sql = "SELECT COUNT(1) AS SelectThis FROM platform.leadgen_campaigns WHERE campaign_status = $campaignstatus AND user_id = $user_id;";
    $result = mysql_query($sql) or die(mysql_error());
    $num_count = mysql_num_rows($result);
    if($num_count>0){
        while($row = mysql_fetch_array($result)){
            $SelectThis = $row['SelectThis'];
            if(strlen($SelectThis)<2){
                $SelectThis = '0'.$SelectThis;
            }
        }
    }else{
        $SelectThis = '00';
    }
    return $SelectThis;
}

if($user_level==5 || $user_level==99){
    $sql = "SELECT DISTINCT account_id FROM platform.plat_client_accounts WHERE client_id = $client_id AND account_id IN ($client_accounts) UNION SELECT DISTINCT T2.account_id FROM platform.plat_users_clients_accounts AS T1 INNER JOIN platform.plat_client_accounts AS T2 ON T1.account_id = T2.account_id WHERE T1.user_id = $user_id;";
    //echo $sql.'<br />';
    $result = mysql_query($sql) or die(mysql_error());
    $num_count = mysql_num_rows($result);
    if($num_count>0){
        $SelectThis = '';
        while($row = mysql_fetch_array($result)){
            $SelectThis.= $row["account_id"].',';
        }
        $accounts=substr($SelectThis, 0, -1);
    }else{
        $accounts = $client_accounts;
    }
}else{
    $accounts = $client_accounts;
}


function GetCampaignCountsPerStatus($user_id,$accounts,$campaignstatus,$channel){
    if(strlen($channel)>0){$Channel = " AND `".$channel."` > 0";}else{$Channel = '';}
    //$sql = "SELECT COUNT(1) AS SelectThis FROM platform.leadgen_campaigns WHERE campaign_status = $campaignstatus AND client_id = $client_id AND account_id IN ($accounts)$Channel;";
    $sql = "SELECT COUNT(1) AS SelectThis FROM platform.leadgen_campaigns WHERE campaign_status = $campaignstatus AND user_id = $user_id AND account_id IN ($accounts)$Channel;";
    $result = mysql_query($sql) or die(mysql_error());
    $num_count = mysql_num_rows($result);
    if($num_count>0){
        while($row = mysql_fetch_array($result)){
            $SelectThis = $row['SelectThis'];
            if(strlen($SelectThis)<2){
                $SelectThis = '0'.$SelectThis;
            }
        }
    }else{
        $SelectThis = '00';
    }
    return $SelectThis;
}


