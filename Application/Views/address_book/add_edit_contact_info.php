<?php

?>

<div class="container-fluid">
    <div class="row">
        <div class="col-xs-12 text-center"></div>
    </div>
    <div class="row">
        <div class="col-xs-12 text-center">
            <hr style="width: 100%;" />
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12 text-center">
            <form id="add_new_contact" action='/api/address_book/add_new_contact' method='post' style="width: 100%; text-align: center;">
                <table>
                    <tr><td>Name:</td><td><input id="name_value" type="text" name="name" /></td></tr>
                    <tr><td>Surrname:</td><td><input id="surname_value" type="text" name="surname" /></td></tr>
                    <tr><td>Nickname:</td><td><input id="nickname_value" type="text" name="nickname" /></td></tr>
<!--                    <tr><td colspan="2" align="center"><input type="submit" /></td></tr>-->
                    <tr><td colspan="2" align="center"><input class="submit_button" type="submit" /></td></tr>
                    <input type=hidden name=mode value=added>
                </table>
            </form>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12 text-center">
            <hr style="width: 100%;" />
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12 text-center"></div>
    </div>
</div>

<script>
    $(".submit_button").on("click", function(e){
        e.preventDefault();
        alert("submitting the form");
        var name = $("#name_value").val();
        var surname = $("#surname_value").val();
        var nickname = $("#nickname_value").val();
        alert(name);
        $.ajax({
            type: "POST",
            url: "/api/address_book/add_new_contact",
            data: $("#add_new_contact").data();
        //     data: '{"name": '+name+', "surname": '+surname+', "nickname": '+nickname+'}',
        //     success: function(return){
        //         alert("success");
        //     }
        })

    });
    // $("#add_new_contact").submit(function(e){
    //     e.preventDefault();
    //     alert("submitting the form");
    // });
</script>