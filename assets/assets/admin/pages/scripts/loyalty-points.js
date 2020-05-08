
var LoyaltyPoints = function () {


    var initTables = function () {
        // channels listing

        $('#portal_points_table').dataTable().fnDestroy();
        pointsGrid = new Datatable();

        var pointsColumns = [
            {"data": "id"},
            {"data": "campaignId"},
            {"data": "customerId"},
            {"data": "customerRefType"},
            {"data": "customerRef"},
            {"data": "loyaltyPoints"},
            {"data": "reason"},
            {"data": "createDate"},
            {"data": "state"}

        ];

        pointsGrid.init({
            "src": $("#portal_points_table"),
            loadingMessage: 'Loading...',
            "dataTable": {
                "serverSide": true,
                "dom": "<'row'<'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-sm-8'p><'col-sm-4'l>>",
                "lengthMenu": [10, 20, 50, 75, 100, 250],
                "scrollY": "225px",
                "pageLength": 20,
                "stateSave": true,
                "pagingType": "full_numbers",
                "paging": true,
                "language": {
                    "paginate": {
                        "previous": "Previous",
                        "next": "Next",
                        'last': null,
                        'first': null
                    },
                    "emptyTable": "No loyalty points found.",
                    "lengthMenu": "_MENU_ records per page"
                },
                "columns": pointsColumns,
                "ajax": {
                    "url": BASE_URL + "/points/data",
                    "method": "GET"
                },
                'extraDrawCallback': function (settings) {
                    $(window).trigger('resize');
                }
            }
        });
    }

    return {
        init: function () {

            initTables();
            $(document).off('click', '#btnSubmit', LoyaltyPoints.add);
            $(document).on('click', '#btnSubmit', LoyaltyPoints.add);

            $("#campaignId").change(function(){

                LoyaltyPoints.getEarnTags();
            });

        },
        add: function () {
            $data = $('#loyalty_points_form').serializeArray();
            Portal.rawAjaxRequest(BASE_URL + '/points/loads/issue', $data, '.uploadForm', function (response) {
                if (response.response.code == "-1") {
                    toastr.success("Points has been loaded successfully.", "Success");
                    window.location = BASE_URL + '/points';
                } else {
                    toastr.error(response.response.desc, "Error");
                }
            });
        },
        getEarnTags: function () {
            //get selected campaign id
            $campaignId = $('#campaignId').val();

            //parameters for get tags
            const params = {
                id: $campaignId
            };

            Portal.rawAjaxRequest(BASE_URL + '/load/earntags', params, '.uploadForm', function (response) {
                //change the response object to array
                var tags = Object.keys(response).map(function(key) {
                    return [Number(key), response[key]];
                });
                //append the array as options on earntag drop down
                var element = $('#earnTagIds').select2();

                    for (var d = 0; d < tags.length; d++) {
                        var item = tags[d];

                        var option = new Option(item[1], item[0]);
                        element.append(option);
                    }

            });

        },

    }


}();




