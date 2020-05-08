var earnTags = [];

var Tags = function () {


    var initTables = function () {
        // channels listing

        $('#tags-table').dataTable().fnDestroy();
        tagsGrid = new Datatable();

        var tagsColumns = [
            {"data": "name"},
            {"data": "description"},
            {"data": "action"}
        ];

        tagsGrid.init({
            "src": $("#tags-table"),
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
                    "emptyTable": "No tags found.",
                    "lengthMenu": "_MENU_ records per page"
                },
                "columns": tagsColumns,
                "columnDefs": [
                    {
                        "render": function (data, type, row) {
                            earnTags[row.id] = row;
                            var actions = '<a data-id="' + row.id + '" class="btn btn-sm btn-primary btn-edit" href="javascript:void(0)">Edit</a>'
                            return actions;
                        },
                        "targets": [2]
                    }
                ],
                "ajax": {
                    "url": BASE_URL + "/tags/data",
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

            $(document).off('click', '#btn-create', Tags.add);
            $(document).on('click', '#btn-create', Tags.add);
            $(document).on('click', '.btn-edit', function (e) {
                var $id = $(this).data('id');
                var $data = earnTags[$id];
                console.log($id);
                $('#btn-create').hide();
                $('#btn-update').show();

                $('.id').val($data["id"]);
                $('.name').val($data["name"]);
                $('.description').val($data["description"]);

            });
            $(document).off('click', '#btn-update',Tags.update);
            $(document).on('click', '#btn-update',Tags.update);

        },
        add: function () {
            $data = $('#campaign_tags_form').serializeArray();
            Portal.rawAjaxRequest(BASE_URL + '/campaigns/createTags', $data, '.campaignForm', function (response) {
                if (response.response.code == "-1") {
                    toastr.success("Tag has been created successfully.", "Success");
                    Tags.init();
                    $('.name').val("");
                    $('.description').val("");
                } else {
                    toastr.error(response.response.desc, "Error");
                }
            });

        },
        update: function () {
            $data = $('#campaign_tags_form').serializeArray();
            Portal.rawAjaxRequest(BASE_URL + '/campaigns/updateTags', $data, '.campaignForm', function (response) {
                if (response.response.code == "-1") {

                    $('#btn-create').show();
                    $('#btn-update').hide();

                    toastr.success("Tag has been updated successfully.", "Success");
                    Tags.init();
                    $('.name').val("");
                    $('.description').val("");
                } else {
                    toastr.error(response.response.desc, "Error");
                }
            });
        },

    }


}();