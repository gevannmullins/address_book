<?php

use MVC\Model;

class ModelsJsondb extends Model {


    public function loadjsondb($json_path)
    {
        $returnData = [];
        if (file_exists($json_path)) {

            $jsonData = file($json_path);
            print_r($jsonData);
            $fileData = file_get_contents($json_path);
            print_r($fileData);

            $returnData = [
                "status" => "success",
                "status_message" => "file loaded",
                "data" => $fileData
            ];
        } elseif (!file_exists($json_path)) {
            $returnData = [
                "status" => "error",
                "status_message" => "file not found"
            ];

        }

//        return $returnData;
        return 'Json Db Model';

    }


}
