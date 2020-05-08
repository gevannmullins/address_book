<?php
include "../../config.php";
?>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>

    <link href="assets/libs/bootstrap/css/bootstrap.min.css" />

    <style>
        .full_height {
            height: 100vh;
        }
        .welcome_container {
            text-align: center;
            /*width: 350px;*/
            margin-top: 50px;
            font-size: 25px;
            padding: 50px;
            box-shadow: 0 0 10px #dedede;
            border-radius: 5px;
        }
    </style>

</head>
<body>

<div class="container">
    <div class="row">
        <div class="col-md-6 welcome_container">

            <h2>
                <?php
                echo $heading_message;
                ?>
            </h2>
            <hr />
            <p>
                <?php
                echo $content_message;
                ?>
            </p>

        </div>
    </div>
</div>



<script src="assets/libs/jquery/jquery.js"></script>
<script src="assets/libs/bootstrap/js/bootstrap.js"></script>
</body>
</html>
