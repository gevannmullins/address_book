{% htmlcompress %}
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{% block title %}{% endblock %}</title>
    <link href="assets/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
    <link href="assets/css/main.css" rel="stylesheet" />
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="./assets/js/jquery-3.5.0.min.js"></script>
    <script>
        $(document).ready(function(){

        });
    </script>

</head>
<body>


    <div class="container-fluid">
        <div class="row">
            <div class="col-md-3">
                <!-- left menu -->
                {% include "_partials/left_menu.php" %}
            </div>
            <div class="col-md-9">

                <div class="row flex_container">
                    <div class="box box-1">
                        {% include "_partials/header.php" %}
                    </div>
                    <div class="box box-2">
                        {% block body %}
                        {% endblock %}
                    </div>
                    <div class="box box-3">
                        {% include "_partials/footer.php" %}
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="./assets/js/jquery-3.5.0.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="./assets/bootstrap/js/bootstrap.min.js"></script>


</body>
</html>
{% endhtmlcompress %}