<?php

require_once "../Application/Classes/Autoloader.php";

class CampaignsClass
{
    public $campaign_id;
    public $dbConn;
    public $dbQuery;

    public function __construct()
    {
        // $this->campaign_id = $campaign_id;
        $this->dbConn = new DbClass();
        $this->dbMConn = new MySqlDbClass();

    }

    public function getCampaignStatus($campaign_id)
    {

    }

    public function getCampaignInfo($campaign_id)
    {
        $dbConn = $this->dbConn;
        $sql = "SELECT * FROM lg_campaigns WHERE id='$campaign_id'";
        return $dbConn->query($sql)[0];
    }

    public function getCampaignParticipatingAccounts($campaign_id)
    {

    }

    public function getCampaignChannels($campaign_id)
    {
        $campaign = $this->getCampaignInfo($campaign_id);
        $channel_string = $campaign['campaign_channels'];
        return explode(',', $channel_string);
    }

    public function getCampaignChannelScheduleInfo()
    {

    }

    public function getCampaignScheduleReview($schedule_id)
    {
        $dbConn = $this->dbConn;
        $sql = "SELECT *
                FROM platform.lg_campaign_schedule AS T1
                INNER JOIN platform.lg_campaigns AS T2
                ON T1.campaign_id=T2.id
                WHERE T1.id=$schedule_id;";
        $campaign_schedule_info = $dbConn->query($sql)[0];
        $campaign_id = $campaign_schedule_info['campaign_id'];
        $campaign_channels = $this->getCampaignChannels($campaign_id);


        return $campaign_channels;

    }





}





