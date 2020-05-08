<?php

require_once "../Application/Classes/Autoloader.php";


class BfFbClass
{

    public $pageId;
    public $facebookCreativeID;
    public $facebookCreativeVideoID;
    public $CampaignId;
    public $accountIds;
    public $accessToken;
    public $appsecret;



    public function __construct($accountIds, $CampaignId)
    {
        $adT = new AdminTools();
        $this->pageId = $adT->getInfoFromTable('facebook_page','plat_client_accounts',"WHERE account_id = $accountIds");
        $this->facebookCreativeID = $adT->getInfoFromTable('id','lg_creative_facebook',"WHERE campaign_id = $CampaignId");
        $this->facebookCreativeVideoID = $adT->getInfoFromTable('id','lg_creative_facebook_video',"WHERE campaign_id = $CampaignId");
//
//        if(empty($this->pageId)){
//            $this->pageId = $pageId;
//        }
        $this->accessToken = 'EAAQ5y0tJOEYBAOGmZCwl8yTg9o1nUpkLVVz4x1M6LIZBFRKwfY1oLZBafRElNxZBBTVZCR4bwYdJ8tgnSAQg2z89YfjQaJCezRTRg18kEJWxk7EgVv4LSvBGeWWtiOw20o0lVACvjlTRYfRQmvJVQtiDX8PhkkP7BE1n8iCTsSQZDZD';
        $this->appsecret = '174626626d6080947f3a6161eba4a215';
        $this->appsecret = hash_hmac('sha256', $this->accessToken, $this->appsecret);


    }


    function getPageInfo($pageid){
        $URL = "https://graph.facebook.com/$pageid/?fields=name,picture&access_token=$this->accessToken&appsecret_proof=$this->appsecret";

        $ch = curl_init();
        //echo $URL;
        curl_setopt($ch, CURLOPT_URL, $URL);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        $return_result = curl_exec($ch);

        //var_dump(json_decode($return_result, TRUE));
        $obj = json_decode($return_result, true);

        curl_close($ch);

        return $obj;
    }

    function getPageLogoLarge($pageid) {

        $URL = "https://graph.facebook.com/$pageid/?fields=picture.type(large)&access_token=$this->accessToken&appsecret_proof=$this->appsecret";

        $ch = curl_init();
        //echo $URL;
        curl_setopt($ch, CURLOPT_URL, $URL);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        $return_result = curl_exec($ch);

        //var_dump(json_decode($return_result, TRUE));
        $obj = json_decode($return_result, true);

        curl_close($ch);

        return $obj;
    }



}