
var SelectUsers = function () {

    // Current favourite program
    var favouriteUserId = $('#selectUser span').attr('data-favourite-id');

    $(document).on({
        mouseenter: function () {
            $(this).addClass('fa-spin');
        },
        mouseleave: function () {
            $(this).removeClass('fa-spin');
        }
    }, "#ajax .modal-content h4.modal-title a.fa-refresh");

    // Reload users table
    $(document).off('click', "#ajax a.users-refresh")
        .on('click', "#ajax a.users-refresh", function() {
            $(this).removeClass('fa-spin');
            if ($('#loyalty-users-table').length) {
                $('#loyalty-users-table').DataTable().draw();
            } else {
                $('div.top-menu a#selectUser').trigger('click');
            }
    });

    $(document).off('click', 'div.top-menu a#selectUser')
        .on('click', 'div.top-menu a#selectUser', function(e) {
            var userModalTitle = 'Please select a User&nbsp;&nbsp;&nbsp;'
                + '<a class="fa fa-refresh users-refresh"></a>'
            var activeButton = $(this);
            var programsButton = $('div.top-menu a#selectProgram');
            $("#ajax .modal-content").html($('script#modal-content-template').html());
            $("#ajax .modal-content").find('h4.modal-title').html(userModalTitle);
            $('#ajax').modal({
                backdrop: 'static',
                keyboard: false
            });
            if (!activeButton.find(' > span').attr('data-id') || !programsButton.find(' > span').attr('data-id')) {
                $('#ajax .modal-header button.close').hide()
            }
            var data = {};
            $.get(BASE_URL + '/campaigns/getusers', data, function(resp) {
                $('html, body').animate({scrollTop: 0}, 'slow');
                $('html').addClass('overflow-disabled-tmp');
                $("#ajax .modal-content").html(resp);
                $("#ajax .modal-content").find('h4.modal-title').html(userModalTitle);
                setTimeout(function() { SelectUsers.init(); }, 300);
                if (!activeButton.find(' > span').attr('data-id') || !programsButton.find(' > span').attr('data-id')) {
                    $('#ajax .modal-header button.close').hide()
                }
                $('#ajax').on('hidden.bs.modal', function (e) {
                    $('html').removeClass('overflow-disabled-tmp');
                });
            });

        });

    $(document).on({
        mouseenter: function(){
            $(this).find('i').removeClass('fa-star-o').addClass('fa-star');
        },
        mouseleave: function(){
            if (!$(this).find('i').hasClass('selected')) {
                $(this).find('i').removeClass('fa-star').addClass('fa-star-o');
            }
        }
    }, "table#loyalty-users-table tr td:first-child a.favorite");

    $(document).off('click', 'table#loyalty-users-table tbody tr a.favorite')
        .on('click', 'table#loyalty-users-table tbody tr a.favorite', function(e) {

            var usersDataTable =  $("table#loyalty-users-table").DataTable();
            var selectedData = usersDataTable.row($(this).closest('tr')).data();
            var url = BASE_URL + "/users/setfavourite";

            selectedData['currentFavourite'] = favouriteUserId;

            Portal.rawAjaxRequest(url, selectedData, "#ajax .modal-content", function (response) {
                if (response['code'] == '-1') {
                    if (favouriteUserId == selectedData['id']) {
                        favouriteUserId = null;
                        toastr.success('User unmarked as favourite', 'Success');
                    } else {
                        favouriteUserId = selectedData['id'];
                        toastr.success('User marked as favourite', 'Success');
                    }
                    $('#ajax .pagination li.active a').trigger('click');
                } else {
                    toastr.error(response['desc'], 'Error');
                }
            });
        });

    return {
        init: function () {
            $(window).resize(Portal.globalHandleOverflowColumns);

            // select session user
            $(document).off('click', 'table#loyalty-users-table tbody tr.clickable')
                .on('click', 'table#loyalty-users-table tbody tr.clickable', function(e) {
                    if (e.target.tagName != 'TD') {
                        // probably clicked button to favorite a user
                        return false;
                    }
                    var usersDataTable =  $("table#loyalty-users-table").DataTable();
                    var selectedData = usersDataTable.row($(this).closest('tr')).data();
                    var url = BASE_URL + "/campaigns/setuser";

                    Portal.rawAjaxRequest(url, selectedData, "#ajax .modal-body", function (response) {
                        toastr.success('Applying selected loyalty user', 'Success');
                        // window.location.reload(true);
                        
                        $('div.top-menu a#selectProgram').trigger('click');
                    });
                });

            // portal users listing
            var portalUsersGrid = new Datatable();
            portalUsersGrid.init({
                "src": $("#loyalty-users-table"),
                loadingMessage: 'Loading...',
                "dataTable": {
                    "processing": false,
                    "serverSide": true,
                    "dom": "<'row'<'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-sm-8'p><'col-sm-4'l>>",
                    "lengthMenu": [10, 20, 50, 75, 100, 250],
                    "scrollY":        "20px",
                    "pageLength": 20,
                    "stateSave": false,
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
                        "emptyTable": "No users found.",
                        "lengthMenu": "_MENU_ records per page"
                    },
                    "columns": [
                        {"data": "id"},
                        {"data": "username"},
                        {"data": "email"},
                        {"data": "state"}
                    ],
                    "columnDefs": [
                        {
                            "render": function (data, type, row) {
                                var favClasses = 'fa-star-o';
                                if (favouriteUserId == data) {
                                    favClasses = 'fa-star selected';
                                };

                                data = ' <a class="favorite"><i class="fa ' + favClasses + '"></i></a>' + data;
                                return data;
                            },
                            "targets": [0]
                        },
                        {
                            "render": function (data, type, row) {
                                var blockContent;
                                if (data == 'A') {
                                    blockContent = '<span>Active</span>'
                                } else {
                                    blockContent = '<span class="deactivated">Deactivated</span>'
                                }
                                return blockContent;
                            },
                            "targets": [3]
                        },
                        {
                            "targets"  : 'no-sort',
                            "orderable": false
                        }
                    ],
                    "ajax": {
                        "url": BASE_URL + "/users/data?profileId=" + loyaltyProfiles.BASIC,
                        "method": "GET"
                    },
                    "createdRow": function( row, data, dataIndex ) {
                        $(row).addClass( 'clickable' );
                    },
                    "extraBlockedTableContainer": 'div.table-container',
                    "extraTableFilters": {
                        "filtersContainer": 'form#users-filter-form',
                        "filterNames": ['username']
                    },
                    'extraDrawCallback': function(settings) {
                        $(window).trigger('resize');
                        // Search focus
                        $('#ajax input[name=username]:first').focus();
                    }
                }
            });

            // Trigger table filtering, works by re-drawing
            $(document).on('submit', 'form#users-filter-form', function(e) {
                $("#loyalty-users-table").DataTable().draw();
                return false;
            });

        }
    };
}();
