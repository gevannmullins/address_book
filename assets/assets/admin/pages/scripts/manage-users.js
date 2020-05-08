var ManageUsers = function () {

    $(document).on('change', 'form select[name=profileId]', function (e) {
        if (loyaltyProfiles['ADMIN'] == $(this).val()) {
            $('form div.callback-urls-group').addClass('hide');
            $('form div.external-rewards').addClass('hide');
        } else {
            $('form div.callback-urls-group').removeClass('hide');
            $('form div.external-rewards').removeClass('hide');
        }
        $(window).trigger('resize');
    });

    return {
        init: function () {
            $(window).resize(Portal.globalHandleOverflowColumns);

            var manageUsersGrid = new Datatable();

            var loyaltyProfilesIds = {};
            $.each(loyaltyProfiles, function (index, value) {
                loyaltyProfilesIds[value] = index;
            });

            manageUsersGrid.init({
                "src": $("#manage-users-table"),
                "dataTable": {
                    "processing": false,
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
                        "emptyTable": "No users found.",
                        "lengthMenu": "_MENU_ records per page"
                    },
                    "columns": [
                        {"data": "id"},
                        {"data": "username"},
                        {"data": "countryId"},
                        {"data": "email"},
                        {"data": "profileId"},
                        {"data": "state"},
                        {"data": "id"}
                    ],
                    "columnDefs": [
                        {
                            "render": function (data, type, row) {
                                if (data) {
                                    return countries[data];
                                } else {
                                    return ''
                                }
                            },
                            "targets": [2]
                        },
                        {
                            "render": function (data, type, row) {
                                if (data == 'A') {
                                    return '<span>Active</span>'
                                } else {
                                    return '<span class="deactivated">Deactivated</span>'
                                }
                            },
                            "targets": [5]
                        },
                        {
                            "render": function (data, type, row) {
                                if (loyaltyProfilesIds[data]) {
                                    var s = loyaltyProfilesIds[data];
                                    return s[0].toUpperCase() + s.substr(1).toLowerCase();
                                }
                                return data;
                            },
                            "targets": [4]
                        },
                        {
                            "render": function (data, type, row) {
                                var actions = '<a href="' + BASE_URL + '/users/' + row.id + '/edit" class="btn btn-sm btn-primary">Edit</a>';

                                return actions;
                            },
                            "targets": [6]
                        },
                        {
                            "render": function (data, type, row) {
                                return window.states[data];
                            },
                            "targets": [5]
                        },
                        {
                            "targets": 'no-sort',
                            "orderable": false
                        }
                    ],
                    "ajax": {
                        "url": BASE_URL + "/users/data",
                        "method": "GET"
                    },
                    "createdRow": function (row, data, dataIndex) {
                        $(row).addClass('clickable');
                    },
                    "extraBlockedTableContainer": 'div.table-container',
                    "extraTableFilters": {
                        "filtersContainer": 'form#manage-users-filter-form',
                        "filterNames": ['username', 'countryId']
                    },
                    'extraDrawCallback': function (settings) {
                        $(window).trigger('resize');
                    }
                }
            });

            // Trigger table filtering, works by re-drawing
            $(document).on('submit', 'form#manage-users-filter-form', function (e) {
                $("#manage-users-table").DataTable().draw();
                return false;
            });

        }
    };
}();