var Customers = function () {

    $(window).resize(Portal.globalHandleOverflowColumns);

    var handleCustomerState = function (e) {
        const id = $(this).data('id'),
            state = $(this).data('state');

        const $data = {
            'state': (state === 'D') ? 'A' : 'D'
        };

        Portal.rawAjaxRequest(BASE_URL + `/customer/${id}`, $data, 'div.table-container', () => {
            $("#customers-table").DataTable().draw();
        });
    }

    return {
        init: function () {
            customerGrid = new Datatable();

            customerGrid.init({
                "src": $("#customers-table"),
                loadingMessage: 'Loading...',
                "dataTable": {
                    "serverSide": true,
                    "dom": "<'row'<'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-sm-8'p><'col-sm-4'l>>",
                    "lengthMenu": [10, 20, 50, 75, 100, 250],
                    "scrollY": "20px",
                    "pageLength": 20,
                    "stateSave": true,
                    // "autoWidth": true,
                    "pagingType": "full_numbers",
                    "paging": true,
                    "language": {
                        "paginate": {
                            "previous": "Previous",
                            "next": "Next",
                            'last': null,
                            'first': null
                        },
                        "emptyTable": "No customers found.",
                        "lengthMenu": "_MENU_ records per page"
                    },
                    "columns": [
                        {"data": "id"},
                        {"data": "reference"},
                        {"data": "pan"},
                        {"data": "email"},
                        {"data": "name"},
                        {"data": "surname"},
                        {"data": "dateOfBirth"},
                        {"data": "genderId"},
                        {"data": "mobileNumber"},
                        {"data": "idNumber"},
                        {"data": "state"},
                        {"data": "state"},
                    ],
                    "columnDefs": [
                        {
                            "render": function (data, type, row) {
                                if (!data) {
                                    return data;
                                }
                                return moment(data).format('YYYY-MM-DD');
                            },
                            "targets": [6]
                        },
                        {
                            "render": function (data, type, row) {
                                if (data === "M") {
                                    return "Male";
                                } else if (data === "F") {
                                    return "Female";
                                } else if (data === "O") {
                                    return "Other";
                                } else {
                                    return data;
                                }
                            },
                            "targets": [7]
                        },
                        {
                            "targets": 'no-sort',
                            "orderable": false
                        },
                        {
                            "targets": [10],
                            "render": function (data, type, row) {
                                if (data === "A") {
                                    return "Active";
                                } else if (data === "D") {
                                    return "Deactivated";
                                }
                            }
                        }, {
                            "targets": [11],
                            "render": function (data, type, row) {
                                var actions = "";
                                if (data === "A") {
                                    actions = actions.concat('<a data-id="' + row.id + '" data-state="' + data + '" class="btn btn-xs red btn-toggle-customer" href="javascript:void(0)">Deactivate</a>');
                                } else if (data === "D") {
                                    actions = actions.concat('<a data-id="' + row.id + '" data-state="' + data + '" class="btn btn-xs btn-primary btn-toggle-customer" href="javascript:void(0)">Activate</a>');
                                }
                                return actions;
                            }
                        }
                    ],
                    "ajax": {
                        "url": BASE_URL + "/customer/data",
                        "method": "GET"
                    },
                    "createdRow": function (row, data, dataIndex) {
                        $(row).addClass('clickable');
                    },
                    "extraBlockedTableContainer": 'div.table-container',
                    "extraTableFilters": {
                        "filtersContainer": 'form#customers-filter-form',
                        "filterNames": ['mobileNumber', 'pan', 'reference']
                    },
                    'extraDrawCallback': function (settings) {
                        $(window).trigger('resize');
                    }
                }
            });

            $('.btn-toggle-customer').off('click', handleCustomerState);
            $(document).on('click', '.btn-toggle-customer', handleCustomerState);

            // Trigger table filtering, works by re-drawing
            $(document).on('submit', 'form#customers-filter-form', function (e) {
                $("#customers-table").DataTable().draw();
                return false;
            });

        }
    };

}();
