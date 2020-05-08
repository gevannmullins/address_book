<?php

use MVC\Controller;
use MVC\View;

class ControllersWeb  extends Controller {

    public function index() {
        $data = [];

        $data['site_name'] = 'GM Portfolio';
//        return View::render('pages/index', $data);
        return View::render('web/index', $data);

    }

}
