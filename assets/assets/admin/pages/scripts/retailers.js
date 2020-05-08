var getRetailers;


var getLinkedRetailers;
var initializeLinkedRetailersTable;

var getUnlinkedRetailers;
var initializeUnlinkedRetailersTable;

var Retailers = function () {


    /////// Action Buttons
    // Link Store Owners
    // $(document).off('click', '#storeowners-table tr a.link')
    //     .on('click', '#storeowners-table tr a.link', function(e) {
    //
    //         var actionBlock = $(this).closest('td');
    //         // Show spinner
    //         actionBlock.find('a.link').hide();
    //         actionBlock.append('<span class="fa fa-circle-o-notch fa-spin fa-2x text-primary"></span>');
    //
    //         var storeOwnersFilterTable = $('#storeowners-table').DataTable();
    //         var storeOwnerData = storeOwnersFilterTable.row($(this).closest('tr')).data()
    //
    //         var data = {
    //             'userId': currentLoyaltyUserId,
    //             'storeOwnerId': storeOwnerData['id']
    //         };
    //
    //         $.ajax({type: 'POST', data: data, url: BASE_URL + "/retailers/data", dataType: "json"})
    //             .done(function(resp) {
    //                 if (resp['code'] == '-1') {
    //                     toastr.success('Linked Retailer', 'Success');
    //                     // Reload tables
    //                     $('#storeowners-table_wrapper .pagination li:eq(1) a').trigger('click');
    //                     $('#storeowners-linked-table_wrapper .pagination li:eq(1) a').trigger('click');
    //                 } else {
    //                     actionBlock.find('span.fa').remove();
    //                     actionBlock.find('a.link').show();
    //
    //                     toastr.error(resp['desc'], 'Error');
    //                 }
    //
    //             })
    //             .error(function(jqXHR, textStatus, errorThrown) {
    //                 actionBlock.find('span.fa').remove();
    //                 actionBlock.find('a.link').show();
    //                 toastr.error(jqXHR.responseJSON.error.message);
    //             });
    //
    //         return false;
    //     });
    //
    // // Unlink Store Owners
    // $(document).off('click', '#storeowners-linked-table tr a.unlink')
    //     .on('click', '#storeowners-linked-table tr a.unlink', function(e) {
    //
    //         var actionBlock = $(this).closest('td');
    //         // Show spinner
    //         actionBlock.find('a.unlink').hide();
    //         actionBlock.append('<span class="fa fa-circle-o-notch fa-spin fa-2x text-primary"></span>');
    //         var storeOwnersFilterTable = $('#storeowners-linked-table').DataTable();
    //         var storeOwnerData = storeOwnersFilterTable.row($(this).closest('tr')).data()
    //
    //         var data = {
    //             'userId': currentLoyaltyUserId,
    //             'storeOwnerId': storeOwnerData['id']
    //         };
    //
    //         $.ajax({type: 'POST', data: data, url: BASE_URL + "/retailers/unlink", dataType: "json"})
    //             .done(function(resp) {
    //                 if (resp['code'] == '-1') {
    //                     toastr.success('Unlinked store owner', 'Success');
    //                     // Reload tables
    //                     $('#storeowners-table_wrapper .pagination li:eq(1) a').trigger('click');
    //                     $('#storeowners-linked-table_wrapper .pagination li:eq(1) a').trigger('click');
    //                 } else {
    //                     actionBlock.find('span.fa').remove();
    //                     actionBlock.find('a.unlink').show();
    //
    //                     toastr.error(resp['desc'] || "Internal server error", 'Error');
    //                 }
    //
    //             })
    //             .error(function(jqXHR, textStatus, errorThrown) {
    //                 actionBlock.find('span.fa').remove();
    //                 actionBlock.find('a.unlink').show();
    //                 toastr.error(jqXHR.responseJSON.error.message);
    //             });
    //
    //         return false;
    //     });

    $(document).off('click', '.unlink-retailer').on('click', '.unlink-retailer', function(e){
        e.preventDefault();
        // alert('clicked');

        var actionBlock = $(this).closest('td');
        // Show spinner
        actionBlock.find('.unlink-retailer').hide();
        actionBlock.append('<span class="fa fa-circle-o-notch fa-spin fa-2x text-primary"></span>');

        var storeOwnersFilterTable = $('#storeowners-table').DataTable();
        var storeOwnerData = storeOwnersFilterTable.row($(this).closest('tr')).data();
        var retailerId = $(this).attr('retailer_id');

        var data = {
            'userId': currentLoyaltyUserId,
            'retailerId': retailerId
        };

        // console.log(data);

        $.ajax({type: 'POST', data: data, url: BASE_URL + "/retailers/unlink", dataType: "json"})
            .done(function(resp) {
                // console.log(resp);
                if (resp['code'] == '-1') {
                    toastr.success('Linked Retailer', 'Success');
                    // Reload tables
                    $('#storeowners-table_wrapper .pagination li:eq(1) a').trigger('click');
                    $('#storeowners-linked-table_wrapper .pagination li:eq(1) a').trigger('click');
                } else {
                    actionBlock.find('span.fa').remove();
                    actionBlock.find('a.link').show();

                    toastr.error(resp['desc'], 'Error');
                }
            })
            .error(function(jqXHR, textStatus, errorThrown) {
                actionBlock.find('span.fa').remove();
                actionBlock.find('a.link').show();
                toastr.error(jqXHR.responseJSON.error.message);

            });

        // $.ajax({type: 'POST', data: data, url: BASE_URL + "/retailers/data", dataType: "json"})
        //     .done(function(resp) {
        //         if (resp['code'] == '-1') {
        //             toastr.success('Linked Retailer', 'Success');
        //             // Reload tables
        //             $('#storeowners-table_wrapper .pagination li:eq(1) a').trigger('click');
        //             $('#storeowners-linked-table_wrapper .pagination li:eq(1) a').trigger('click');
        //         } else {
        //             actionBlock.find('span.fa').remove();
        //             actionBlock.find('a.link').show();
        //
        //             toastr.error(resp['desc'], 'Error');
        //         }
        //
        //     })
        //     .error(function(jqXHR, textStatus, errorThrown) {
        //         actionBlock.find('span.fa').remove();
        //         actionBlock.find('a.link').show();
        //         toastr.error(jqXHR.responseJSON.error.message);
        //     });

        return false;




    });

    $(document).off('click', '.link-retailer').on('click', '.link-retailer', function(e){
        e.preventDefault();
        var actionBlock = $(this).closest('td');
        // Show spinner
        actionBlock.find('.link-retailer').hide();
        actionBlock.append('<span class="fa fa-circle-o-notch fa-spin fa-2x text-primary"></span>');

        // prepare the data
        var retailerId = $(this).val();
        var data = {
            'userId': currentLoyaltyUserId,
            'retailerId': retailerId
        };

        // console.log(data);

        $.ajax({
            type: 'POST',
            url: BASE_URL + "/retailers/link",
            data: data,
            dataType: "json",
            beforeSend: function(){
                // console.log("before send, loading animation");
                // before making the call, load the "processing" animation
                Portal.blockUI({
                    animate: true,
                    target: "#storeowners-table"
                });
            },
            success: function(){
                // console.log("ajax successfull, refresh tables");
                getRetailers();
                getLinkedRetailers();
                // getUnlinkedRetailers();

            },
            complete: function(){
                Portal.unblockUI("#storeowners-table");
            }
        })
            // when everything is done, refresh tables and check for any errors
            .done(function(resp) {
                // console.log("ajax done, checking for messages");
                if (resp['code'] == '-1') {
                    toastr.success('Linked Retailer', 'Success');
                    // Reload tables
                    $('#storeowners-table_wrapper .pagination li:eq(1) a').trigger('click');
                    $('#storeowners-linked-table_wrapper .pagination li:eq(1) a').trigger('click');
                } else {
                    actionBlock.find('span.fa').remove();
                    actionBlock.find('a.link').show();
                    toastr.error(resp['desc'], 'Error');
                }

        })
            .error(function(xhr, status, error){
                var err = eval("(" + xhr.responseText + ")");
                // console.log(JSON.parse(xhr.responseText));
                // console.log(error.message);
                actionBlock.find('span.fa').remove();
                actionBlock.find('a.link').show();
                toastr.error(err);
        });

    });

    // get disabled retailers and load them into the table
    getRetailers = function(){
        // get disabled retailers
        $.ajax({
            url: BASE_URL + "/retailers/data",
            type: 'get',
            dataType: 'json',
            beforeSend: function(){
                // before making the call, load the "processing" animation
                Portal.blockUI({
                    animate: true,
                    target: "#storeowners-table"
                });
            },
            success: function (data){
                // console.log(data);
                // let retailersData = JSON.parse(data).retailers;
                $("#storeowners-table").DataTable( {
                    // "processing": true,
                    // "serverSide": true,
                    // data: JSON.parse(data).retailers,
                    data: data.data,
                    columns: [
                        {"data": "id" },
                        {"data": "name" },
                        {"data": "state" },
                        {"data": "id" }
                    ],
                    "columnDefs": [
                        {
                            "render": function (data, type, row, meta) {
                                let actions = '<button value="'+data+'" class="btn btn-sm link btn-primary link-retailer">Enable</button>';
                                return actions;
                            },
                            "targets": [3]
                        },
                        {
                            "targets": 'no-sort',
                            "orderable": false
                        }
                    ]
                });
            },
            complete: function(){
                Portal.unblockUI("#storeowners-table");
            }
        });
    };

    // get linked retailers and load them into the table
    // getUnlinkedRetailers = function(){
    //
    //     var actionBlock = $(this).closest('td');
    //     // Show spinner
    //     actionBlock.find('.link-retailer').hide();
    //     actionBlock.append('<span class="fa fa-circle-o-notch fa-spin fa-2x text-primary"></span>');
    //
    //     // get disabled retailers
    //     $.ajax({
    //         url: BASE_URL + "/retailers/data",
    //         type: 'get',
    //         dataType: 'json',
    //         beforeSend: function(){
    //             Portal.blockUI({
    //                 animate: true,
    //                 target: "#storeowners-table"
    //             });
    //         },
    //         success: function (data){
    //             console.log(data.data);
    //             $("#storeowners-table").DataTable( {
    //                 // data: JSON.parse(data).retailers,
    //                 data: data.data,
    //                 columns: [
    //                     {"data": "id" },
    //                     {"data": "name" },
    //                     {"data": "state" },
    //                     {"data": "id" }
    //                 ],
    //                 "columnDefs": [
    //                     {
    //                         "render": function (data, type, row, meta) {
    //                             let actions = '<button value="'+data+'" class="btn btn-sm link btn-primary link-retailer">Link</button>';
    //                             return actions;
    //                         },
    //                         "targets": [3]
    //                     },
    //                     {
    //                         "targets": 'no-sort',
    //                         "orderable": false
    //                     }
    //                 ]
    //             });
    //         },
    //         complete: function(){
    //             Portal.unblockUI("#storeowners-table");
    //         }
    //     })
    //         // when everything is done, refresh tables and check for any errors
    //         .done(function(resp) {
    //             // console.log("ajax done, checking for messages");
    //             if (resp['code'] == '-1') {
    //                 toastr.success('Linked Retailer', 'Success');
    //                 // Reload tables
    //                 $('#storeowners-table_wrapper .pagination li:eq(1) a').trigger('click');
    //                 $('#storeowners-linked-table_wrapper .pagination li:eq(1) a').trigger('click');
    //             } else {
    //                 actionBlock.find('span.fa').remove();
    //                 actionBlock.find('a.link').show();
    //                 toastr.error(resp['desc'], 'Error');
    //             }
    //
    //         })
    //         .error(function(xhr, status, error){
    //             // var err = eval("(" + xhr.responseText + ")");
    //             // console.log(JSON.parse(xhr.responseText));
    //             // console.log(error.message);
    //             // actionBlock.find('span.fa').remove();
    //             // actionBlock.find('a.link').show();
    //             toastr.error(xhr.responseText);
    //         });
    // };

    // get unlinked retailers and load them into the table
    // getLinkedRetailers = function(){
    //     // get disabled retailers
    //     $.ajax({
    //         url: BASE_URL + "/retailers/getlinked",
    //         type: 'get',
    //         dataType: 'json',
    //         beforeSend: function(){
    //             Portal.blockUI({
    //                 animate: true,
    //                 target: "#storeowners-linked-table"
    //             });
    //         },
    //         success: function (data){
    //             // var lRetailers = data;
    //             // console.log(data);
    //             // let retailersData = JSON.parse(data).retailers;
    //             $("#storeowners-linked-table").DataTable( {
    //                 // "processing": true,
    //                 // "serverSide": true,
    //                 data: JSON.parse(data).retailers,
    //                 // data: data.retailers,
    //                 columns: [
    //                     {"data": "id" },
    //                     {"data": "name" },
    //                     {"data": "state" },
    //                     {"data": "id" }
    //                 ],
    //                 "columnDefs": [
    //                     {
    //                         "render": function (data, type, row, meta) {
    //                             // let actions = '<button value="'+data+'" class="btn btn-sm link btn-primary unlink-retailer">Unlink</button>';
    //                             let actions = '<a retailer_id="'+data+'" class="btn btn-sm link btn-primary unlink-retailer">Unlink</a>';
    //                             return actions;
    //                         },
    //                         "targets": [3]
    //                     },
    //                     {
    //                         "targets": 'no-sort',
    //                         "orderable": false
    //                     }
    //                 ]
    //             });
    //         },
    //         complete: function(){
    //             Portal.unblockUI("#storeowners-linked-table");
    //         }
    //     });
    // };








    getUnlinkedRetailers = function() {
        // get disabled retailers
        $.ajax({
            url: BASE_URL + "/retailers/data",
            type: 'get',
            dataType: 'json',
            beforeSend: function () {
                Portal.blockUI({
                    animate: true,
                    target: "#storeowners-table"
                });
            },
            success: function (data) {
                // initialize unlinked retailers table
                initializeUnlinkedRetailersTable();
            },
            complete: function() {
                Portal.unblockUI("#storeowners-table");
            }
        });
    };
    initializeUnlinkedRetailersTable = function() {

        var retailersUnlinkedGrid = new Datatable();
        retailersUnlinkedGrid.init({
            "src": $("#storeowners-table"),
            loadingMessage: 'Loading...',
            "dataTable": $.extend(
                retailersUnlinkedGrid.lockedScrollOptions(),
                {
                    "stateSave": true,
                    "columns": [
                        {"data": "id"},
                        {"data": "name"},
                        {"data": "state"},
                        {"data": "id"}
                    ],
                    "columnDefs": [
                        {
                            "render": function(data, type, row) {
                                var actions = '<button href="" class="btn btn-sm unlink btn-primary blue link-retailer" value="'+data+'">Link</button>';
                                return actions;
                            },
                            "targets": [3]
                        },
                        {
                            "targets": "no-sort",
                            "orderable": false
                        }
                    ],
                    "extraTableFilters": {
                        "filtersContainer": 'form#storeowners-table',
                        "filterNames": ['name']
                    },
                    "ajax": {
                        "url": BASE_URL + "/retailers/data",
                        "method": "GET"
                    },
                    "extraBlockedTableContainer": 'div.table-container'
                }
            )
        });

    };


    getLinkedRetailers = function() {
        var data = {
            'userId': currentLoyaltyUserId
        };
        // get disabled retailers
        $.ajax({
            url: BASE_URL + "/retailers/getlinked",
            data: data,
            type: 'post',
            dataType: 'json',
            beforeSend: function () {
                Portal.blockUI({
                    animate: true,
                    target: "#storeowners-linked-table"
                });
            },
            success: function () {
                // console.log(data);
                // initialize unlinked retailers table
                initializeLinkedRetailersTable();

            },
            complete: function() {
                Portal.unblockUI("#storeowners-linked-table");
            }
        });
    };
    initializeLinkedRetailersTable = function() {

        // console.log(tableData.data);

        var retailersLinkedGrid = new Datatable();
        // console.log(retailersLinkedGrid);
        retailersLinkedGrid.init({
            "src": $("#storeowners-linked-table"),
            loadingMessage: 'Loading...',
            "dataTable": $.extend(
                retailersLinkedGrid.lockedScrollOptions(),
                {
                    "stateSave": true,
                    "columns": [
                        {"data.retailer": "id"},
                        {"data.retailer": "name"},
                        {"data.retailer": "state"},
                        {"data.retailer": "id"}
                    ],
                    "columnDefs": [
                        {
                            "render": function(data, type, row) {
                                // console.log(data);
                                var actions = '<button href="" class="btn btn-sm unlink btn-primary red unlink-retailer" value="'+data+'">Unlink</button>';
                                return actions;
                            },
                            "targets": [3]
                        },
                        {
                            "targets": "no-sort",
                            "orderable": false
                        }
                    ],
                    // "extraTableFilters": {
                    //     "filtersContainer": 'form#storeowners-linked-table',
                    //     "filterNames": ['name']
                    // },
                    // "ajax": tableData.data,
                    // "ajax": BASE_URL + "/retailers/getlinked",
                    "ajax": {
                        "url": BASE_URL + "/retailers/getlinked",
                        "method": "GET"
                    },
                    // "ajax": {
                    //     "url": BASE_URL + "/retailers/getlinked",
                    //     "dataSrc": tableData.data
                    // },
                    "extraBlockedTableContainer": 'div.table-container'
                }
            )
        });

    };






    return {
        init: function () {

            // reload/refresh window size
            $(window).resize(Portal.globalHandleOverflowColumns);

            getUnlinkedRetailers();
            getLinkedRetailers();




            // getRetailers();
            // getLinkedRetailers();
            // getUnlinkedRetailers();

            // // Linked Store Owners
            // var storeOwnersLinkedGrid = new Datatable();
            // storeOwnersLinkedGrid.init({
            //     "src": $("#storeowners-table"),
            //     loadingMessage: 'Loading...',
            //     "dataTable": $.extend(storeOwnersLinkedGrid.lockedScrollOptions(), {
            //         "stateSave": true,
            //         "columns": [
            //             {"data": "id"},
            //             {"data": "name"},
            //             {"data": "state"},
            //             {"data": "id"}
            //         ],
            //         "columnDefs": [
            //             {
            //                 "render": function (data, type, row) {
            //                     var actions = '<a href="" class="btn btn-sm unlink btn-primary red">Unlink</a>';
            //
            //                     return actions;
            //                 },
            //                 "targets": [3]
            //             },
            //             {
            //                 "targets"  : 'no-sort',
            //                 "orderable": false
            //             }
            //         ],
            //         "extraTableFilters": {
            //             "filtersContainer": 'form#storeowners-linked-filter-form',
            //             "filterNames": ['name']
            //         },
            //         "ajax": {
            //             // "url": BASE_URL + "/storeowners/data?isLinked=true",
            //             "url": BASE_URL + "/retailers/getunlinked",
            //             "method": "GET"
            //         },
            //         "extraBlockedTableContainer": 'div.table-container'
            //     })
            // });


        }
    }

}();