/***
 Wrapper/Helper Class for datagrid based on jQuery Datatable Plugin
 ***/
var Datatable = function () {

    var tableOptions; // main options
    var dataTable; // datatable object
    var table; // actual table jquery object
    var tableContainer; // actual table container object
    var tableWrapper; // actual table wrapper jquery object
    var blockedTableContainer = null;  // container to blocked
    var blockedTableContainerInit = false;
    var extraDrawCallback = function(oSettings) { };
    var extraPreDrawCallback = function(oSettings) { };
    var extraTableFilters = null;
    var tableInitialized = false;
    var ajaxParams = {}; // set filter mode
    var the;

    var countSelectedRecords = function () {
        var selected = $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).size();
        var text = tableOptions.dataTable.language.metronicGroupActions;
        if (selected > 0) {
            $('.table-group-actions > span', tableWrapper).text(text.replace("_TOTAL_", selected));
        } else {
            $('.table-group-actions > span', tableWrapper).text("");
        }
    };

    return {

        //main function to initiate the module
        init: function (options) {

            if (!$().dataTable) {
                return;
            }

            the = this;

            // To show the spinner on first draw, one is expected to specify an identifier
            // string (`extraBlockedTableContainer`) that wraps the table. `drawCallback` appears
            // to be called before `dataTables_wrapper` is injected to the DOM explaining
            // why the original dev keeps checking if it's set.
            //
            if (typeof options.dataTable.extraBlockedTableContainer !== undefined) {
                blockedTableContainer = options.dataTable.extraBlockedTableContainer;
            }
            if (typeof options.dataTable.extraDrawCallback === 'function') {
                extraDrawCallback = options.dataTable.extraDrawCallback;
            }
            if (typeof options.dataTable.extraPreDrawCallback === 'function') {
                extraPreDrawCallback = options.dataTable.extraPreDrawCallback;
            }
            // This is an object of any extra filters, it expects a `filtersContainer`
            // param and a list of filter names (currently assumes input type)
            if (typeof options.dataTable.extraTableFilters === 'object') {
                extraTableFilters = options.dataTable.extraTableFilters;
                var extraFiltersBlock = $(extraTableFilters['filtersContainer']);
            }

            // For some reason, this gets called after the Ajax method is contructed
            // and made, so putting it outside so to allow calling it when required.
            var customStateSaveParams = function (settings, data) {
                if (extraTableFilters !== null) {
                    if (settings.oSavedState === null && settings.oLoadedState !== null) {
                        // mantain previously saved params on page reload/first load
                        $.each(extraTableFilters['filterNames'], function(index, filterName) {
                            data[filterName] = settings.oLoadedState[filterName];
                            // respore filter input values
                            var inputElem = extraFiltersBlock.find('[name=' + filterName +']');
                            if (inputElem.hasClass('select2me')) {
                                inputElem.attr('data-value', data[filterName]).select2('val', data[filterName]);
                            } else {
                                inputElem.val(data[filterName]).trigger('change');
                            }
                        });
                    }
                    // set extra filters
                    $.each(extraTableFilters['filterNames'], function(index, filterName) {
                        data[filterName] = extraFiltersBlock.find('[name=' + filterName +']').val();
                    });
                }
            };

            // default settings
            options = $.extend(true, {
                src: "", // actual table  
                filterApplyAction: "filter",
                filterCancelAction: "filter_cancel",
                resetGroupActionInputOnSuccess: true,
                loadingMessage: 'Loading...',
                dataTable: {
                    "dom": "<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r><'table-scrollable't><'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>", // datatable layout
                    "pageLength": -1,
                    "language": {
                        "metronicGroupActions": "_TOTAL_ records selected:  ",
                        "metronicAjaxRequestGeneralError": "Could not complete request. Please check your internet connection",

                        // data tables spesific
                        "lengthMenu": "<span class='seperator'>|</span>View _MENU_ records",
                        "info": "<span class='seperator'>|</span>Found total _TOTAL_ records",
                        "infoEmpty": "No records found",
                        "emptyTable": "No data available in table",
                        "zeroRecords": "No matching records found",
                        "paginate": {
                            "previous": "Prev",
                            "next": "Next",
                            "last": "Last",
                            "first": "First",
                            "page": "Page",
                            "pageOf": "of"
                        }
                    },

                    "orderCellsTop": true,
                    "columnDefs": [{
                        'orderable': false,
                        'targets': [0]
                    }],

                    "pagingType": "bootstrap_extended",

                    "processing": false,
                    "serverSide": true,
                    "stateSaveParams": customStateSaveParams,
                    "preDrawCallback": function(settings) {
                        extraPreDrawCallback(settings);

                        if (blockedTableContainer !== null && !tableWrapper) {
                            Portal.blockUI({
                                animate: true,
                                target: table.closest(blockedTableContainer)
                            });
                            blockedTableContainerInit = true;
                        }

                        if (extraTableFilters !== null) {
                            customStateSaveParams(settings, {});
                            // Add extra filters to the list of Ajax params
                            $.each(extraTableFilters['filterNames'], function(index, filterName) {
                                var paramBlock = paramVal = extraFiltersBlock.find('[name=' + filterName +']'),
                                    paramVal;
                                if (paramBlock.hasClass('select2me')) {
                                    paramVal = paramVal.val() || paramVal.attr('data-value');
                                } else {
                                    paramVal = paramBlock.val();
                                }

                                the.setAjaxParam(filterName,  paramVal);
                            });

                            the.setAjaxParam('columns', []);
                            the.setAjaxParam('order', []);
                            the.setAjaxParam('search', []); // table using custom filters

                            if (settings.aaSorting && settings.aaSorting[0]) {
                                var curSorting = settings.aaSorting[0];

                                if (settings.aoColumns[curSorting[0]]) {
                                    the.setAjaxParam('orderBy', settings.aoColumns[curSorting[0]].data);
                                    the.setAjaxParam('orderDirection', (curSorting[1]).toUpperCase());
                                }
                            }
                        }
                    },
                    "ajax": { // define ajax settings
                        "type": "POST", // request type
                        "timeout": 30000,
                        "data": function (data) { // add request parameters before submit
                            $.each(ajaxParams, function (key, value) {
                                data[key] = value;
                            });

                            if (tableWrapper) {
                                Portal.blockUI({
                                    animate: true,
                                    target: tableWrapper
                                });
                            }
                        },
                        "dataSrc": function (res) { // Manipulate the data returned from the server
                            if (res.customActionMessage) {
                                toastr.error(res.customActionMessage);
                            }

                            if (res.customActionStatus) {
                                if (tableOptions.resetGroupActionInputOnSuccess) {
                                    $('.table-group-action-input', tableWrapper).val("");
                                }
                            }

                            if ($('.group-checkable', table).size() === 1) {
                                $('.group-checkable', table).attr("checked", false);
                                $.uniform.update($('.group-checkable', table));
                            }

                            if (tableOptions.onSuccess) {
                                tableOptions.onSuccess.call(undefined, the);
                            }

                            Portal.unblockUI(tableWrapper);

                            return res.data;
                        },
                        "error": function () { // handle general connection errors
                            if (tableOptions.onError) {
                                tableOptions.onError.call(undefined, the);
                            }
                            toastr.error(tableOptions.dataTable.language.metronicAjaxRequestGeneralError);
                            Portal.unblockUI(tableWrapper);

                            if (blockedTableContainerInit === true) {
                                Portal.unblockUI(blockedTableContainer);
                                blockedTableContainerInit = false;
                            }
                        }
                    },

                    "drawCallback": function (oSettings) { // run some code on table redraw
                        if (tableInitialized === false) { // check if table has been initialized
                            tableInitialized = true; // set table initialized
                            table.show(); // display table
                        }
                        Portal.initUniform($('input[type="checkbox"]', table)); // reinitialize uniform checkboxes on each table reload
                        countSelectedRecords(); // reset selected records indicator

                        // callback for ajax data load
                        if (tableOptions.onDataLoad) {
                            tableOptions.onDataLoad.call(undefined, the);
                        }

                        if (blockedTableContainerInit === true) {
                            Portal.unblockUI(blockedTableContainer);
                            blockedTableContainerInit = false;
                        }
                        // custom extra drawCallback
                        extraDrawCallback(oSettings);
                    }

                }
            }, options);

            tableOptions = options;

            // create table's jquery object
            table = $(options.src);
            tableContainer = table.parents(".table-container");

            // apply the special class that used to restyle the default datatable
            var tmp = $.fn.dataTableExt.oStdClasses;

            $.fn.dataTableExt.oStdClasses.sWrapper = $.fn.dataTableExt.oStdClasses.sWrapper + " dataTables_extended_wrapper";
            $.fn.dataTableExt.oStdClasses.sFilterInput = "form-control input-small input-sm input-inline";
            $.fn.dataTableExt.oStdClasses.sLengthSelect = "form-control input-xsmall input-sm input-inline";

            // initialize a datatable
            dataTable = table.DataTable(options.dataTable);

            // revert back to default
            $.fn.dataTableExt.oStdClasses.sWrapper = tmp.sWrapper;
            $.fn.dataTableExt.oStdClasses.sFilterInput = tmp.sFilterInput;
            $.fn.dataTableExt.oStdClasses.sLengthSelect = tmp.sLengthSelect;

            // get table wrapper
            tableWrapper = table.parents('.dataTables_wrapper');

            // build table group actions panel
            if ($('.table-actions-wrapper', tableContainer).size() === 1) {
                $('.table-group-actions', tableWrapper).append($('.table-actions-wrapper', tableContainer).html()); // place the panel inside the wrapper
                $('.table-actions-wrapper', tableContainer).remove(); // remove the template container
            }
            // handle group checkboxes check/uncheck ( made a 1 to target 2nd table and not first ) (SCROLLING)
            $('.group-checkable', tableContainer).change(function () {
                var set = $('tbody > tr > td:nth-child(1) input[type="checkbox"]', table);
                var checked = $(this).is(":checked");
                $(set).each(function () {
                    $(this).attr("checked", checked);
                });
                $.uniform.update(set);
                countSelectedRecords();
            });

            // handle row's checkbox click
            table.on('change', 'tbody > tr > td:nth-child(1) input[type="checkbox"]', function () {
                countSelectedRecords();
            });

            tableContainer.on('change', '.form-filter', function (e) {
                e.preventDefault();
                the.submitFilter();
            });

        },

        // Common options used by the locked scrolling pages
        lockedScrollOptions: function() {
            return {
                "processing": false,
                "serverSide": true,
                "dom": "<'row'<'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-sm-7'p><'col-sm-5'l>>",
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
                    "emptyTable": "No matching records found.",
                    "zeroRecords": "No matching records found.",
                    "lengthMenu": "_MENU_ records per page"
                },
                "columnDefs": [
                    {
                        "targets"  : 'no-sort',
                        "orderable": false
                    }
                ],
                "createdRow": function( row, data, dataIndex ) {
                    $(row).addClass( 'clickable' );
                },
                'extraDrawCallback': function(settings) {
                    $(window).trigger('resize');
                }
            };
        },

        submitFilter: function () {
            the.setAjaxParam("action", tableOptions.filterApplyAction);

            // get all typeable inputs
            $('textarea.form-filter, select.form-filter, input.form-filter:not([type="radio"],[type="checkbox"])', document).each(function () {
                the.setAjaxParam($(this).attr("name"), $(this).val());
            });

            // get all checkboxes
            $('input.form-filter[type="checkbox"]:checked', document).each(function () {
                the.addAjaxParam($(this).attr("name"), $(this).val());
            });

            // get all radio buttons
            $('input.form-filter[type="radio"]:checked', document).each(function () {
                the.setAjaxParam($(this).attr("name"), $(this).val());
            });

            dataTable.ajax.reload();
        },

        resetFilter: function () {
            $('textarea.form-filter, select.form-filter, input.form-filter', document).each(function () {
                $(this).val("");
            });
            $('input.form-filter[type="checkbox"]', document).each(function () {
                $(this).attr("checked", false);
            });
            the.clearAjaxParams();
            the.addAjaxParam("action", tableOptions.filterCancelAction);
            dataTable.ajax.reload();
        },

        getSelectedRowsCount: function () {
            return $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).size();
        },

        getRowsCount: function () {
            return $('tbody > tr > td:nth-child(1) input[type="checkbox"]', table).size();
        },

        moveRows: function (rows, newTable) {
            $(rows).each(function () {
                $(newTable).append($(this));
            });
        },

        getSelectedRows: function () {
            var rows = [];
            $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).each(function () {
                rows.push($(this).val());
            });

            return rows;
        },

        getAllRows: function () {
            var rows = [];
            $('tbody > tr > td:nth-child(1) input[type="checkbox"]', table).each(function () {
                rows.push($(this).val());
            });

            return rows;
        },

        setAjaxParam: function (name, value) {
            ajaxParams[name] = value;
        },

        addAjaxParam: function (name, value) {
            if (!ajaxParams[name]) {
                ajaxParams[name] = [];
            }

            skip = false;
            for (var i = 0; i < (ajaxParams[name]).length; i++) { // check for duplicates
                if (ajaxParams[name][i] === value) {
                    skip = true;
                }
            }

            if (skip === false) {
                ajaxParams[name].push(value);
            }
        },

        clearAjaxParams: function (name, value) {
            ajaxParams = {};
        },

        getDataTable: function () {
            return dataTable;
        },

        getTableWrapper: function () {
            return tableWrapper;
        },

        gettableContainer: function () {
            return tableContainer;
        },

        getTable: function () {
            return table;
        }

    };

};