<?php
include_once "./config.php";
?>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Home - Address Book</title>
    <link href="../assets/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="../assets/DataTables/datatables.css" />
<!--    <link rel="stylesheet" type="text/css" href="../assets/bootstrap-table/dist/bootstrap-table.min.css">-->

    <link href="../assets/css/main.css" rel="stylesheet" />

    <style>
        .content_body_container {
            padding: 25px;
        }
    </style>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="../assets/js/jquery-3.5.0.min.js"></script>
    <script>
        $(document).ready(function(){

        });
    </script>

</head>
<body>


<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">

            <div class="row flex_container">
                <div class="box box-1">
                    <?php include_once VIEWS . "address_book/_partials/header.php"; ?>
                </div>
                <div class="box box-2 content_body_container">

                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-12 text-right">
                                <a class="new_button ajax_loader" id="add_new_contact" href="/address_book/add_new_view">
                                    Add New
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- the content body section -->
                    <table class="table table-striped table-bordered display" id="address_book_table">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>NickName</th>
                            <th>Date Created</th>
                            <th>
                            </th>
                        </tr>
                        </thead>
                    </table>
                </div>
                <div class="box box-3">
                    <?php include_once VIEWS . "address_book/_partials/footer.php"; ?>
                </div>
            </div>

        </div>
    </div>
</div>

<div class="overlay_container">
    <div class="overlay_content">

    </div>
</div>

<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="../assets/js/jquery-3.5.0.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="../assets/bootstrap/js/bootstrap.min.js"></script>
<!--<script src="/assets/bootstrap-table/dist/bootstrap-table.min.js"></script>-->
<script src="../assets/DataTables/datatables.js"></script>

<script>
    /* Formatting function for row details - modify as you need */
    function format ( data ) {
        console.log(data['contact_info']);
        var obj = data['contact_info'];
        var table_html = '';
        $.each(obj, function(key,value) {

            if (value.contact_type === "phone") {
                table_html = table_html + "<tr>" +
                    "<td>Phone Number: </td>" +
                    "<td>"+value.contact_value+"</td>" +
                    "<td><a class='ajax_loader edit_button' value='"+value.id+"' href='/address_book/add_edit_contact.php'>Edit</a><a class='ajax_loader delete_button' value='"+value.id+"' href='/address_book/add_edit_contact.php'>Delete</a></td>" +
                    "</tr>";
            }
            if (value.contact_type === "email") {
                table_html = table_html + "<tr>" +
                    "<td>Email: </td>" +
                    "<td>"+value.contact_value+"</td>" +
                    "<td><a class='ajax_loader edit_button' value='"+value.id+"' href='/address_book/add_edit_contact.php'>Edit</a><a class='ajax_loader delete_button' value='"+value.id+"' href='/address_book/add_edit_contact.php'>Delete</a></td>" +
                    "</tr>";
            }
            if (value.contact_type === "address") {
                table_html = table_html + "<tr>" +
                    "<td>Address: </td>" +
                    "<td>"+value.contact_value+"</td>" +
                    "<td><a class='ajax_loader edit_button' value='"+value.id+"' href='/address_book/add_edit_contact.php'>Edit</a><a class='ajax_loader delete_button' value='"+value.id+"' href='/address_book/add_edit_contact.php'>Delete</a></td>" +
                    "</tr>";
            }

        });
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
                table_html +
                '<tr><td colspan="3" align="center"><a class="ajax_loader new_button" href="#">Add New Contact Information</a></td></tr>'+
                '</table>';
    }

    $(document).ready(function() {

        $.ajax({
            method: "GET",
            url: "/api/address_book",
            success: function(result){

                var table = $('#address_book_table').DataTable( {
                    "data": result,
                    "columns": [
                        {
                            "className":      'details-control',
                            "orderable":      false,
                            "data":           null,
                            "defaultContent": ''
                        },
                        { "data": "contact.name" },
                        { "data": "contact.surname" },
                        { "data": "contact.nickname" },
                        { "data": "contact.date_created" },
                        { "data": function ( data, type, row ) {
                                console.log(data);
                                return '<a class="ajax_loader edit_button" value="'+data.contact.id+'" href="#">Edit</a><a class="ajax_loader delete_button" value="'+data.contact.id+'" href="#">Delete</a>';
                            }
                        }
                    ],
                    "order": [[1, 'asc']]
                } );

                // Add event listener for opening and closing details
                $('#address_book_table tbody').on('click', 'td.details-control', function () {
                    var tr = $(this).closest('tr');
                    var row = table.row( tr );
                    if ( row.child.isShown() ) {
                        row.child.hide();
                        tr.removeClass('shown');
                    }
                    else {
                        row.child( format(row.data()) ).show();
                        tr.addClass('shown');
                    }
                } );

            }
        });

    } );
</script>

<script>
    $(document).ready(function(){

        $(".ajax_loader").on('click', function(e){
            var load_url = $(this).attr('href');
            e.preventDefault();
            $('.overlay_container').fadeIn();
            $('.overlay_content').load(load_url);

        });
        // $('.overlay_container').on('click', function(){
        //     $(this).fadeOut();
        // });

    });
</script>

<script>
    $(document).ready(function(){

        $("form #add_new_contact").submit(function(e){
            e.preventDefault();
            alert('about to submit form');
        });

    });
</script>

</body>
</html>
