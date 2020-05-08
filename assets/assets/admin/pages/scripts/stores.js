var storeGroupGrid;
var grid;
var linkedGrid;

var Stores = function () {

    var form = $('#campaign_stores');

    var initShortcuts = function () {
        Shortcuts.add("2", function () {
            $("a[href='#frmStores_level']").click();
        });
        Shortcuts.add("1", function () {
            $("a[href='#frmStores_group']").click();
        });
    }

    var handleRecords = function () {

        grid = new Datatable();

        grid.init({
            src: $("#stores"),
            onSuccess: function (grid) {
                //reloadLinkedStores();
            },
            loadingMessage: 'Loading...',
            dataTable: {
                responsive: true,
                "language": {
                    "emptyTable": "No stores available."
                },
                "bServerSide": false,
                "ajax": {
                    "url": BASE_URL + "/stores/store",
                    "method": "GET"
                },
                "dom": "<'row'<'col-md-8 col-sm-12'f><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-md-8 col-sm-12'><'col-md-4 col-sm-12'>>",
                // "bAutoWidth": false,
                "bStateSave": true,
                "lengthMenu": [
                    [-1],
                    ["All"]
                ],
                "pageLength": "All",
                scrollY: "300px",
                scrollCollapse: true,
                paging: false,
                "order": [
                    [1, "asc"]
                ],
                "columns": [
                    {"data": "id"},
                    {"data": "id"},
                    {"data": "name"},
                    {"data": "provinceId"},
                    {"data": "retailerId"}
                ],
                "columnDefs": storeColumns()
            },
            'drawCallback': function (settings) {
                $(window).trigger('resize');
            },
        });

        // handle group actionsubmit button click
        grid.getTableWrapper().on('click', '.table-group-action', function (e) {
            e.preventDefault();
            var action = $(this);

            if (action.val() != "link_all" && grid.getSelectedRowsCount() > 0) {
                grid.setAjaxParam("customActionType", "group_action");
                grid.setAjaxParam("customActionName", action.val());
                grid.setAjaxParam("id", grid.getSelectedRows());
                grid.getDataTable().ajax.reload(function () {
                    linkedGrid.getDataTable().ajax.reload();
                });
                grid.clearAjaxParams();
            } else if (action.val() == "link_all" && grid.getRowsCount() > 0) {
                grid.setAjaxParam("customActionType", "group_action");
                grid.setAjaxParam("customActionName", action.val());
                grid.setAjaxParam("id", grid.getAllRows());
                grid.getDataTable().ajax.reload(function () {
                    linkedGrid.getDataTable().ajax.reload();
                });
                grid.clearAjaxParams();
            }
            else if (action.val() == "") {
                toastr.error('Please select an action', 'Error');
            } else if (grid.getSelectedRowsCount() === 0 || grid.getRowsCount() === 0) {
                toastr.error('No stores available to link', 'Error');
            }
        });

    }

    var initLinkedStores = function () {
        // init linked stores table
        linkedGrid = new Datatable();

        linkedGrid.init({
            src: $("#linked"),
            onSuccess: function (linkedGrid) {
            },
            onError: function (linkedGrid) {
            },
            onDataLoad: function (linkedGrid) {
            },
            loadingMessage: 'Loading...',
            dataTable: {
                responsive: true,
                "language": {
                    "emptyTable": "No stores have been linked to the campaign."
                },
                "bServerSide": false,
                "ajax": {
                    "url": BASE_URL + "/stores/linked",
                    "method": "GET"
                },
                "dom": "<'row'<'col-md-8 col-sm-12'f><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-md-8 col-sm-12'><'col-md-4 col-sm-12'>>",
                "bStateSave": true,
                // "bAutoWidth": true,
                "lengthMenu": [
                    [-1],
                    ["All"] // change per page values here
                ],
                "pageLength": "All", // default record count per page
                scrollY: "300px",
                scrollCollapse: true,
                paging: false,
                "order": [
                    [1, "asc"]
                ],// set first column as a default sort by asc
                "columns": [
                    {"data": "id"},
                    {"data": "id"},
                    {"data": "name"},
                    {"data": "provinceId"},
                    {"data": "retailerId"}
                ],
                "columnDefs": storeColumns(),
            },
            'drawCallback': function (settings) {
                $(window).trigger('resize');
            },
        });

        // handle group actionsubmit button click
        linkedGrid.getTableWrapper().on('click', '.table-group-action', function (e) {
            e.preventDefault();
            var action = $(this);
            if (action.val() != "" && linkedGrid.getSelectedRowsCount() > 0) {
                linkedGrid.setAjaxParam("customActionType", "group_action");
                linkedGrid.setAjaxParam("customActionName", action.val());
                linkedGrid.setAjaxParam("id", linkedGrid.getSelectedRows());
                linkedGrid.getDataTable().ajax.reload(function () {
                    grid.getDataTable().ajax.reload();
                });
                linkedGrid.clearAjaxParams();
            } else if (action.val() == "unlink_all" && linkedGrid.getRowsCount() > 0) {
                linkedGrid.setAjaxParam("customActionType", "group_action");
                linkedGrid.setAjaxParam("customActionName", action.val());
                linkedGrid.setAjaxParam("id", linkedGrid.getAllRows());
                linkedGrid.getDataTable().ajax.reload(function () {
                    grid.getDataTable().ajax.reload();
                });
                linkedGrid.clearAjaxParams();
            } else if (action.val() == "") {
                toastr.error('Please select an action', 'Error');
            } else if (linkedGrid.getSelectedRowsCount() === 0 || linkedGrid.getRowsCount() === 0) {
                toastr.error('No stores available to unlink', 'Error');
            }
        });
    }

    var initStoreGroups = function () {
        // init linked stores table
        storeGroupGrid = new Datatable();

        storeGroupGrid.init({
            src: $("#storeGroups"),
            loadingMessage: 'Loading...',
            dataTable: {
                "language": {
                    "emptyTable": "No store groups linked to campaign."
                },
                "bServerSide": true,
                "ajax": {
                    "url": BASE_URL + "/stores/storegroups",
                    "method": "POST"
                },
                "dom": "<'row'<'col-md-8 col-sm-12'><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-md-8 col-sm-12'><'col-md-4 col-sm-12'>>",
                "bStateSave": true,
                // "bAutoWidth": false,
                "paging": true,
                "columns": [
                    {"data": "id"},
                    {"data": "id"},
                    {"data": "name"},
                    {"data": "retailerId"},
                ],
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                "columnDefs": [
                    {
                        "render": function (data, type, row) {
                            return '<input type="checkbox" name="id[]" value="' + data + '" />';
                        },
                        "targets": [0]
                    }
                ],
                'drawCallback': function (settings) {
                    $(window).trigger('resize');
                }
            }
        });

        // handle group actionsubmit button click
        storeGroupGrid.getTableWrapper().on('click', '.table-group-action', function (e) {
            e.preventDefault();
            var action = $(this);
            if (action.val() != "" && storeGroupGrid.getSelectedRowsCount() > 0) {
                storeGroupGrid.setAjaxParam("customActionType", "group_action");
                storeGroupGrid.setAjaxParam("customActionName", action.val());
                storeGroupGrid.setAjaxParam("id", storeGroupGrid.getSelectedRows());
                storeGroupGrid.getDataTable().ajax.reload(function () {
                    linkedGrid.getDataTable().ajax.reload(function () {
                        grid.getDataTable().ajax.reload();
                    });
                });
                storeGroupGrid.clearAjaxParams();
            } else if (action.val() == "unlink_all" && storeGroupGrid.getRowsCount() > 0) {
                storeGroupGrid.setAjaxParam("customActionType", "group_action");
                storeGroupGrid.setAjaxParam("customActionName", action.val());
                storeGroupGrid.setAjaxParam("id", storeGroupGrid.getAllRows());
                storeGroupGrid.getDataTable().ajax.reload(function () {
                    linkedGrid.getDataTable().ajax.reload(function () {
                        grid.getDataTable().ajax.reload();
                    });
                });
                storeGroupGrid.clearAjaxParams();
            } else if (action.val() == "") {
                toastr.error('Please select an action', 'Error');
            } else if (storeGroupGrid.getSelectedRowsCount() === 0 || storeGroupGrid.getRowsCount() === 0) {
                toastr.error('No stores available to unlink', 'Error');
            }
        });
    }

    var reloadLinkedStores = function () {
        linkedGrid.getDataTable().ajax.reload();
    }

    var reloadStores = function () {
        grid.getDataTable().ajax.reload();
    }

    var reloadStoreGroupTable = function () {
        storeGroupGrid.getDataTable().ajax.reload();
    }

    var handleRowClick = function () {
        $('#filteredStores').on('click', 'tr', function (e) {
            $(this).closest('td').find('input[type=checkbox]').prop('checked', true);
        })
    }

    return {
        init: function () {

            CampaignWizard.handleShortcuts();
            handleRecords();
            handleRowClick();
            initLinkedStores();
            initStoreGroups();
            initShortcuts();

            $('.button-next').on('click', function () {
                form.submit();
            });

            setTimeout(function () {
                $(window).trigger('resize');
            }, 200);
        },
        reloadStoreGroupTable: function () {
            reloadStoreGroupTable();
        }
    }
}();

function storeColumns() {
    return [
        {"width": "1px", "targets": 0},
        {"width": "1px", "targets": 1},
        {"width": "250px", "targets": 2},
        {"width": "15%", "targets": [3, 4]},
        {
            "render": function (data, type, row) {
                return '<input type="checkbox" name="id[]" value="' + data + '" />';
            },
            "targets": [0]
        },
        {
            "render": function (data, type, row) {
                return typeof data == 'string' ? data.substr(0, 50) : data;
            },
            "targets": [2]
        },
        {
            "render": function (data, type, row) {
                if (data && typeof window.provinces[data] !== 'undefined') {
                    return window.provinces[data];
                }
            },
            "targets": [3]
        },
        {
            "render": function (data, type, row) {
                if (data && typeof window.retailers[data] !== 'undefined') {
                    return window.retailers[data];
                } else {
                    return "";
                }
            },
            "targets": [4]
        }
    ];
}