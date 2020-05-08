var Confirm = function () {

    var form = $('#campaign_signoff_form');

    var initMasks = function () {
        $(".currency").inputmask(CURRENCY + ' [9][9][9] [9][9][9] [9][9]9.99', {
            numericInput: true,
            rightAlignNumerics: false,
            greedy: false,
            placeholder: "0",
            autoUnmask: false,
            removeMaskOnSubmit: true
        });
    }

    var handleSignoff = function () {
        var message = "Are you sure you want to sign off and pass this campaign on for retail sign off?";
        $('.button-submit').on('click', function () {

            bootbox.dialog({
                message: message,
                title: "Confirmation",
                buttons: {
                    cancel: {
                        label: "Cancel",
                        className: "btn-default",
                        callback: function() {
                            return true;
                        }
                    },
                    success: {
                        label: "OK",
                        className: "btn-primary",
                        callback: function() {
                            form[0].submit();
                        }
                    }
                }
            });

        });
    }

    var handleRevoke = function () {
        $('.btn-revoke').on('click', function (e) {
            var element = $(this),
                message = "This action will remove your sign off on the campaign. Are you sure you want to continue?";

            e.preventDefault();

            bootbox.dialog({
                message: message,
                title: "Confirmation",
                buttons: {
                    cancel: {
                        label: "Cancel",
                        className: "btn-default",
                        callback: function() {
                            return true;
                        }
                    },
                    success: {
                        label: "OK",
                        className: "btn-primary",
                        callback: function() {
                            window.location = element.attr("href");
                        }
                    }
                }
            });

        });
    }

    var earningRulesTable = function () {
        $('#confirm_earning_rules').DataTable({
            "sDom": "<''<'col-md-6'><'col-md-6'>r>t<''<'col-md-6'><'col-md-6'>>"
        });
    }

    var initShortcuts = function () {

        Shortcuts.add("1",function(e) {
            $('#information_link')[0].click();
        });

        Shortcuts.add("4",function(e) {
            $('#rewards_link')[0].click();
        });

        Shortcuts.add("3",function(e) {
            $('#rules_link')[0].click();
        });

        Shortcuts.add("2",function(e) {
            $('#stores_link')[0].click();
        });
    }

    return {
        init: function () {

            handleSignoff();
            handleRevoke();

            earningRulesTable();

            Confirm.initStoresTable();
            initMasks();
            initShortcuts();
        },
        initStoresTable: function () {
            var storeTable, storeGroupTable;

            $('#store_table').dataTable().fnDestroy();
            storeTable = $('#store_table').dataTable({
                "sDom": "<'row'<'col-md-6'f><'col-md-6'l>r>t<'row'<'col-md-6'p><'col-md-6'i>>",
                "sPaginationType": "full_numbers",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ records per page"
                },
                "sAjaxSource": BASE_URL + "/stores/linked?reference=true&linked=true",
                "columns": [
                    {"data": "name"},
                    {"data": "provinceId"},
                    {"data": "storeGroupId"},
                    {"data": "retailerId"}
                ],
                "fnInitComplete": function (oSettings, json) {
                    initMasks();
                }
            });

            $('#store_groups_table').dataTable().fnDestroy();
            storeGroupTable = $('#store_groups_table').dataTable({
                "sDom": "<'row'<'col-md-6'f><'col-md-6'l>r>t<'row'<'col-md-6'p><'col-md-6'i>>",
                "sPaginationType": "full_numbers",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ records per page"
                },
                "sAjaxSource": BASE_URL + "/stores/storegroup",
                "columns": [
                    {"data": "name"},
                    {"data": "retailerId"}
                ],
                "fnInitComplete": function (oSettings, json) {
                    initMasks();
                }
            });
        }
    }
}();