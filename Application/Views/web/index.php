<?php
session_start();
?>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <title>Welcome</title>

    <link href="/assets/libs/bootstrap/css/bootstrap.css" rel="stylesheet" type="text/css" />

    <style>
        body, html, * {
            padding: 0;
            margin: 0;
        }
        .full_height {
            height: 100vh;
        }
        #web_viewport {
            overflow: auto;
        }

    </style>

</head>
<body>

<section class="container-fluid">
    <div class="row">
        <div class="col-md-12 full_height" id="web_viewport">

<!--            --><?php //include_once VIEWS . "web/layout/web_layout.php"; ?>

        </div>
    </div>
</section>

<script src="/assets/libs/jquery/jquery-3.4.1.min.js"></script>
<script src="/assets/libs/bootstrap/js/bootstrap.js"></script>

<script>
    $(document).ready(function(){

        $("#web_viewport").load("<?php echo URI_VIEWS; ?>web/layout/web_layout.php");
        //$("#web_viewport").html("<?php //echo VIEWS; ?>//web/layout/web_layout.php");

    });
</script>

</body>
</html>
