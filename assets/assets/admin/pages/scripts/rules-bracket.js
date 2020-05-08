
var RulesBracket = function () { // 3

    var earningForm = $('#earning_rule_form'),
        message = '<strong>NOTE*</strong> The current earning rule will be deactivated, and a new one created if you proceed.'

    var hasRuleChanged = function () {
        var appeared = false;
        $(':input').change(function () {
            if (!appeared && $('input[name="rule[id]"]').length) {
                Portal.alert({
                    'message': message,
                    'type': 'warning',
                    'focus': false
                });
                appeared = true;
            }
        });
    }

    return {
        init: function () {

            $('.btn-edit-spending').off('click');
            $(document).on('click', '.btn-edit-spending', function (e) {
                var $id = $(this).data('id');

                var $data = {
                    'id': $id,
                    'state': 'D'
                }

                Portal.rawAjaxRequest(BASE_URL + '/products/spendinginterval', $data, '#spending_rules_wrapper', function (response) {
                    RulesBracket.initTables();
                });
            });

            $(document).on('click', '#btn-clear-interval', function (e) {
                RulesBracket.clearInterval();
            });

            // create intervals for Rand intervals you spend
            $('#btn-create-interval').off('click');
            $(document).on('click', '#btn-create-interval', function (e) {
                e.preventDefault();

                if (earningForm.valid() == false) {
                    return false;
                }

                var $earingRuleContribution = $('#earingRuleContribution').val(),
                    $minSpend = $('#minBasketValue').val(),
                    $maxSpend = $('#maxBasketValue').val(),
                    $id = $('#earningRuleId').val();

                var $data = {
                    id: $id,
                    earning: '',
                    maxBasketValue: $maxSpend,
                    minBasketValue: $minSpend,
                    contribution: $earingRuleContribution
                };

                Portal.rawAjaxRequest(BASE_URL + '/products/spendinginterval', $data, '#rules_accordion', function (response) {
                    if (response.response.code == "-1") {
                        toastr.success("Spending rule has been created successfully.", "Success");
                        RulesBracket.initTables();
                    } else {
                        toastr.error(response.response.desc, "Error");
                    }
                });
            });


            CampaignWizard.initMasks();
            RulesBracket.initTables();

        },
        initTables: function (table) {
            var intervalTable;

            spending = [];

            $('#spending_rules').dataTable().fnDestroy();
            intervalTable = $('#spending_rules').dataTable({
                "sDom": "<'row'<'col-md-6'f><'col-md-6'l>r>t<'row'<'col-md-6'p><'col-md-6'i>>",
                "sPaginationType": "full_numbers",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ records per page"
                },
                "sAjaxSource": BASE_URL + "/products/earningrules",
                "columns": [
                    {"data": "minBasketValue"},
                    {"data": "maxBasketValue"},
                    {"data": "contribution"},
                    {"data": "id"}
                ],
                "columnDefs": [
                    {
                        "render": function (data, type, row) {
                            spending[row.id] = row;
                            return '<div data-item="' + type + '" data-id="' + row.id + '" class="currency">' + data + '</div>';
                        },
                        targets: [0, 1]
                    },
                    {
                        "render": function (data, type, row) {
                            var actions = "";

                            actions = actions.concat('<a data-id="' + data + '" class="btn btn-xs btn-default btn-edit-spending" href="javascript:void(0)">Deactivate</a>');
                            return actions;
                        },
                        "targets": [3]
                    }
                ],
                "fnInitComplete": function (oSettings, json) {
                    CampaignWizard.initMasks();
                }
            });
        },
        clearInterval: function () {
            $('#earningRuleId').val('');
            $('#earningRuleId').attr('readonly', 'readonly');
            $('#minBasketValue').val('');
            $('#maxBasketValue').val('');
            $('#earingRuleContribution').val('');
            $('#btn-create-interval').html('Create Interval');
        },
        deleteRule: function (rule) {
            var $rule = $(rule);
            var $id = $rule.data('id');
            var $url = BASE_URL + '/rules/deleteproductrule';
            var $data = {
                id: $id
            }
            Portal.rawAjaxRequest($url, $data, "#earning_rules_wrapper", function (response) {
                RulesBracket.initTables("rules");
            })
            return false;
        }

    }
}();