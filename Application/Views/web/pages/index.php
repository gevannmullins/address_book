<?php
session_start();
?>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <title><?php echo $site_name; ?>></title>

    <link href="/assets/libs/bootstrap/css/bootstrap.css" rel="stylesheet" type="text/css" />

    <style>
        .full_height {
            height: 100vh;
        }
        .red_bg {
            background-color: darkred;
        }
        .blue_bg {
            background-color: darkblue;
        }

        .align_centered {
            padding: 40%;
        }

        #admin_login_form {
            height: 10%;
        }

    </style>

</head>
<body>

<section class="container">
    <div class="row">
        <div class="col-md-12 full_height align_centered">

            <form name="admin_login" id="admin_login_form" action="/admin/login" method="post">
                <input type="email" name="email" placeholder="Email Address" id="email" />
                <input type="password" name="userpass" id="userpass" placeholder="Password" />
                <button type="submit" value="Login" name="adminloginbutton">Login</button>
            </form>

        </div>
    </div>
</section>

<script src="/assets/libs/jquery/jquery-3.4.1.min.js"></script>
<script src="/assets/libs/bootstrap/js/bootstrap.js"></script>

<script>
    $(document).ready(function(){

        $('#admin_login_form').on('submit', function(e){
            e.preventDefault();

            let url = $(this).attr('action');

            $.ajax({
                url: url,
                type: 'POST',
                data: $(this).serialize(),
                success: function(data){
                    console.log('successfully submitted');
                    console.log('session data');
                    sessionStorage.setItem('userid', data.id);
                    sessionStorage.setItem('userfullname', data.user_fullname);
                    sessionStorage.setItem('usersurname', data.user_surname);
                    sessionStorage.setItem('useremail', data.user_email);
                    sessionStorage.setItem('userdob', data.date_of_birth);
                    console.log('successfully submitted');
                    location.href = '/admin/dashboard';

                }

            });



        });

    });
</script>

</body>
</html>
