<?php

/**
 *  Config File For Handel Route, Database And Request
 *
 *  Author: Mohammad Rahmani
 *  Email: rto1680@gmail.com
 *  WebPage: mohammadrahmani.com
 *
 */

define('HTTP_HOST', $_SERVER['HTTP_HOST']);
define('SERVER_NAME', $_SERVER['SERVER_NAME']);
define('DOCUMENT_ROOT', $_SERVER['DOCUMENT_ROOT'] . '/');
define('REQUEST_URI', $_SERVER['REQUEST_URI']);
define('PHP_SELF', $_SERVER['PHP_SELF']);
define('BASE_URL', HTTP_HOST . REQUEST_URI);


// Http Default Url
$scriptName = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
// define('HTTP_URL', '/'. substr_replace(trim($_SERVER['REQUEST_URI'], '/'), '', 0, strlen($scriptName)) . trim(REQUEST_URI, '/') . '/');
define('HTTP_URL', '/'. substr_replace(trim(BASE_URL, '/'), '', 0, strlen($scriptName)));

// Define Path Application
// define('SCRIPT', str_replace('\\', '/', rtrim(__DIR__, '/')) . '/');
define('SCRIPT', str_replace('\\', '/', rtrim(__DIR__, '/')) . '/');
define('SYSTEM', SCRIPT . 'System/');
define('CONTROLLERS', SCRIPT . 'Application/Controllers/');
define('MODELS', SCRIPT . 'Application/Models/');
define('VIEWS', SCRIPT . 'Application/Views/');
define('URI_VIEWS', 'Application/Views/');
define('ASSETS', SCRIPT . 'assets/');
define('JSONDB', SCRIPT . 'Application/Databases/');


// Config Database
define('DATABASE', [
    'Port'   => '3306',
    'Host'   => 'localhost',
    'Driver' => 'PDO',
    'Name'   => 'address_book',
    'User'   => 'admin',
    'Pass'   => 'admin',
    'Prefix' => ''
]);

// DB_PREFIX
define('DB_PREFIX', '');

// For Limit Page
define('LIMIT_PRE_PAGE_SHOW_BOOKS', 5);
