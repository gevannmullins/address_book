<?php



?>

<style>
    * {
        transition: all 0.6s;
    }
    .full_height {
        height: 100vh;
    }

    .landing_section {
        background-color: #2d3143;
    }

    .skills_section {
        background-color: #491217;
    }

    .experiences_section {
        background-color: #000000;
    }

    .sample_section {
        background-color: #999999;
    }

    #web_nav {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        vertical-align: center;
        text-align: center;
        align-items: center;
        -ms-flex-align: center;
        horiz-align: center;
        vert-align: middle;
        position: fixed;
        left: 0;
        top: 0;
        /*width: 64px;*/
        height: 100vh;
        z-index: 99999;
        /*background-color: #0A98DB;*/
        background-color: rgba(0,0,0,.4);
        opacity: 0.4;
        padding-left: 6px;
        padding-right: 6px;
        /*transition: all 0.6s;*/

    }

    .web_nav_container {
        min-width: 74px;
        width: 74px;
        max-width: 74px;
        /*transition: all 0.6s;*/
    }
    .web_nav_container_hover {
        /*width: 25vw;*/
        width: 350px;
        /*transition: all 0.6s;*/
    }
    .nav_link_container {
        position: relative;
        display: flex;
        align-items: stretch;
        align-content: stretch;
        flex-direction: row;
        width: 100%;
        height: 62px;
        border: #0c0c0c 1px solid;
        margin: 6px;
        /*transition: all 0.6s;*/


    }
    .nav_icon {
        display: inline-flex;
        position: relative;
        min-width: 60px;
        width: 60px;
        max-width: 60px;
        height: 60px;
        background-color: #0A98DB;
        border: #0c0c0c 1px solid;
    }
    .nav_link {
        position: relative;
        display: none;
        align-content: stretch;
        align-items: stretch;
        width: 100%;
        flex-grow: inherit;
        flex-direction: column;
        background-color: rgba(124,55,77,1);
    }
    /*.nav_link_hidden {*/
    /*    display: none;*/
    /*}*/

</style>


<div id="web_nav" class="web_nav_container">


    <div class="nav_link_container">
        <div class="nav_icon">

        </div>
        <div class="nav_link nav_link_hidden">
            this is a link
        </div>
    </div>
    <div class="nav_link_container">
        <div class="nav_icon">

        </div>
        <div class="nav_link nav_link_hidden">
            this is a link
        </div>
    </div>
    <div class="nav_link_container">
        <div class="nav_icon">

        </div>
        <div class="nav_link nav_link_hidden">
            this is a link
        </div>
    </div>
    <div class="nav_link_container">
        <div class="nav_icon">

        </div>
        <div class="nav_link nav_link_hidden">
            this is a link
        </div>
    </div>
    <div class="nav_link_container">
        <div class="nav_icon">

        </div>
        <div class="nav_link nav_link_hidden">
            this is a link
        </div>
    </div>

</div>


<div class="row web_content_container">
    <div class="col-md-12">


        <div class="row">
            <div class="col-md-12 full_height sample_section">

            </div>
        </div>

        <div class="row">
            <div class="col-md-12 full_height landing_section">



            </div>
        </div>
        <div class="row">
            <div class="col-md-12 full_height skills_section">



            </div>
        </div>
        <div class="row">
            <div class="col-md-12 full_height experiences_section">



            </div>
        </div>





    </div>
</div>

<script>
    $(document).ready(function(){

        $("#web_nav").on("mousemove", function(event){
            $('#web_nav').removeClass("web_nav_container");
            $('#web_nav').addClass("web_nav_container_hover");
                // if ( $("#web_nav").css("width") > "200px" ) {
                //     console.log($("#web_nav").css("width"));
                // }
        });
        $("#web_nav").on("mouseout", function(event){
            $('#web_nav').addClass("web_nav_container");
            $('#web_nav').removeClass("web_nav_container_hover");
        });


        // $('#web_nav').mousemove(function(){
        //
        //     $('#web_nav').removeClass("web_nav_container");
        //     $('#web_nav').addClass("web_nav_container_hover");
        //     // $('.nav_link').fadeIn(800);
        //     // alert($("#web_nav").css("width"));
        //
        //     if ( $("#web_nav").css("width") > "200px" ) {
        //         console.log($("#web_nav").css("width"));
        //     }
        //
        //
        //
        //     // $(this).mousemove(function(){
        //
        //     // });
        //
        //     // if($("#web_nav").width() > 100){
        //     //     // $("#web_nav").style({});
        //     //
        //     //     alert($("#web_nav").width());
        //     //     $(".nav_link").fadeIn();
        //     //
        //     //     // $(".nav_link").removeClass("nav_link_hidden");
        //     // }
        //
        // }).mouseout(function(){
        //
        //     $('#web_nav').removeClass("web_nav_container_hover");
        //     $('#web_nav').addClass("web_nav_container");
        //     // $(".nav_link").fadeOut(500);
        //
        //
        // });




        // if($('#web_nav').css("width") < 150 + "px"){
        //     $(".nav_link").fadeIn(5000);
        //     alert($("#web_nav").width());
        //
        // }

        // if($("#web_nav").css("width") < "150px"){
        //     $(".nav_link").fadeOut(1000);
        //     alert($("#web_nav").width());
        //
        //     // $(".nav_link").addClass("nav_link_hidden");
        // }


    });
</script>


