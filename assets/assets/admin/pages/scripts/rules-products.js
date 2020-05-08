var items = [];
var earning = [];
var grid = null;
var groupGrid = null;
var linkedGrid = null;
var productGroups = [];

var Rules = function () {

    var form = $('#campaign_rules_form');

    var initProductValidation = function () {
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
            rules: {
                'campaign[maxRewards]': {
                    required: true,
                    digits: true
                },
                'campaign[maxCampaignCompletions]': {
                    required: true,
                    digits: true
                },
                'campaign[maxNrEarnsPerBasket]': {
                    required: true,
                    digits: true
                },
                "earingRuleContribution": {
                    required: true,
                    number: true,
                    minStrict: 0
                },
                "earningPerBasket": {
                    digits: true
                },
                "numOccurrences[]": {
                    digits: true
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
                form.submit();
                //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
            }
        });

        $('.button-next').on('click', function () {
            form.submit();
        });

        // edit of earning rule TODO don't work
        $(document).on('click', '.btn-edit-rule', function (e) {
            var $id = $(this).data('id');
            var $data = earning[$id];
            var $ids = [];
            e.preventDefault();

            Portal.blockUI({target: "body", animate: true});

            // todo fill in editing capabilities

            $.each($data.earningRuleProductGroups, function (key, value) {
                var id = $data.earningRuleProductGroups[key].productGroupId,
                    qty = $data.earningRuleProductGroups[key].numOccurrences;
                Rules.addProductGroup(id, qty, productGroups[id].name)
            })
            $('#earingRuleContribution').val($data.contribution);
            $('#earningPerBasket').val($data.basketEarningLimit);
            $('#earningRuleId').val($data.id);
            $('#btn-create').html('Update Rule');
            Portal.unblockUI("body");
        });

        $(document).on('click', '#btn-clear-product', function (e) {
            Rules.clearProduct();
        })


        $(document).off('click', '.actions .btn-create-group')
            .on('click', '.actions .btn-create-group', function(e) {
                $('html, body').animate({scrollTop: 0}, 'slow');

                $.get(productGroupsDialogUrl, function(resp) {
                    // manage products and return here
                    embeddedDialogId = '.actions .btn-create-group';

                    // Dialog body content
                    $("#ajax .modal-content").html(resp);
                    $('#ajax').modal('show');
                });
            });

        $(document).off('click', '#product_table .btn-edit')
            .on('click', '#product_table .btn-edit', function(e) {
                var selectedRow = $(this).closest('tr');
                var productsDataTable =  $("#product_table").DataTable();

                dialogProductsTableSelectedData = productsDataTable.row(selectedRow).data();

                $('.embedded-edit-product-btn').trigger('click');
            });
    }

    return {
        init: function () {

            initProductValidation();

            /* Group Editing */
            $('.btn-edit-group').off('click');
            $(document).on('click', '.btn-edit-group', function (e) {
                $('html, body').animate({scrollTop: 0}, 'slow');

                var $id = $(this).data('id');
                var $name = items[$id].name;
                var $data = {
                    'id': $id,
                    'name': $name,
                    'groupState': items[$id].state
                }
                e.preventDefault();

                // manage products and return here
                embeddedDialogId = '.btn-edit-group[data-id=' + $id + ']';

                Portal.rawAjaxRequest(productGroupsDialogUrl, $data, "#productGroup_table_wrapper", function (response) {
                    $('#ajax .modal-dialog').addClass('modal-lg');
                    $("#ajax").find(".modal-content").html(response.content);
                    $('#ajax').modal('show');
                    Rules.initProductTable(response.products);
                });
            });

            $('.btn-edit-spending').off('click');
            $(document).on('click', '.btn-edit-spending', function (e) {
                var $id = $(this).data('id');

                var $data = {
                    'id': $id,
                    'state': 'D'
                }

                Portal.rawAjaxRequest(BASE_URL + '/products/spendinginterval', $data, '#earning_rules_wrapper', function (response) {
                    Rules.initRulesTable();
                });
            });

            $('#btn-create').off('click');
            $(document).off('click', '#btn-create').on('click', '#btn-create', function (e) {
                e.preventDefault();

                var groups = [];

                $('input[name="productGroupId[]"]').each(function (index) {
                    var groupId = $('input[name="productGroupId[]"]')[index].value,
                        numOccurrences = $('input[name="numOccurrences[]"]')[index].value;

                    if (!(numOccurrences > 0)) {
                        toastr.error("Product group occurrance must be greater than zero.", "Error");
                        return false;
                    }

                    groups.push({
                        'productGroupId': groupId,
                        'numOccurrences': numOccurrences
                    })
                });

                var earingRuleContribution = parseInt($('#earingRuleContribution').val()) || 0,
                    earningPerBasket = $('#earningPerBasket').val(),
                    id = $('#earningRuleId').val();

                if (!groups.length) {
                    toastr.error("Please select a product group above.", "Error");
                    return false;
                }

                if (earingRuleContribution <= 0) {
                    toastr.error("Earned points must be greater than zero.", "Error");
                    return false;
                }

                var $data = {
                    id: id,
                    earningRuleProductGroups: groups,
                    contribution: earingRuleContribution
                };

                Portal.rawAjaxRequest(BASE_URL + '/products/earningrule', $data, '.campaignForm', function (response) {
                    // increment unsaved rules counter
                    var ruleChanges = parseInt($('input[name=_createdRulesChanges]').val());
                    $('input[name=_createdRulesChanges]').val(ruleChanges + 1)

                    Rules.initRulesTable();
                    Rules.clearProduct();
                });

            });

            $('.productGroup').off('click');
            $(document).on('click', '.productGroup', function (e) {
                e.preventDefault();

                var item = items[$(this).attr('id')],
                    productGroupTemplate = $($('#productGroupTemplate').html());

                if ($('#group-' + item.id).length) {
                    var item = $('#group-' + item.id),
                        qty = parseInt(item.find('.numOccurrences').val()) + 1;

                    item.find('.numOccurrences').val(qty);
                } else {
                    Rules.addProductGroup(item.id, 1, item.name);
                }

            });

            $('.productGroupRemove').off('click');
            $(document).on('click', '.productGroupRemove', function (e) {
                $(this).parent().parent().parent().remove();
            });

            CampaignWizard.initMasks();
            Rules.initTables();

            if (window.mode == "create") {
                $('.btn-create-group').trigger("click");
            }

        },
        initTables: function (table) {
            var oTable, earningTable, intervalTable;

            if (typeof Datatable !== 'undefined' && $.isFunction(Datatable) && table !== "rules") {
                $('#productGroup_table').dataTable().fnDestroy();
                groupGrid = new Datatable();

                groupGrid.init({
                    src: $("#productGroup_table"),
                    onSuccess: function (grid) {
                        Rules.initRulesTable();
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
                                    productGroups[row.id] = row;
                                    if (row.state != "D")
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
                                    actions = '<a data-id="' + row.id + '" class="btn btn-xs btn-primary btn-edit-group" href="javascript:void(0)">View/Edit Items</a>';
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

        },
        addProductGroup: function (id, qty, name) {
            if (!$('#group-' + id).length) {
                var productGroupTemplate = $($('#productGroupTemplate').html());
                productGroupTemplate.attr('id', 'group-' + id);
                productGroupTemplate.find('.productGroupName').html('x ' + name);
                productGroupTemplate.find('.productGroupId').val(id);
                productGroupTemplate.find('.numOccurrences').val(qty);
                $('.product-group-holder').append(productGroupTemplate);
            }
        },
        initProductGroupForm: function () {

            $('#createProductGroup').validate({
                rules: {
                    //information
                    'name': {
                        minlength: 4,
                        required: true
                    }
                },
                messages: {
                    'productIds[]': 'Please select at least one product.'
                },
                submitHandler: function (form) {
                    var url = $(form).attr('action'),
                        data = $(form).serialize();
                    Portal.rawAjaxRequest(url, data, '.modal-content', function (response) {
                        if (response.response.code == "-1") {
                            toastr.success('Product group has been created successfully.', 'Success');
                            Rules.initTables();
                            $('#ajax').modal('hide');
                            return true;
                        } else {
                            toastr.error(response.response.desc, 'Error');
                            return false;
                        }
                    });
                },
                errorPlacement: function (error, element) { // render error placement for each input type
                    if (element.attr("name") == "productIds[]") { // for uniform radio buttons, insert the after the given container
                        error.insertAfter("#product_table_wrapper");
                    } else {
                        error.insertAfter(element); // for other inputs, just perform default behavior
                    }
                }
            });
        },
        clearProduct: function () {
            $('.product-group-holder').html('');
            $('#earningRuleId').val('');
            $('#earningRuleId').attr('readonly', 'readonly');
            $('#earingRuleContribution').val('');
            $('#earningPerBasket').val('');
            $('#btn-create').html('Create Rule');
        },
        deleteRule: function (rule) {
            var $rule = $(rule);
            var $id = $rule.data('id');
            var $url = BASE_URL + '/rules/deleteproductrule';
            var $data = {
                id: $id
            }
            Portal.rawAjaxRequest($url, $data, "#earning_rules_wrapper", function (response) {
                // decrement unsaved rules counter
                var ruleChanges = parseInt($('input[name=_createdRulesChanges]').val());
                $('input[name=_createdRulesChanges]').val(ruleChanges - 1)

                Rules.initRulesTable();
            })
            return false;
        },
        initProductTable: function (products) {

            if (typeof Datatable !== 'undefined' && $.isFunction(Datatable)) {
                $('#product_table').dataTable().fnDestroy();
                grid = new Datatable();

                grid.init({
                    src: $("#product_table"),
                    onSuccess: function (grid) {
                    },
                    "dataTable": {
                        "language": {
                            "metronicGroupActions": "_TOTAL_ records selected to link  "
                        },
                        "bServerSide": false,
                        "dom": "<'row'<'col-md-7 col-sm-12'f><'col-md-5 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-md-5 col-sm-12'><'col-md-6 col-sm-12'>>",
                        "bAutoWidth": false,
                        "bStateSave": true,
                        "paging": true,
                        scrollY: 200,
                        "columns": [
                            {"data": "id"},
                            {"data": "id"},
                            {"data": "name"},
                            {"data": "skus"},
                            {"data": "id"}
                        ],
                        "columnDefs": [
                            {
                                "render": function (data, type, row) {
                                    return '<input type="checkbox" class="productId" name="productIds[]" value="' + data + '" />';
                                },
                                "targets": [0]
                            },
                            {
                                "render": function (data, type, row) {
                                    if (data)
                                        return data.join();
                                    return "";
                                },
                                "targets": [3]
                            },
                            {
                                "render": function (data, type, row) {
                                    var actions = '<a class="btn btn-sm btn-primary btn-edit" href="javascript:void(0)">Edit</a>'
                                    return actions;
                                },
                                "targets": [4]
                            }
                        ],
                        "ajax": {
                            "url": BASE_URL + "/products/data",
                            "method": "GET"
                        },
                        "createdRow": function ( row, data, index ) {
                            var found = false;
                            if (products) {
                                $.each(products.productGroupProducts, function (index) {
                                    if (products.productGroupProducts[index].productId == data.id) {
                                        found = true;
                                    }
                                });
                            }
                            if (found) {
                                grid.getDataTable().rows($(row)).remove();
                            }
                        }
                    }
                });

            }

            if (typeof Datatable !== 'undefined' && $.isFunction(Datatable) && products) {
                $('#linked_product_table').dataTable().fnDestroy();
                linkedGrid = new Datatable();

                linkedGrid.init({
                    src: $("#linked_product_table"),
                    "dataTable": {
                        "language": {
                            "metronicGroupActions": "_TOTAL_ records selected to unlink"
                        },
                        ajax: false,
                        "bServerSide": false,
                        "dom": "<'row'<'col-md-7 col-sm-12'f><'col-md-5 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-md-5 col-sm-12'><'col-md-6 col-sm-12'>>",
                        "bAutoWidth": false,
                        "data": products.productGroupProducts,
                        "bStateSave": true,
                        "paging": true,
                        scrollY: 200,
                        "columns": [
                            {"data": "product.id"},
                            {"data": "product.id"},
                            {"data": "product.name"}
                        ],
                        "columnDefs": [
                            {
                                "render": function (data, type, row) {
                                    return '<input type="checkbox" class="productId" name="unlinkIds[]" value="' + data + '" />';
                                },
                                "targets": [0]
                            }
                        ]
                    }
                });

                // handle group actionsubmit button click
                linkedGrid.getTableWrapper().on('click', '.table-group-action', function (e) {
                    e.preventDefault();
                    var action = $(this);
                    if (action.val() == "unlink" && linkedGrid.getSelectedRowsCount() > 0) {
                        var productIds = linkedGrid.getSelectedRows(),
                            url = BASE_URL + '/products/unlinkgroup',
                            state = "D",
                            data = {
                                productGroupId: $('#productGroupId').val(),
                                state: state,
                                productIds: productIds
                            };

                        Portal.rawAjaxRequest(url, data, '.modal-content', function (response) {
                            if (response.response.code == "-1") {
                                grid.getDataTable().ajax.reload();
                                toastr.success("Products have been unlinked successfully", "Success");
                            } else {
                                toastr.success(response.response.desc, "Error");
                            }
                        });

                    } else if (linkedGrid.getSelectedRowsCount() === 0 || linkedGrid.getRowsCount() === 0) {
                        toastr.error('No products available to unlink', 'Error');
                    }
                });
            }
        },
        initRulesTable: function () {
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
                    {"data": "earningRuleProductGroups"},
                    {"data": "contribution"},
                    {"data": "state"},
                    {"data": "id"}
                ],
                "columnDefs": [
                    {
                        "render": function (data, type, row) {
                            earning[row.id] = row;
                            var products = "";
                            for (index = 0; index < row.earningRuleProductGroups.length; ++index) {
                                products = products.concat(row.earningRuleProductGroups[index].numOccurrences + " x " + productGroups[row.earningRuleProductGroups[index].productGroupId].name) + " & ";
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
                                actions = actions.concat('<button data-id="' + data + '" class="btn btn-xs red btn-delete-rule" type="button" onclick="Rules.deleteRule(this); return false;">Delete Rule</button>');
                            } else {
                                actions = actions.concat('<a data-id="' + data + '" class="btn btn-xs red btn-edit-spending" href="javascript:void(0)">Deactivate</a>');
                            }
                            return actions;
                        },
                        "targets": [3]
                    }
                ]
            });
        }
    }
}();