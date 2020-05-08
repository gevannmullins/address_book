var items = [];
var earning = [];
var spending = [];
var checked = [];
var grid = null;
var groupGrid = null;

var Rules = function () {

    var form = $('#campaign_rules_form'),
        message = '<strong>NOTE*</strong> The current earning rule will be deactivated, and a new one created if you proceed.'

    var initIntervalValidation = function () {
        CampaignWizard.initCustomValidation();

        $.validator.addMethod('ruleIsUnique', function (value, el, param) {
            console.log(param);
            var found = false,
                currentMin = $(param.min).val(),
                currentMax = value;

            spendingRules = $.grep(spending,function(n){ return(n) });

            $.each(spendingRules, function(index, value) {
                var min = value.minBasketValue,
                    max = value.maxBasketValue;

                if (currentMin <= min && currentMax >= min)
                {
                    found = true;
                    return false;
                }
                if (currentMin <= max && currentMax >= max)
                {
                    found = true;
                    return false;
                }
            });

            return !found;
        }, $.validator.format("This rule is overlapping another interval, please verify the rule and try again."));

        form.validate({
            errorElement: 'span',
            errorClass: 'help-block help-block-error',
            focusInvalid: false,
            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                    .closest('.form-group').removeClass('has-error'); // set error class to the control group
            },
            rules: {
                "input[name='earningType']": {
                    required: true
                },
                "rule[minBasketValue]": {
                    required: true,
                },
                "rule[manBasketValue]": {
                    required: true,
                    greaterThan: {
                        element: "#minBasketValue",
                        label: "Lower Boundary"
                    },
                    ruleIsUnique: {
                        min: "#minBasketValue",
                        max: "#maxBasketValue"
                    }
                },
                "rule[contribution]": {
                    required: true,
                    number: true,
                    minStrict: 0
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            },
            success: function (label) {
                label
                    .addClass('valid') // mark the current input as valid and display OK icon
                    .closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
            },
            submitHandler: function (form) {
                $('.currency').inputmask('remove');
                form.submit();
                //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
            }

        });

        $('.button-next').on('click', function () {
            form[0].submit();
        });
    }

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

    // spend value
    var initThresholdValidation = function () {
        hasRuleChanged();
        CampaignWizard.initCustomValidation();
        form.validate({
            errorElement: 'span',
            errorClass: 'help-block help-block-error',
            focusInvalid: false,
            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                    .closest('.form-group').removeClass('has-error'); // set error class to the control group
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                CampaignWizard.initMasks();
            },
            rules: {
                "rule[minBasketValue]": {
                    required: true,
                    minStrict: 0
                },
                "rule[maxBasketValue]": {
                    required: true,
                    greaterThan: {
                        element: "#minBasketValue",
                        label: "Lower Boundary"
                    }
                },
                "rule[basketEarningLimit]": {
                    required: true,
                    minStrict: 0,
                    greaterThan: {
                        element: "#minBasketValue",
                        label: "Lower Boundary"
                    }
                },
                "rule[contribution]": {
                    required: true,
                    digits: true,
                    minStrict: 0
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            },
            success: function (label) {
                label
                    .addClass('valid') // mark the current input as valid and display OK icon
                    .closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
            },
            submitHandler: function (form) {
                $('.currency').inputmask('remove');
                form.submit(function () {
                });
            }
        });
    }

    var initEverytimeValidation = function () {
        hasRuleChanged();

        CampaignWizard.initCustomValidation();
        form.validate({
            errorElement: 'span',
            errorClass: 'help-block help-block-error',
            focusInvalid: false,
            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                    .closest('.form-group').removeClass('has-error'); // set error class to the control group
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                CampaignWizard.initMasks();
            },
            rules: {
                "rule[minBasketValue]": {
                    required: true,
                    minStrict: 0
                },
                "rule[basketEarningLimit]": {
                    required: true,
                    minStrict: 0,
                    greaterThan: {
                        element: "#minBasketValue",
                        label: "Lower Boundary"
                    }
                },
                "rule[contribution]": {
                    required: true,
                    digits: true,
                    minStrict: 0
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            },
            success: function (label) {
                label
                    .addClass('valid') // mark the current input as valid and display OK icon
                    .closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
            },
            submitHandler: function (form) {
                $('.currency').inputmask('remove');
                form.submit();
            }
        });
    }

    return {
        init: function () {

            if (window.ruleType == 4) {
                initThresholdValidation();
            } else if (window.ruleType == 2) {
                initEverytimeValidation();
            } else if (window.ruleType == 3) {
                initIntervalValidation();
            }

            $('.button-next').on('click', function () {
                form.submit();
            });

            $('.btn-add').off('click');
            $(document).on('click', '.btn-add', function () {
                selectedValue = $(this).data('id')
                currentValues = $('#filter-products').val();
                currentValues.push(selectedValue);
                $('#filter-products').val(currentValues).trigger("change");
            });

            $('.btn-edit').off('click');
            $(document).on('click', '.btn-edit', function (e) {
                var $id = $(this).data('id');
                var $name = items[$id].name;
                var $data = {
                    'id': $id,
                    'name': $name
                }
                e.preventDefault();

                var $element = $('.btn-create');
                var $remote = $element.data('remote') || $element.attr('href');

                Portal.rawAjaxRequest($remote, $data, "#product_table_wrapper", function (response) {
                    $("#ajax").find(".modal-content").html(response.content);
                    $('#ajax').modal('show');
                });
            });

            $('.btn-edit-spending').off('click');
            $(document).on('click', '.btn-edit-spending', function (e) {
                var $id = $(this).data('id');

                var $data = {
                    'id': $id,
                    'state': 'D'
                }

                Portal.rawAjaxRequest(BASE_URL + '/products/spendinginterval', $data, '#spending_rules_wrapper', function (response) {
                    Rules.initTables();
                });
            });

            $(document).on('click', '#btn-clear-interval', function (e) {
                Rules.clearInterval();
            });

            // create intervals for Rand intervals you spend
            $('#btn-create-interval').off('click');
            $(document).on('click', '#btn-create-interval', function (e) {
                e.preventDefault();

                if (form.valid() == false) {
                    return false;
                }

                var $earingRuleContribution = $('#earingRuleContribution').val(),
                    $minSpend = $('#minBasketValue').val(),
                    $maxSpend = $('#maxBasketValue').val(),
                    $id = $('#earningRuleId').val(),
                    allowPercentageEarn = $('input[name="campaign[allowPercentageEarn]"]:checked').val();

                var $data = {
                    id: $id,
                    earning: '',
                    maxBasketValue: $maxSpend,
                    minBasketValue: $minSpend,
                    contribution: $earingRuleContribution,
                    campaign: {
                        allowPercentageEarn: allowPercentageEarn
                    }
                };

                Portal.rawAjaxRequest(BASE_URL + '/products/spendinginterval', $data, '.campaignForm', function (response) {
                    if (response.response.code == "-1") {
                        toastr.success("Spending rule has been created successfully.", "Success");
                        Rules.initTables();
                    } else {
                        toastr.error(response.response.desc, "Error");
                    }
                });
            });

            // lets trigger the change so that it does not do that
            $("input[name='allowMultipleEarn'], input[name='earningFrequency']").change();

            CampaignWizard.initMasks();
            Rules.initModals();
            Rules.initTables();

        },
        initModals: function () {
            $('body').on('submit', '#ajax form, .ajax-form', function (e) {
                e.preventDefault();

                $.ajax({
                    type: "POST",
                    url: $(this).attr('action'),
                    data: $(this).serialize(),
                    dataType: "json",
                    success: function (response) {

                        if (response.code === "-1") {
                            toastr.success(response.desc);
                        } else {
                            toastr.error(response.desc);
                        }
                        $("#ajax").modal("hide");
                        // It's been added
                        Rules.initTables();
                    },
                    error: function () {
                        //alert('Error')
                    }
                });
            });
        },
        initTables: function (table) {
            var oTable, earningTable, intervalTable;

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
                            return '<div data-item="' + type + '" data-id="' + row.id + '" class="currency" contenteditable="true">' + data + '</div>';
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

            if (typeof Datatable !== 'undefined' && $.isFunction(Datatable) && table !== "rules") {
                $('#productGroup_table').dataTable().fnDestroy();
                groupGrid = new Datatable();

                groupGrid.init({
                    src: $("#productGroup_table"),
                    onSuccess: function (grid) {
                    },
                    "dataTable": {
                        "bServerSide": false,
                        "dom": "<'row'<'col-md-8 col-sm-12'f><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-md-8 col-sm-12'><'col-md-4 col-sm-12'>>",
                        "bAutoWidth": false,
                        "bStateSave": true,
                        "paging": true,
                        scrollY: 200,
                        "columns": [
                            {"data": "id"},
                            {"data": "id"},
                            {"data": "name"},
                            {"data": "state"},
                            {"data": "id"}
                        ],
                        "columnDefs": [
                            {
                                "render": function (data, type, row) {
                                    return '<button type="button" class="productGroup btn btn-xs btn-default" name="id[]" id="' + data + '"><i class="fa fa-plus"></i></button>';
                                },
                                "targets": [0]
                            },
                            {
                                "render": function (data, type, row) {
                                    return states[data];
                                },
                                "targets": [3]

                            },
                            {
                                "render": function (data, type, row) {
                                    items[row.id] = row;
                                    actions = '<a data-id="' + row.id + '" class="btn btn-xs btn-primary btn-edit-group" href="javascript:void(0)">View Items</a>';
                                    actions = actions.concat('<a data-id="' + data + '" class="btn btn-xs btn-default btn-edit-group" href="javascript:void(0)">Edit</a>');
                                    return actions;
                                },
                                "targets": [4]
                            }
                        ],
                        "ajax": {
                            "url": BASE_URL + "/products/group",
                            "method": "GET"
                        }
                    }
                });

            }


            $('.earning_table').each(function () {
                $(this).dataTable().fnDestroy();
            });

            earningTable = $('.earning_table').dataTable({
                "sDom": "<'row'<'col-md-6'f><'col-md-6'l>r>t<'row'<'col-md-6'p><'col-md-6'i>>",
                "sPaginationType": "full_numbers",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ records per page"
                },
                "sAjaxSource": BASE_URL + "/products/earningrules",
                "columns": [
                    {"data": "productGroups"},
                    {"data": "contribution"},
                    {"data": "basketEarningLimit"},
                    {"data": "id"}
                ],
                "columnDefs": [
                    {
                        "render": function (data, type, row) {
                            earning[row.id] = row;
                            var products = "";
                            for (index = 0; index < row.productGroups.length; ++index) {
                                for (sub_index = 0; sub_index < row.productGroups[index].products.length; ++sub_index) {
                                    products = products.concat(row.productGroups[index].products[sub_index].name) + " & ";
                                }
                            }
                            return products.substring(0, (products.length - 3));
                        },
                        "targets": [0]
                    },
                    {
                        "render": function (data, type, row) {
                            var actions = "";
                            if (row.fake) {
                                actions = actions.concat('<a data-id="' + data + '" class="btn btn-xs btn-default btn-edit-rule" href="javascript:void(0)">Edit Rule</a>');
                                actions = actions.concat('<button data-id="' + data + '" class="btn btn-xs btn-warning btn-delete-rule" type="button" onclick="Rules.deleteRule(this); return false;">Delete Rule</button>');
                            } else {

                            }
                            return actions;
                        },
                        "targets": [3]
                    }
                ]
            });
        },
        clearInterval: function () {
            $('#earningRuleId').val('');
            $('#earningRuleId').attr('readonly', 'readonly');
            $('#minBasketValue').val('');
            $('#maxBasketValue').val('');
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
                Rules.initTables("rules");
            })
            return false;
        }

    }
}();