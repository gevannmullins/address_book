<?php


?>

<style>
    #left_table, #right_table {
        width: 100%;
    }
</style>

<div class="container">
    <!-- header title -->
    <div class="row">
        <div class="col-sm-12">

            dataTables - code - snippets

        </div>
    </div>

    <!-- tables container -->
    <div class="row">

        <!-- left table container -->
        <div class="col-sm-6" id="left_table_container">

            <table class="table table-bordered table-striped table-full-width" id="left_table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>

        </div>

        <!-- right table container -->
        <div class="col-sm-6" id="right_table_container">

            <table class="table table-bordered table-striped table-full-width" id="right_table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>

        </div>

    </div>

</div>


<!--<script src="/assets/libs/jquery/jquery-3.4.1.min.js"></script>-->
<!--<script src="/assets/assets/global/scripts/datatable.js"></script>-->
<!--<script src="/assets/assets/global/scripts/portal.js"></script>-->


<script>

    $(document).ready(function(){


        // console.log(Portal);

        // get disabled retailers
        $.ajax({
            url: "http://localhost:8899/api/code_scripts/datatables/left_datatable",
            type: 'get',
            dataType: 'json',
            beforeSend: function () {
                // Portal.blockUI({
                //     animate: true,
                //     target: "#left_table"
                // });
            },
            success: function (data) {
                $('#left_table').dataTable( {
                    "data": data,
                    "columns": [
                        {"data": "id"},
                        {"data": "name"},
                        {"data": "id"}
                    ],
                    "columnDefs": [
                        {
                            "render": function(data, type, row) {
                                let actions = '<button href="" class="btn btn-sm unlink btn-primary blue link-retailer" value="'+data+'">Link</button>';
                                return actions;
                            },
                            "targets": [2]
                        },
                        {
                            "targets": "no-sort",
                            "orderable": false
                        }
                    ],

                } );
                // initLeftTable();
            },
            complete: function() {
                // Portal.unblockUI("#left_table_container");
            }
        });

        // get disabled retailers
        $.ajax({
            url: "http://localhost:8899/api/code_scripts/datatables/right_datatable",
            type: 'get',
            dataType: 'json',
            beforeSend: function () {
                Portal.blockUI({
                    animate: true,
                    target: "#left_table"
                });
            },
            success: function (data) {
                $('#right_table').dataTable( {
                    "data": data,
                    "columns": [
                        {"data": "id"},
                        {"data": "name"},
                        {"data": "id"}
                    ],
                    "columnDefs": [
                        {
                            "render": function(data, type, row) {
                                let actions = '<button href="" class="btn btn-sm unlink btn-primary blue link-retailer" value="'+data+'">Link</button>';
                                return actions;
                            },
                            "targets": [2]
                        },
                        {
                            "targets": "no-sort",
                            "orderable": false
                        }
                    ],

                } );
                // initLeftTable();
            },
            complete: function() {
                Portal.unblockUI("#left_table_container");
            }
        });



    });

    $(document).ready(function() {

        // $('#left_table').dataTable( {
        //     "data": dataSet
        // } );


        // getData.init();

    } );

    let getLeftTableData;
    let initLeftTable;

    let getData = function() {

        getLeftTableData = function() {
            // get disabled retailers
            $.ajax({
                url: "http://localhost:8899/api/code_scripts/datatables/left_datatable",
                type: 'get',
                dataType: 'json',
                beforeSend: function () {
                    // Portal.blockUI({
                    //     animate: true,
                    //     target: "#left_table"
                    // });
                },
                success: function (data) {
                    console.log(data);
                    //
                    // $('#left_table').dataTable( {
                    //     "ajax": "data/arrays.txt"
                    // } );
                    //
                    // initLeftTable();
                },
                complete: function() {
                    // Portal.unblockUI("#left_table_container");
                }
            });
        };
        initLeftTable = function() {

            let leftDataTableGrid = new Datatable();
            leftDataTableGrid.init({
                "src": $("#left_table"),
                loadingMessage: 'Loading...',
                "dataTable": $.extend(
                    {
                        "stateSave": true,
                        "columns": [
                            {"data": "id"},
                            {"data": "name"},
                            {"data": "id"}
                        ],
                        "columnDefs": [
                            {
                                "render": function(data, type, row) {
                                    console.log(data);
                                    let actions = '<button href="" class="btn btn-sm unlink btn-primary blue link-retailer" value="'+data+'">Link</button>';
                                    return actions;
                                },
                                "targets": [2]
                            },
                            {
                                "targets": "no-sort",
                                "orderable": false
                            }
                        ],
                        "ajax": {
                            "url": "http://localhost:8899/api/code_scripts/datatables/left_datatable",
                            "method": "GET"
                        }
                    }
                )
            });

        };

        return {
            init: function () {

                // reload/refresh window size
                // $(window).resize(Portal.globalHandleOverflowColumns);

                getLeftTableData();


            }
        }


    }();


</script>
