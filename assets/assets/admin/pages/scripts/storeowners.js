
var StoreOwners = function () {

    // Fix table widths on dropdown click
    var filterButton = '.overflow-disabled .custom-table-filter .dropdown button';
    $(document).off('click', filterButton).on('click', filterButton, function(e) {
        $(window).trigger('resize');

        // Search focus
        $(this).closest('.dropdown').find('.search input').focus();
    });

    var storeOwnerForm = $('#store-owners-filter-form');

    $(document).off('click', '#store-owners-filter-form .reset-store-owners-filter a')
        .on('click', '#store-owners-filter-form .reset-store-owners-filter a', function(e) {
            var filters = ['storeGroupId', 'storeGroupName', 'retailerId', 'retailerName', 'storeId', 'storeName'];
            $.each(filters, function(index, value) {
                storeOwnerForm.find('input[name=' + value + ']').attr('value', '');
            });
            $('.dropdown.store-group-filter > button span.selected').text('All');
            $('.dropdown.retailer-filter > button span.selected').text('All');
            $('.dropdown.store-filter > button span.selected').text('All');

            $('#storeowners-table_wrapper .pagination li:eq(1) a').trigger('click');
            $('#storeowners-linked-table_wrapper .pagination li:eq(1) a').trigger('click');

            return false;
        });

    // Store Owners linked table filter
    $(document).on('submit', 'form#storeowners-linked-filter-form', function(e) {
        $("#storeowners-linked-table").DataTable().draw();
        return false;
    });

    // Store Owners unlinked table filter
    $(document).on('submit', 'form#storeowners-unlinked-name-filter-form', function(e) {
        var storeOwnerName = $(this).find('input[name=storeOwnerName]').val();
        $('form#store-owners-filter-form > input[name=storeOwnerName]').val(storeOwnerName);
        $("#storeowners-table").DataTable().draw();
        return false;
    });

    // Handle filter table filter action
    function handleFilterTableFilter(dropdownObject) {

        dropdownObject.find('.search button i').removeClass('fa-search')
            .addClass('fa-circle-o-notch')
            .addClass('fa-spin')

        var tableId = dropdownObject.find('.dataTables_scrollBody > table').attr('id');
        var filterTable = $('#' + tableId).DataTable();

        filterTable.ajax.reload();
    }

    // Filter store owner filter table
    $(document).on('click', 'div.custom-table-filter .dropdown-menu .search button', function(e) {
        handleFilterTableFilter($(this).closest('.dropdown-menu'));
    });

    $(document).on('keyup', 'div.custom-table-filter .dropdown-menu .search', function(e) {
        if (e.keyCode != 13) {
            return ;
        }
        handleFilterTableFilter($(this).closest('.dropdown-menu'));
    });

    // Handle store owner filter
    function handleStoreOwnersFilters(selectedRow, filterId, filterField) {
        var filterTable = $('#' + filterId + '-table').DataTable();
        var selectedRowData = filterTable.row(selectedRow).data()
        if (selectedRowData['id']) {
            storeOwnerForm.find('input[name=' + filterField + 'Id]').attr('value', selectedRowData['id']);
            storeOwnerForm.find('input[name=' + filterField + 'Name]').attr('value', selectedRowData['name']);
            $('.dropdown.' + filterId + ' > button span.selected').text(selectedRowData['name']);
        }
        selectedRow.closest('.dropdown').removeClass('open');
        $('#storeowners-table_wrapper .pagination li:eq(1) a').trigger('click');
    }

    // Store Groups
    $(document).off('click', 'table#store-groups-filter-table tr.clickable')
        .on('click', 'table#store-groups-filter-table tr.clickable', function(e) {
            handleStoreOwnersFilters($(this), 'store-groups-filter', 'storeGroup');
        });

    // Stores
    $(document).off('click', 'table#stores-filter-table tr.clickable')
        .on('click', 'table#stores-filter-table tr.clickable', function(e) {
            handleStoreOwnersFilters($(this), 'stores-filter', 'store');
        });

    // Retailer
    $(document).off('click', 'table#retailers-filter-table tr.clickable')
        .on('click', 'table#retailers-filter-table tr.clickable', function(e) {
            handleStoreOwnersFilters($(this), 'retailers-filter', 'retailer');
        });

    // Link Store Owners
    $(document).off('click', '#storeowners-table tr a.link')
        .on('click', '#storeowners-table tr a.link', function(e) {

            var actionBlock = $(this).closest('td');
            // Show spinner
            actionBlock.find('a.link').hide();
            actionBlock.append('<span class="fa fa-circle-o-notch fa-spin fa-2x text-primary"></span>');

            var storeOwnersFilterTable = $('#storeowners-table').DataTable();
            var storeOwnerData = storeOwnersFilterTable.row($(this).closest('tr')).data()

            var data = {
                'userId': currentLoyaltyUserId,
                'storeOwnerId': storeOwnerData['id']
            };

            $.ajax({type: 'POST', data: data, url: BASE_URL + "/storeowners/link", dataType: "json"})
                .done(function(resp) {
                    if (resp['code'] == '-1') {
                        toastr.success('Linked store owner', 'Success');
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

            return false;
        });

    // Unlink Store Owners
    $(document).off('click', '#storeowners-linked-table tr a.unlink')
        .on('click', '#storeowners-linked-table tr a.unlink', function(e) {

            var actionBlock = $(this).closest('td');
            // Show spinner
            actionBlock.find('a.unlink').hide();
            actionBlock.append('<span class="fa fa-circle-o-notch fa-spin fa-2x text-primary"></span>');
            var storeOwnersFilterTable = $('#storeowners-linked-table').DataTable();
            var storeOwnerData = storeOwnersFilterTable.row($(this).closest('tr')).data()

            var data = {
                'userId': currentLoyaltyUserId,
                'storeOwnerId': storeOwnerData['id']
            };

            $.ajax({type: 'POST', data: data, url: BASE_URL + "/storeowners/unlink", dataType: "json"})
                .done(function(resp) {
                    if (resp['code'] == '-1') {
                        toastr.success('Unlinked store owner', 'Success');
                        // Reload tables
                        $('#storeowners-table_wrapper .pagination li:eq(1) a').trigger('click');
                        $('#storeowners-linked-table_wrapper .pagination li:eq(1) a').trigger('click');
                    } else {
                        actionBlock.find('span.fa').remove();
                        actionBlock.find('a.unlink').show();

                        toastr.error(resp['desc'] || "Internal server error", 'Error');
                    }

                })
                .error(function(jqXHR, textStatus, errorThrown) {
                    actionBlock.find('span.fa').remove();
                    actionBlock.find('a.unlink').show();
                    toastr.error(jqXHR.responseJSON.error.message);
                });

            return false;
        });

    return {
        init: function () {
            $(window).resize(Portal.globalHandleOverflowColumns);

            // All
            var storeOwnersGrid = new Datatable();
            storeOwnersGrid.init({
                "src": $("#storeowners-table"),
                loadingMessage: 'Loading...',
                "dataTable": $.extend(storeOwnersGrid.lockedScrollOptions(), {
                    "stateSave": true,
                    "columns": [
                        {"data": "id"},
                        {"data": "name"},
                        {"data": "state"},
                        {"data": "id"}
                    ],
                    "columnDefs": [
                        {
                            "render": function (data, type, row) {
                                // console.log(data);
                                var actions = '<a href="" class="btn btn-sm link btn-primary">Link</a>';
                                
                                return actions;
                            },
                            "targets": [3]
                        },
                        {
                            "targets"  : 'no-sort',
                            "orderable": false
                        }
                    ],
                    "ajax": {
                        // "url": BASE_URL + "/storeowners/data?isLinked=false",
                        "url": BASE_URL + "/retailers/data?isLinked=false",
                        "method": "GET"
                    },
                    "extraBlockedTableContainer": 'div.table-container',
                    "extraTableFilters": {
                        "filtersContainer": 'form#store-owners-filter-form',
                        "filterNames": ['storeOwnerName', 'storeGroupId', 'storeGroupName', 'retailerId', 'retailerName', 'storeId', 'storeName']
                    },
                    extraDrawCallback: function(oSettings) {
                        $(window).trigger('resize');
                        // Retailer
                        if (storeOwnerForm.find('input[name=retailerName]').val()) {
                            $('.dropdown.retailer-filter > button span.selected').text(
                                storeOwnerForm.find('input[name=retailerName]').val());
                        }
                        // Store Group
                        if (storeOwnerForm.find('input[name=storeGroupName]').val()) {
                            $('.dropdown.store-group-filter > button span.selected').text(
                                storeOwnerForm.find('input[name=storeGroupName]').val());
                        }
                        // Store
                        if (storeOwnerForm.find('input[name=storeName]').val()) {
                            $('.dropdown.store-filter > button span.selected').text(
                                storeOwnerForm.find('input[name=storeName]').val());
                        }
                    }
                })
            });

            // Linked Store Owners
            var storeOwnersLinkedGrid = new Datatable();
            storeOwnersLinkedGrid.init({
                "src": $("#storeowners-linked-table"),
                loadingMessage: 'Loading...',
                "dataTable": $.extend(storeOwnersLinkedGrid.lockedScrollOptions(), {
                    "stateSave": true,
                    "columns": [
                        {"data": "id"},
                        {"data": "name"},
                        {"data": "state"},
                        {"data": "id"}
                    ],
                    "columnDefs": [
                        {
                            "render": function (data, type, row) {
                                var actions = '<a href="" class="btn btn-sm unlink btn-primary red">Unlink</a>';
                                
                                return actions;
                            },
                            "targets": [3]
                        },
                        {
                            "targets"  : 'no-sort',
                            "orderable": false
                        }
                    ],
                    "extraTableFilters": {
                        "filtersContainer": 'form#storeowners-linked-filter-form',
                        "filterNames": ['name']
                    },
                    "ajax": {
                        // "url": BASE_URL + "/storeowners/data?isLinked=true",
                        "url": BASE_URL + "/retailers/data",
                        "method": "GET"
                    },
                    "extraBlockedTableContainer": 'div.table-container'
                })
            });

            // Store Owners Stores filter
            var storeOwnersStoresFilterGrid = new Datatable();
            storeOwnersStoresFilterGrid.init({
                "src": $("#stores-filter-table"),
                loadingMessage: 'Loading...',
                "dataTable": $.extend(storeOwnersStoresFilterGrid.lockedScrollOptions(), {
                    "stateSave": false,
                    "paging": false,
                    "language": {
                        "paginate": {
                            "previous": "&laquo;",
                            "next": "&raquo;",
                            'last': null,
                            'first': null
                        },
                        "emptyTable": "No filtering stores found.",
                        "lengthMenu": "_MENU_"
                    },
                    "columns": [
                        {"data": "id"},
                        {"data": "name"},
                    ],
                    "ajax": {
                        "url": BASE_URL + "/stores/data",
                        "method": "GET"
                    },
                    "extraBlockedTableContainer": 'div.table-container',
                    "extraTableFilters": {
                        "filtersContainer": 'form#store-owners-filter-form',
                        "filterNames": ['storeFilter', 'storeOwnerFilterUserId', 'start', 'length']
                    },
                    "extraDrawCallback": function(oSettings) {
                        $(window).trigger('resize');

                        // Remove filter field spinning icon
                        $('div.store-filter .search button i')
                            .removeClass('fa-circle-o-notch')
                            .removeClass('fa-spin')
                            .addClass('fa-search');
                    }
                })
            });

            // Store Owners Retailers filter
            var storeOwnersRetailersFilterGrid = new Datatable();
            storeOwnersRetailersFilterGrid.init({
                "src": $("#retailers-filter-table"),
                loadingMessage: 'Loading...',
                "dataTable": $.extend(storeOwnersRetailersFilterGrid.lockedScrollOptions(), {
                    "stateSave": false,
                    "paging": false,
                    "language": {
                        "paginate": {
                            "previous": "&laquo;",
                            "next": "&raquo;",
                            'last': null,
                            'first': null
                        },
                        "emptyTable": "No filtering retailers found.",
                        "lengthMenu": "_MENU_"
                    },
                    "columns": [
                        {"data": "id"},
                        {"data": "name"},
                    ],
                    "ajax": {
                        "url": BASE_URL + "/retailers/data",
                        "method": "GET"
                    },
                    "extraBlockedTableContainer": 'div.table-container',
                    "extraTableFilters": {
                        "filtersContainer": 'form#store-owners-filter-form',
                        "filterNames": ['retailerFilter', 'storeOwnerFilterUserId', 'start', 'length']
                    },
                    "extraDrawCallback": function(oSettings) {
                        $(window).trigger('resize');

                        // Remove filter field spinning icon
                        $('div.retailer-filter .search button i')
                            .removeClass('fa-circle-o-notch')
                            .removeClass('fa-spin')
                            .addClass('fa-search');
                    }
                })
            });

            // Store Owners Store Group filter
            var storeOwnersStoreGroupsFilterGrid = new Datatable();
            storeOwnersStoreGroupsFilterGrid.init({
                "src": $("#store-groups-filter-table"),
                loadingMessage: 'Loading...',
                "dataTable": $.extend(storeOwnersStoreGroupsFilterGrid.lockedScrollOptions(), {
                    "stateSave": false,
                    "paging": false,
                    "language": {
                        "paginate": {
                            "previous": "&laquo;",
                            "next": "&raquo;",
                            'last': null,
                            'first': null
                        },
                        "emptyTable": "No filtering store groups found.",
                        "lengthMenu": "_MENU_"
                    },
                    "columns": [
                        {"data": "id"},
                        {"data": "name"},
                    ],
                    "ajax": {
                        "url": BASE_URL + "/storegroups/data",
                        "method": "GET"
                    },
                    "extraBlockedTableContainer": 'div.table-container',
                    "extraTableFilters": {
                        "filtersContainer": 'form#store-owners-filter-form',
                        "filterNames": ['storeGroupFilter', 'storeOwnerFilterUserId', 'start', 'length']
                    },
                    "extraDrawCallback": function(oSettings) {
                        $(window).trigger('resize');

                        // Remove filter field spinning icon
                        $('div.store-group-filter .search button i')
                            .removeClass('fa-circle-o-notch')
                            .removeClass('fa-spin')
                            .addClass('fa-search');
                    }
                })
            });

            // Fix widths
            setTimeout(function() { $(window).trigger('resize'); }, 1000);
        }
    };



}();