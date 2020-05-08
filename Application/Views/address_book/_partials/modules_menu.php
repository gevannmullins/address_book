<?php
include_once "./config.php";
?>

<script type="text/javascript">
    $(document).ready(function() {
        $("#menu").accordion();
    });
</script>

<?php include_once __DIR__ . "/modules_menu_json.php"; ?>

<style>
    .menu-header-dom {
        background-color: #000000 !important;
    }
</style>


<div class="row">

    <div class="content">

        <nav>

            <div id="menu" class="menu">

                <!-- menu links -->
                <ul>

                    <?php
                    foreach ($modules_menu as $key=>$val) {

                        $thisLinkName = $val['info']['link_name'];
                        $thisUrl = $val['info']['link_url'];

                        if (!is_array($val['sub'])) {

                            ?>
                            <li class="active">
                                <a href="<?php echo $thisUrl; ?>" class="load_admin_content">
                                    <i class="fa fa-home"></i><?php echo $thisLinkName; ?>
                                </a>
                            </li>

                            <?php
                        }
                        elseif (is_array($val['sub'])) {
                            $subarray = $val['sub'];
                        ?>
                            <li>
                                <a href="<?php echo $thisUrl; ?>">
                                    <i class="fa fa-file-image-o"> </i><?php echo $thisLinkName; ?>
                                </a>
                                <!-- sub-menu -->
                                <ul class="submenu">
                                    <?php
                                    foreach ($subarray as $sm) {

                                        $thisSubLinkName = $sm['link_name'];
                                        $thisSubUrl = $sm['link_url'];

                                        if (!is_array($sm['sub_sub'])) {

                                            ?>
                                            <li><a href="<?php echo $thisSubUrl; ?>" class="load_admin_content"><?php echo $thisSubLinkName; ?></a></li>
                                            <?php

                                        } elseif (is_array($sm['sub_sub'])) {
                                            $subsubarray = $sm['sub_sub'];
                                            ?>
                                            <li>
                                                <a href="<?php echo $thisSubUrl; ?>"><?php echo $thisSubLinkName; ?></a>
                                                <ul class="submenu">
                                            <?php
                                            foreach ($subsubarray as $ssm) {
                                                $thisSubSubLinkName = $ssm['link_name'];
                                                $thisSubSubUrl = $ssm['link_url'];
                                                ?>
                                                    <li><a href="<?php echo $thisSubSubUrl; ?>" class="load_admin_content"><?php echo $thisSubSubLinkName; ?></a></li>
                                                <?php
                                            }
                                            ?>
                                                </ul>
                                            </li>
                                            <?php
                                        }
                                    }
                                    ?>
                                </ul>
                            </li>
                        <?php
                        }
                    }
                    ?>

                </ul>
            </div>

        </nav>
    </div>
</div>

<script>
    $(document).ready(function(){

        $(".load_admin_content").on('click', function(e){
            e.preventDefault();
            let thisUrl = $(this).attr("href");
            $('.admin_content_container').load(thisUrl);

        });

    });
</script>

