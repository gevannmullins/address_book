
var Channels = function () {

    return {
        init: function () {
            $(window).resize(Portal.globalHandleOverflowColumns);

            // channels listing
            channelsGrid = new Datatable();

            var channelColumns = [
                {"data": "name"},
                {"data": "id"},
                {"data": "isLinkedToPan"},
                {"data": "requireMobileNumber"},
                {"data": "state"}
            ];

            var channelColumnDefs = [
                {
                    "render": function (data, type, row) {
                        if (data == 'A') {
                            return '<span>Active</span>'
                        } else {
                            return '<span class="deactivated">Deactivated</span>'
                        }
                    },
                    "targets": [4]
                },
                {
                    "render": function (data, type, row) {
                        return (data) ? "Yes" : "No";
                    },
                    "targets": [2,3]
                },
                {
                    "targets"  : 'no-sort',
                    "orderable": false
                }
            ];

            if (!userIsAdmin) {
                channelColumns.push({"data": "id"})

                channelColumnDefs.push(
                    {
                        "render": function (data, type, row) {
                            var actions = '<a href="' + BASE_URL + '/channels/' + row.id + '/edit" class="btn btn-sm btn-primary">Edit</a>';

                            return actions;
                        },
                        "targets": [5]
                    }
                );
            }

            channelsGrid.init({
                "src": $("#channels-table"),
                loadingMessage: 'Loading...',
                "dataTable": {
                    "serverSide": true,
                    "dom": "<'row'<'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-sm-8'p><'col-sm-4'l>>",
                    "lengthMenu": [10, 20, 50, 75, 100, 250],
                    "scrollY": "20px",
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
                        "emptyTable": "No channels found.",
                        "lengthMenu": "_MENU_ records per page"
                    },
                    "columns": channelColumns,
                    "columnDefs": channelColumnDefs,
                    "ajax": {
                        "url": BASE_URL + "/channels/data",
                        "method": "GET"
                    },
                    "createdRow": function( row, data, dataIndex ) {
                        $(row).addClass( 'clickable' );
                    },
                    "extraBlockedTableContainer": 'div.table-container',
                    'extraDrawCallback': function(settings) {
                        $(window).trigger('resize');
                    }
                }
            });
        }
    };
}();
