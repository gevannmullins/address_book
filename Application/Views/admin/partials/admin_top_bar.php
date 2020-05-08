<?php


?>

<style>
    #admin_user_menu {
        margin-top: 16px;
    }
    #admin_user_menu li {
        display: inline;
        font-size: 16px;
        /*margin: 10px auto;*/

    }
    #admin_user_menu li :after {
        content: '  -  ';
    }
    #admin_user_menu :last-child :after {
        content: '';
    }
    #admin_user_menu li a, a:hover {
        text-underline: none;
        text-decoration: none;
    }
</style>

<div class="row">
    <div class="col-md-6">



    </div>
    <div class="col-md-6 text-center">

        <ul id="admin_user_menu">
            <li>
                <a href="/admin/profile">Profile</a>
            </li>
            <li>
                <a href="/admin/settings">Settings</a>
            </li>
            <li>
                <a href="/admin/logout">Log Out</a>
            </li>
        </ul>

    </div>
</div>
