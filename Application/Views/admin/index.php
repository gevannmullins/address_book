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
    <link href="/assets/scripts/style.css" rel="stylesheet" type="text/css" />
    <link href="/assets/assets/global/plugins/datatables/media/css/jquery.dataTables.css" />
    <link href="/assets/assets/global/plugins/bootstrap-toastr/toastr.css" />

    <style>
        body, html, * {
            padding: 0;
            margin: 0;
        }
        .full_height {
            height: 100vh;
        }
        #admin_viewport {

            overflow: scroll;
        }
    </style>

    <script src="/assets/libs/jquery/jquery-3.4.1.min.js"></script>

</head>
<body>

<section class="container-fluid">
    <div class="row">
        <div class="col-md-12 full_height" id="admin_viewport">

            <?php include_once VIEWS . "admin/layout/admin_layout.php"; ?>

        </div>
    </div>
</section>

<script src="/assets/libs/bootstrap/js/bootstrap.js"></script>
<script src="/assets/scripts/script.js"></script>
<!--<script src="/assets/assets/js/jquery.dataTables.editable.js"></script>-->
<!--<script src="/assets/assets/global/scripts/datatable.js"></script>-->
<script src="/assets/assets/global/plugins/jquery.blockui.min.js"></script>
<script src="/assets/assets/global/plugins/datatables/media/js/jquery.dataTables.js"></script>
<script src="/assets/assets/global/scripts/portal.js"></script>
<script src="/assets/assets/global/plugins/bootstrap-toastr/toastr.js"></script>
<script>

    $(document).ready(function(){

        Portal.init();
        // blockUI.init();

        // // prevent default action of module links and load link content into the content container
        // $(".load_admin_content").click(function(e){
        //     e.preventDefault();
        //     let href_url = $(this).attr('href');
        //     $('.admin_content_container').load(href_url);
        //     //
        //     // $.ajax({
        //     //     url: href_url,
        //     //     type: 'get',
        //     //     success: function(data) {
        //     //         // console.log(data);
        //     //         $('.admin_content_container').load(data);
        //     //     }
        //     // });
        //
        // });

        // // Login form ajaxified
        // $('#admin_login_form').on('submit', function(e){
        //     e.preventDefault();
        //
        //     let url = $(this).attr('action');
        //
        //     $.ajax({
        //         url: url,
        //         type: 'POST',
        //         data: $(this).serialize(),
        //         success: function(data){
        //             console.log('successfully submitted');
        //             console.log('session data');
        //             sessionStorage.setItem('userid', data.id);
        //             sessionStorage.setItem('userfullname', data.user_fullname);
        //             sessionStorage.setItem('usersurname', data.user_surname);
        //             sessionStorage.setItem('useremail', data.user_email);
        //             sessionStorage.setItem('userdob', data.date_of_birth);
        //             console.log('successfully submitted');
        //             location.href = '/admin/dashboard';
        //
        //         }
        //
        //     });
        //
        //
        //
        // });

    });
</script>


<script>

    $(document).ready(function(){

        //
        // let userid = sessionStorage.getItem('userid');
        // let userfullname = sessionStorage.getItem('userfullname');
        // let usersurname = sessionStorage.getItem('usersurname');
        // let useremail = sessionStorage.getItem('useremail');
        // let userdob = sessionStorage.getItem('userdob');
        //
        //
        // // Check if user logged in or user session set
        // if (userid) {
        //     console.log(sessionStorage.getItem('userid'));
        //     console.log(sessionStorage.getItem('userfullname'));
        //     console.log(sessionStorage.getItem('usersurname'));
        //     console.log(sessionStorage.getItem('useremail'));
        //     console.log(sessionStorage.getItem('userdob'));
        //     // $('.body_content').append('<p>UserId: '+userid+'</p>');
        //     // $('.body_content').append('<p>UserFullName: '+userfullname+'</p>');
        //     // $('.body_content').append('<p>UserSurName: '+usersurname+'</p>');
        //     // $('.body_content').append('<p>UserEmail: '+useremail+'</p>');
        //     // $('.body_content').append('<p>UserDOB: '+userdob+'</p>');
        //
        //     // $("#admin_viewport").load("admin/layout/admin_layout.php");
        //     $("#admin_viewport").load("/admin/index");
        // } else {
        //     $("#admin_viewport").load("/admin/login");
        // }

    });

</script>


</body>
</html>
