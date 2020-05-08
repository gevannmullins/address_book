var oTable, cTable, sTable, cLoading = false, sLoading = false, tTable = [], tLoading = [];
var TableEditable = function () {

    var handleTable = function () {

        if ($.fn.makeEditable) {
            oTable = $('#reports-table').dataTable({
                "sDom": "<'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
                "sPaginationType": "full_numbers",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ records per page"
                },
                "paging": true
            }).makeEditable({
                "sUpdateURL": "",
                "aoColumns": [
                    null,
                    {},
                    {
                        type: 'select',
                        data: "{'':'Please select...', 'MULTICHANNEL': 'MULTICHANNEL','MULTI': 'MULTI', 'COLUMN': 'COLUMN','BAR':'BAR', 'BARWITHSUM':'Bar Graph with Total','LINE':'LINE','LINEWITHSUM':'LINEWITHSUM','PIE':'PIE', 'TABLE':'TABLE', 'STORE_TABLE': 'Store Table', 'CLG': 'Cumulative Line Graph'}",
                        submit: 'Save'
                    },
                    {
                        type: 'select',
                        data: "{'':'Please select...',  'PERCENTAGE':'PERCENTAGE', 'CURRENCY':'CURRENCY','INTEGER':'INTEGER','DOUBLE':'DOUBLE'}",
                        submit: 'Save'
                    },
                    {},
                    {},
                    {
                        type: 'select',
                        data: "{'':'Please select...', '1':'Yes','0':'No'}",
                        submit: 'Save'
                    },
                    {
                        type: 'select',
                        data: "{'':'Please select...', '1':'Yes','0':'No'}",
                        submit: 'Save'
                    },
                    {},
                    {
                        type: 'select',
                        data: "{'':'Please select...', '1':'Yes','0':'No'}",
                        submit: 'Save'
                    }, // autoload
                    {},
                    {},
                    {
                        type: 'select',
                        data: "{'':'Please select...', '1':'Yes','0':'No'}",
                        submit: 'Save'
                    },
                    {},
                    {}
                ]
            });
        }

        // loaded data
        var cSummaryData = []
        var cPageInfiniteScrolling = false;
        var customerPreviousHeight = 800;

        $('#customerTable').dataTable().fnDestroy();
        cTable = $('#customerTable').dataTable({
            "aaSorting": [[6, "desc"]],
            "oLanguage": {
                "sLengthMenu": "_MENU_ records per page",
                sProcessing: "Loading..."
            },
            "bServerSide": true,
            bProcessing: true,
            "pageLength": 50,
            "bDeferLoading": true,
            "bDeferRender": true,
            "ajax": {
                "url": $('#customerTable').data('url'),
                "data": function (d) {
                    var items = $('#filter-form').serializeArray();
                    var filterItems = [];
                    for (i = 0; i < items.length; i++) {
                        d[items[i].name] = items[i].value;
                    }
                },
                "dataSrc": function ( json ) {
                    if (cPageInfiniteScrolling) {
                        cSummaryData = cSummaryData.concat(json.aaData);
                    } else {
                        cSummaryData = json.aaData;
                    }
                    return cSummaryData;
                }
            },
            "paging": true,
            "pagingType": "full_numbers",
            "columns": [
                {"data": "name"},
                {"data": "surname"},
                {"data": "mobileNumber"},
                {"data": "age"},
                {"data": "trxCount"},
                {"data": "trxValue"},
                {"data": "rewardIssuedCount"},
                {"data": "rewardIssuedValue"},
                {"data": "rewardRedeemCount"},
                {"data": "rewardRedeemValue"},
                {"data": "lastTrxDate"}, // 10
                {"data": "lastRedeemDate"}
            ],

            "columnDefs": [
                {
                    "render": function (data, type, row) {
                        return (data && data.length > 15) ? data.substring(0, 15) : (data) ? data : '';
                    },
                    "targets": [0, 1]
                },
                {
                    "render": function (data, type, row) {
                        return CURRENCY + (data / 100).formatMoney(2, '.', ',')
                    },
                    "targets": [5, 7, 9]
                },
                // the fix for blank surnames
                {
                    "render": function (data, type, row) {
                        if (data) {
                            return data;
                        } else {
                            return "";
                        }
                    },
                    "targets": [6, 8]
                },
                {
                    "render": function (data, type, row) {
                        //return data;
                        if (data) {
                            return moment(data).format('Do MMMM YYYY, h:mm');
                        } else {
                            return "N/A";
                        }
                    },
                    "targets": [10, 11]
                }
            ],
            "fnCreatedRow": function (nRow, aData, iDataIndex) {
                for (var key in aData) {
                    $(nRow).attr('data-' + key, aData[key])
                }
                $(nRow).attr('onClick', 'TableEditable.showCustomer(this)').addClass('clickable');
            },
            "sDom": "<'row'<'col-md-6'f><'col-md-6'>r>t<'row'<'col-md-6'><'col-md-6'>>",
            dom: "frt",
            scrollY: 450,
            scrollX: true,
            "drawCallback": function (settings) {
                cLoading = false;
                var info = cTable.api().page.info();
                var page = info.page;

                $('#customerTable_wrapper .dataTables_scrollBody').off('scroll');
                if (cTable.fnSettings().aiDisplay.length % 50 == 0) {
                    $('#customerTable_wrapper .dataTables_scrollBody').on('scroll', function (e) {
                        if ( typeof( e.isTrigger ) !== 'undefined' ) {
                            return false;
                        }

                        // preload 300px from the bottom
                        var offset = (300 * ((page + 1) / 2));

                        if (cLoading)
                            return;

                        if ($(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight - offset)) {
                            if ($(this).is(':visible') && (cTable.fnSettings().aiDisplay.length % 50 == 0)) {
                                cPageInfiniteScrolling = true;
                                cTable.fnPageChange(page + 1);
                                cLoading = true;
                            }
                        }
                    });
                }

                cPageInfiniteScrolling = false;

                $(window).bind('resize', function () {
                    cTable.fnAdjustColumnSizing(false);
                });

                var customerScrollableHeight = jQuery('#customerTable').closest('.dataTables_scrollBody')[0];
                if ( page !== 0) {
                    customerScrollableHeight.scrollTop = (customerPreviousHeight - 300);
                    customerPreviousHeight = customerScrollableHeight.scrollHeight;
                } else {
                    customerPreviousHeight = customerScrollableHeight.scrollHeight;
                }

            },
            saveState: true
        });


        // loaded data
        var sSummaryData = [];
        var sPageInfiniteScrolling = false;
        var storePreviousHeight = 800;

        $('#storeTable').dataTable().fnDestroy();
        sTable = $('#storeTable').dataTable({
            "aaSorting": [[0, "desc"]],
            "oLanguage": {
                "sLengthMenu": "_MENU_ records per page",
                sProcessing: "Loading..."
            },
            "bServerSide": true,
            bProcessing: true,
            "pageLength": 50,
            "bDeferLoading": true,
            "bDeferRender": true,
            "ajax": {
                "url": $('#storeTable').data('url'),
                "data": function (d) {
                    var items = $('#filter-form').serializeArray();
                    var filterItems = [];
                    for (i = 0; i < items.length; i++) {
                        d[items[i].name] = items[i].value;
                    }
                },
                "dataSrc": function ( json ) {
                    if (sPageInfiniteScrolling) {
                        sSummaryData = sSummaryData.concat(json.aaData);
                    } else {
                        sSummaryData = json.aaData;
                    }
                    return sSummaryData;
                }
            },
            "paging": true,
            "pagingType": "full_numbers",
            "columns": [
                {"data": "name"},
                {"data": "retailerName"},
                {"data": "uniqCustomerCount"},
                {"data": "trxCount"},
                {"data": "trxValue"},
                {"data": "rewardIssuedCount"},
                {"data": "rewardIssuedValue"},
                {"data": "rewardRedeemCount"},
                {"data": "rewardRedeemValue"}
            ],
            "columnDefs": [
                {
                    "render": function (data, type, row) {
                        return CURRENCY + (data / 100).formatMoney(2, '.', ',')
                    },
                    "targets": [4, 6, 8]
                }
            ],
            "sDom": "<'row'<'col-md-6'><'col-md-6'f>r>t<'row'<'col-md-6'><'col-md-6'>>",
            scrollY: 450,
            scrollCollapse: true,
            "drawCallback": function (settings) {
                sLoading = false;
                var info = sTable.api().page.info();
                var page = info.page;

                $('#storeTable_wrapper').find('.dataTables_scrollBody').off('scroll');
                if (sTable.fnSettings().aiDisplay.length % 50 === 0) {
                    $('#storeTable_wrapper').find('.dataTables_scrollBody').on('scroll', function (e) {
                        if ( typeof( e.isTrigger ) !== 'undefined' ) {
                            return false;
                        }

                        // preload 300px from the bottom
                        var offset = (300 * ((page + 1) / 2));

                        if (sLoading)
                            return;

                        if ($(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight - offset)) {
                            if ($(this).is(':visible') && (sTable.fnSettings().aiDisplay.length % 50 === 0)) {
                                sPageInfiniteScrolling = true;
                                sTable.fnPageChange(page + 1);
                                sLoading = true;
                            }
                        }
                    });
                }

                sPageInfiniteScrolling = false;

                $(window).bind('resize', function () {
                    sTable.fnAdjustColumnSizing(false);
                });

                var storeScrollableHeight = jQuery('#storeTable').closest('.dataTables_scrollBody')[0];
                if ( page !== 0) {
                    storeScrollableHeight.scrollTop = (storePreviousHeight - 300);
                    storePreviousHeight = storeScrollableHeight.scrollHeight;
                } else {
                    storePreviousHeight = storeScrollableHeight.scrollHeight;
                }
            }
        });
    }


    var handleInputMasks = function()
    {
        $('.currency').inputmask({
            prefix: CURRENCY,
            groupSeparator: ",",
            alias: "numeric",
            placeholder: "0",
            autoGroup: !0,
            digits: 2,
            digitsOptional: !1,
            clearMaskOnLostFocus: !1,
            rightAlign: false
        });

    }

    return {

        //main function to initiate the module
        init: function () {
            handleTable();
        },
        // show the customer information
        showCustomer: function (row) {
            var element = $(row);

            var customerData = element.data();

            var dynamicDialog = $('<div id="customer-' + customerData.customerid + '" />');

            if ($('#' + dynamicDialog.attr('id')).length) {
                $('#' + dynamicDialog.attr('id')).dialog();
                return;
            }

            var url = BASE + "/" + customerData.customerid + "/customer";

            dynamicDialog.dialog({
                modal: true,
                width: 500,
                buttons: {},
                closeText: "Close",
                title: "Customer " + customerData.customerid + " ( " + customerData.name + " " + customerData.surname + " )",
                resizable: false,
                beforeClose: function (event, ui) {
                    $('body').removeClass('modal-open');
                }
            });

            $('body').addClass('modal-open');

            // perform the ajax request on the dialog to get the information
            Portal.rawAjaxRequest(url, customerData, '#' + dynamicDialog.attr('id'), function (response) {
                dynamicDialog.html(response.content);
                TableEditable.initTranscationTable(response.customer.customerid);
                handleInputMasks();
            });

        },

        initTranscationTable: function (customerId) {
            var cTransactionData = [];
            var cTrxPageInfiniteScrolling = false;
            var trxPreviousHeight = 800;
            // setup transaction table for customers
            $(`#transaction-${customerId}`).dataTable().fnDestroy();
            tTable[customerId] = $(`#transaction-${customerId}`).dataTable({
                "oLanguage": {
                    "sEmptyTable": "No more available data."
                },
                "aaSorting": [[3, "desc"]],
                "bServerSide": true,
                "pageLength": 50,
                "ajax": {
                    "url": $(`#transaction-${customerId}`).data('url'),
                    "data": function (d) {
                        var items = $('#filter-form').serializeArray();
                        var filterItems = [];
                        for (i = 0; i < items.length; i++) {
                            d[items[i].name] = items[i].value;
                        }
                    },
                    "dataSrc": function (json) {
                        if (cTrxPageInfiniteScrolling) {
                            cTransactionData = cTransactionData.concat(json.aaData);
                        } else {
                            cTransactionData = json.aaData;
                        }
                        return cTransactionData;
                    }
                },
                "columns": [
                    {"data": "storeName"},
                    {"data": "basketAmount"},
                    {"data": "totalBalanceEarned"},
                    {"data": "createDate"},
                    {"data": "state"}
                ],
                "columnDefs": [
                    {
                        "render": function (data, type, row) {
                            return CURRENCY + (data / 100).formatMoney(2, '.', ',')
                        },
                        "targets": [1]
                    },
                    {
                        "render": function (data, type, row) {
                            if (data) {
                                return moment(data).format('Do MMMM YYYY, H:mm');
                            } else {
                                return "N/A";
                            }
                        },
                        "targets": [3]
                    }
                ],
                "sDom": "<''<''><''>r>t<''<''><''>>",
                scrollY: 350,
                "drawCallback": function (settings) {
                    tLoading[customerId] = false;
                    $(`#transaction-${customerId}_wrapper`).find(`.dataTables_scrollBody`).off('scroll');

                    var info = tTable[customerId].api().page.info();
                    var page = info.page;

                    if (tTable[customerId].fnSettings().aiDisplay.length % 50 === 0
                        && tTable[customerId].fnSettings().aiDisplay.length > 0) {
                        $(`#transaction-${customerId}_wrapper`).find(`.dataTables_scrollBody`).on('scroll', function () {


                            var offset = (300 * ((page + 1) / 2));

                            if ($(this)[0].className !== "dataTables_scrollBody")
                                return;

                            if (tLoading[customerId])
                                return;

                            if ($(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight - offset)) {
                                if ($(this).is(':visible') && (tTable[customerId].fnSettings().aiDisplay.length % 50 === 0)) {
                                    cTrxPageInfiniteScrolling = true
                                    tTable[customerId].fnPageChange(page + 1);
                                    tLoading[customerId] = true;
                                }
                            }
                        });
                    }


                    var trxScrollableHeight = jQuery(`#transaction-${customerId}`).closest('.dataTables_scrollBody')[0];
                    if ( page !== 0) {
                        trxScrollableHeight.scrollTop = (trxPreviousHeight - 300);
                        trxPreviousHeight = trxScrollableHeight.scrollHeight;
                    } else {
                        trxPreviousHeight = trxScrollableHeight.scrollHeight;
                    }
                }
            });
        }
    };

}();

Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};