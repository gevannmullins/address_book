

var RetailersLink = function () {


    $(document).off('click', '.enable_retailer')
        .on('click', '.enable_retailer', function(e) {

            e.preventDefault();
            var thisRetailId = JSON.parse($(this).val());
            // console.log("RetailId"+thisRetailId);


            $.ajax({
                url: BASE_URL + "/retailers/link",
                type: "POST",
                data: thisRetailId,
                success: function(data){
                    console.log(thisRetailId);
                    console.log("Response"+data);
                }


            });



        });

    $(document).off('click', '.disable_retailer')
        .on('click', '.disable_retailer', function(e) {

            e.preventDefault();
            let thisRetailId = $(this).val();
            console.log(thisRetailId);

        });


    // get disabled retailers and load them into the table
    var getDisabledRetailers = function(){
        // get disabled retailers
        $.ajax({
            url: BASE_URL + "/retailers/disabled",
            type: 'get',
            dataType: 'json',
            beforeSend: function(){
                Portal.blockUI({
                    animate: true,
                    target: "#disabled-retailers-table"
                });
            },
            success: function (data){
                // let retailersData = JSON.parse(data).retailers;
                $("#disabled-retailers-table").DataTable( {
                    // "processing": true,
                    // "serverSide": true,
                    data: JSON.parse(data).retailers,
                    columns: [
                        {"data": "id" },
                        {"data": "id" },
                        {"data": "name" },
                        {"data": "state" },
                        {"data": "id" }
                    ],
                    "columnDefs": [
                        {
                            "render": function (data, type, row) {
                                return '<input type="checkbox" name="id[]" value="' + data + '" />';
                            },
                            "targets": [0]
                        },
                        {
                            "render": function (data, type, row, meta) {
                                let actions = '<button value="'+data+'" class="btn btn-sm link btn-primary enable_retailer">Enable</button>';
                                return actions;
                            },
                            "targets": [4]
                        },
                        {
                            "targets": 'no-sort',
                            "orderable": false
                        }
                    ]
                });
            },
            complete: function(){
                Portal.unblockUI("#disabled-retailers-table");
            }
        });
    };

    // get enabled retailers and load them into the table
    var getEnabledRetailers = function () {
        // get enabled retailers
        $.ajax({
            url: BASE_URL + "/retailers/enabled",
            type: 'get',
            dataType: 'json',
            beforeSend: function(){
                Portal.blockUI({
                    animate: true,
                    target: "#retailers-enabled-table"
                });
            },
            success: function (data){
                $("#retailers-enabled-table").DataTable( {
                    data: JSON.parse(data).retailers,
                    columns: [
                        {"data": "id" },
                        {"data": "id" },
                        {"data": "name" },
                        {"data": "state" },
                        {"data": "id" }
                    ],
                    "columnDefs": [
                        {
                            "render": function (data, type, row) {
                                return '<input type="checkbox" name="id[]" value="' + data + '" />';
                            },
                            "targets": [0]
                        },
                        {
                            "render": function (data, type, row) {
                                let actions = '<button value="'+data+'" class="btn btn-sm link btn-primary disable_retailer">Disabled</button>';
                                return actions;
                            },
                            "targets": [4]
                        },
                        {
                            "targets": 'no-sort',
                            "orderable": false
                        }
                    ]
                });
            },
            complete: function(){
                Portal.unblockUI("#retailers-enabled-table");
            }

        });


    }


    return {
        init: function () {

            getDisabledRetailers();
            getEnabledRetailers();

        }
    }

}();