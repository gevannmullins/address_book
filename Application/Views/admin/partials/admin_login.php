<?php


?>

<style>
    #admin_login_form {
        margin: 0 auto;
        width: 400px;
    }
</style>

<div class="row">
    <div class="col-md-12 text-center">
        <form name="admin_login" id="admin_login_form" action="/admin/login" method="post">
            <input type="email" name="email" placeholder="Email Address" id="email" />
            <input type="password" name="userpass" id="userpass" placeholder="Password" />
            <button type="submit" value="Login" name="adminloginbutton">Login</button>
        </form>

<!--        <form name="admin_login_form" id="admin_login_form" action="/admin/login" method="post">-->
<!--            <input type="text" name="user_name" id="user_name" />-->
<!--            <input type="password" name="user_password" id="user_password" />-->
<!--            <button type="submit" name="submit_login" id="submit_login">Login</button>-->
<!--        </form>-->

    </div>
</div>


<script>
    $(document).ready(function(){

        // Login form ajaxified
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
