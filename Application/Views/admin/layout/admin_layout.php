<style>
    #module_menu_container {
        background-color: #0c5460;
        box-shadow: 0 0 30px 0px #333333;
        border-right: #ffffff solid 3px;

    }
    #module_menu_container_dom {
        background-color: #000000;
        box-shadow: 0 0 30px 0px #333333;
        border-right: #8b0000 solid 3px;

    }

    #main_container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start; /* align items in Main Axis */
        align-items: stretch; /* align items in Cross Axis */
        align-content: stretch; /* Extra space in Cross Axis */
    }


    #admin_header {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;
        align-content: stretch;
        height: 60px;
        box-shadow: 0px 0px 10px 0px #333333;
        background-color: #8b0000;
        border-bottom: #000000 2px solid;

    }

    #admin_header a, #admin_header a:hover, #admin_footer a, #admin_footer a:hover {
        color: #ffffff;
    }

    #admin_footer {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;
        align-content: stretch;
        height: 40px;
        box-shadow: 0px 0px 10px 0px #333333;
        background-color: #8b0000;
        border-top: #000000 2px solid;
    }

    #admin_content {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;
        align-content: stretch;
        padding: 10px 10px 10px 10px;
        overflow: scroll;
    }

    .admin_content_container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;
        align-content: stretch;
        overflow: scroll;
    }

    .lucy_ai_container {
        position: absolute;
        bottom: 0;
        background-color: #8b0000;
        border-left: #8b0000 2px solid;
    }


</style>

<div class="row">
    <div class="col-md-3 full_height text-center" id="module_menu_container_dom">

        <div class="row">
            <div class="col-md-12">
                <?php include VIEWS . "admin/partials/modules_menu.php"; ?>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 lucy_ai_container">
                <?php
                include VIEWS . "lucy/index.php";
                ?>
            </div>
        </div>
    </div>
    <div class="col-md-9 full_height" id="main_container">

            <div class="row" id="admin_header">
                <div class="col-md-12 text-center" id="top_bar">
                    <?php include VIEWS . "admin/partials/admin_top_bar.php"; ?>
                </div>
            </div>


            <div class="row" id="admin_content">
                <div class="col-md-12 admin_content_container">

                    Main content here

                </div>
            </div>


            <div class="row" id="admin_footer">
                <div class="col-md-12 text-center" id="bottom_bar">
                    <?php include VIEWS . "admin/partials/admin_bottom_bar.php"; ?>
                </div>
            </div>

    </div>

</div>

<script>
    $(document).ready(function(){

    //$('#top_bar').load("<?php //echo VIEWS . 'admin/partials/admin_top_bar.php'; ?>//")
    //     $('#module_menu_container_dom').load("/admin/partials/modulesmenu")
    //     $('#top_bar').load("/admin/partials/admin_top_bar")
    //     $('#bottom_bar').load("/admin/partials/admin_bottom_bar")

    });
</script>

