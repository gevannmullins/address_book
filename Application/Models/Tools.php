<?php

use MVC\Model;

class ModelsTools extends Model {

    public function createFolder($folderName)
    {
        $projectsPath = "projects/";
        mkdir($projectsPath . $folderName);
        return "success";

    }


}
