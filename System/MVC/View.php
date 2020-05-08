<?php

namespace MVC;

class View
{
    public static function render($viewPath, $message)
    {
        extract($message);
        include VIEWS . "$viewPath.php";
    }
}
