var items = [];
var earning = [];
var spending = [];
var checked = [];
var grid = null;
var productsEmbeddedView = false;
var embeddedDialogId = null;
var dialogProductsTableSelectedData = null;

var PortalProducts = function () {
    var _toastrOptions = toastr.options;
    _toastrOptions["showDuration"] = "2000";
    toastr.options = _toastrOptions;

    $(window).resize(Portal.globalHandleOverflowColumns);

    return {
        initMasks() {
            $(".currency").inputmask(CURRENCY + ' [9][9][9] [9][9][9] [9][9]9.99', {
                numericInput: true,
                rightAlignNumerics: false,
                greedy: false,
                placeholder: "0",
                autoUnmask: false,
                removeMaskOnSubmit: true
            });
        },
        init: function () {

            portalProductsGrid = new Datatable();
            portalProductsGrid.init({
                "src": $("#portal_products_table"),
                loadingMessage: 'Loading...',
                "dataTable": {
                    "processing": false,
                    "serverSide": true,
                    "dom": "<'row'<'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-sm-8'p><'col-sm-4'l>>",
                    "lengthMenu": [10, 20, 50, 75, 100, 250],
                    "scrollY": "20px",
                    "pageLength": 20,
                    "stateSave": true,
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
                        "emptyTable": "No products found.",
                        "lengthMenu": "_MENU_ records per page"
                    },
                    "columns": [
                        {"data": "id"},
                        {"data": "name"},
                        {"data": "state"},
                        {"data": "id"}
                    ],
                    "columnDefs": [
                        {
                            "render": function (data, type, row) {
                                if (data == 'A') {
                                    return '<span>Active</span>'
                                } else {
                                    return '<span class="deactivated">Deactivated</span>'
                                }
                            },
                            "targets": [2]
                        },
                        {
                            "render": function (data, type, row) {
                                var actions = "",
                                    buttonLabel = 'Edit';
                                if (userIsAdmin) {
                                    buttonLabel = 'View';
                                }

                                actions = actions.concat('<a data-id="' + data + '" class="btn btn-sm btn-primary btn-edit" href="javascript:void(0)">' + buttonLabel + '</a>');
                                return actions;
                            },
                            "targets": [3]
                        },
                        {
                            "targets": 'no-sort',
                            "orderable": false
                        }
                    ],
                    "ajax": {
                        "url": BASE_URL + "/product/data",
                        "method": "GET"
                    },
                    "createdRow": function (row, data, dataIndex) {
                        $(row).addClass('clickable');
                        Shortcuts.addModalShortcut(data, function (e) {
                            $('a[data-id="' + data.id + '"]').click();
                        });
                    },
                    "extraBlockedTableContainer": 'div.table-container',
                    "extraTableFilters": {
                        "filtersContainer": 'form#products-filter-form',
                        "filterNames": ['sku', 'name']
                    },
                    'extraDrawCallback': function (settings) {
                        $(window).trigger('resize');
                    }
                }
            });

            // Show add and edit SKUs modal
            var showingModal = false;
            var skusButton = '.btn.portal-products-create, div#portal-products .btn-edit, .embedded-edit-product-btn';

            function populateProductModal(modalObject) {
                if (showingModal) {
                    return false;
                }
                showingModal = true;

                // Start spinner
                modalObject.find('.spinner-container > div').removeClass('hidden');

                // Edit existing product / add new / delete skus

                var selectedData = dialogProductsTableSelectedData;

                // Loading skus, no submit
                modalObject.find('button').addClass('disabled');
                modalObject.find('input, textarea').attr('disabled', 'disabled');

                modalObject.find('input[name=productId]').attr('value', selectedData['id'])
                if (userIsAdmin) {
                    modalObject.find('div.product-name').html(selectedData['name']);
                } else {
                    modalObject.find('input[name=productName]').attr('value', selectedData['name'])
                }

                // Load SKUs
                $.get(BASE_URL + '/product/' + selectedData['id'] + '/skus', function (data) {
                    showingModal = false;
                    $.each(data['data'], function (index, value) {
                        if ($('div#portal-products-modal input[name=productId]').val() != selectedData['id']) {
                            // Request delayed / now focused on another product's SKUs
                            return false;
                        }
                        var skuRow = $(modalObject.find('script.product-sku-template').html());
                        if (userIsAdmin) {
                            skuRow.find('td:first-child').html(value['description']);
                            skuRow.find('td:nth-child(2)').html(value['sku']);
                            if (value['state'] == 'A') {
                                skuRow.find('td:nth-child(3)').html('<span>Active</span>');
                            } else {
                                skuRow.find('td:nth-child(3)').html(
                                    '<span class="deactivated">Deactivated</span>');
                            }
                        } else {
                            skuRow.find('input[name=skuId]').attr('value', value['id']);
                            skuRow.find('input[name=description]').attr('value', value['description']);
                            skuRow.find('input[name=sku]').attr('value', value['sku']).attr('disabled', 'disabled');
                            if (value['state'] == 'A') {
                                skuRow.find('td:nth-child(3)').html(
                                    '<input type="checkbox" name="state" checked />');
                            } else {
                                skuRow.find('td:nth-child(3)').html('<input type="checkbox" name="state" />');
                            }
                        }
                        $('div#portal-products-modal tbody#productRows')
                            .prepend(skuRow.find('tr').parent().html());
                    });
                    // Done loading
                    $('div#portal-products-modal button').removeClass('disabled');
                    $('div#portal-products-modal input:not([name=sku]), div#portal-products-modal textarea').removeAttr('disabled');
                    $('div#portal-products-modal .spinner-container > div').addClass('hidden');

                    $(window).trigger('resize');
                }, 'json');

                $("#ajax .modal-content").html(modalObject.html());
                $("#ajax .modal-content").find('h4.modal-title').html('Edit Product - ' + selectedData['id']);
                $('#ajax').modal('show');
            }

            $(document).off('click', skusButton).on('click', skusButton, function (e) {
                var skuRow,
                    modalObject = $($("script#manage-product-modal").html());

                if ($(this).hasClass('btn-edit')) {

                    var selectedRow = $(this).closest('tr');
                    var productsDataTable = $("#portal_products_table").DataTable();
                    dialogProductsTableSelectedData = productsDataTable.row(selectedRow).data();

                    populateProductModal(modalObject);
                } else if ($(this).hasClass('embedded-edit-product-btn')) {

                    populateProductModal(modalObject);
                } else {
                    modalObject.find('tbody#productRows').prepend(
                        $(modalObject.find('script.product-sku-template').html()).find('tr').parent().html()
                    );

                    $("#ajax .modal-content").html(modalObject.html());
                    $("#ajax .modal-content").find('h4.modal-title').html('Create Product');
                    $('#ajax').modal('show');
                }

                setTimeout(function () {
                    $(window).trigger('resize');
                }, 200);
            });

            $(document).off('click', 'table#portal_products_table tr.clickable')
                .on('click', 'table#portal_products_table tr.clickable', function (event) {
                    if (event.target.tagName.toUpperCase() == "A") {
                        return false;
                    }
                    var selectedRow = $(this),
                        modalObject = $($("script#manage-product-modal").html());

                    var productsDataTable = $("#portal_products_table").DataTable();
                    dialogProductsTableSelectedData = productsDataTable.row(selectedRow).data();

                    populateProductModal(modalObject);
                });

            var skusCloseButton = 'div#portal-products-modal button.close-dialog';
            $(document).off('click', skusCloseButton).on('click', skusCloseButton, function (e) {
                if (productsEmbeddedView && embeddedDialogId) {
                    $(embeddedDialogId).trigger('click');
                } else {
                    $('#ajax').modal('hide');
                }
            });


            var skusSaveButton = 'div#portal-products-modal button.save-changes';
            $(document).off('click', skusSaveButton).on('click', skusSaveButton, function (e) {
                $('div#portal-products-modal span.help-block-error').remove();
                $('div#portal-products-modal .has-error').removeClass('has-error');

                var rowData,
                    data = {'skus': []};
                var modalObject = $('div#portal-products-modal');

                if (modalObject.find('input[name=productId]').val()) {
                    data['productId'] = modalObject.find('input[name=productId]').val();
                }
                data['name'] = modalObject.find('input[name=productName]').val();
                data['deletedSkus'] = modalObject.find('input[name=deletedSkus]').val();

                if (!data['name']) {
                    modalObject.find('input[name=productName]').closest('.form-group').addClass('has-error');
                    modalObject.find('input[name=productName]').after(
                        '<span id="name-error" class="help-block help-block-error">This field is required.</span>'
                    );
                    // Validation failed
                    return false;
                }

                // Saving product, no double submit
                modalObject.find('button').addClass('disabled');
                modalObject.find('input, textarea').attr('disabled', true);
                modalObject.find('.spinner-container > div').removeClass('hidden');

                var projectSkus = modalObject.find('tbody#productRows tr');
                $.each(projectSkus, function (index, row) {
                    row = $(row);
                    if (!row.find('input[name=description]').val() || !row.find('input[name=description]').val()) {
                        // invalid row delete
                        return;
                    }
                    rowData = {
                        'description': row.find('input[name=description]').val(),
                        'sku': row.find('input[name=sku]').val()
                    }
                    if (row.find('input[name=skuId]').val()) {
                        rowData['skuId'] = row.find('input[name=skuId]').val();
                        rowData['state'] = (row.find('input[name=state]').is(':checked') ? 'A' : 'D');
                    }
                    data['skus'].push(rowData);
                });

                $.post(BASE_URL + '/product/updateSkus', data, function (resp) {
                    // Done
                    $('div#portal-products-modal button').removeClass('disabled');
                    $('div#portal-products-modal input, div#portal-products-modal textarea').removeAttr('disabled');
                    $('div#portal-products-modal .spinner-container > div').addClass('hidden');

                    if (resp['code'] == '-1') {
                        if (data['productId']) {
                            toastr.success('Updated product', 'Success');
                        } else {
                            toastr.success('Created product', 'Success');
                        }

                        $('#portal-products .pagination li.active a').trigger('click');
                    } else {
                        toastr.error(resp['desc'], 'Error');
                    }
                    if (productsEmbeddedView && embeddedDialogId) {
                        $(embeddedDialogId).trigger('click');
                    } else {
                        $('#ajax').modal('toggle');
                    }
                }, 'json');

                return false;
            });

            // Add new product SKU
            $(document).on('click', 'div#portal-products-modal .btn.add-product', function (e) {

                var modalObject = $('div#portal-products-modal'),
                    skuTemplate = $(modalObject.find('script.product-sku-template').html()).find('tr').parent();
                //
                modalObject.find('tbody#productRows').prepend(skuTemplate.html());
                $(window).trigger('resize');
            });

            // Delete product SKU
            $(document).on('click', 'div#portal-products-modal .btn-delete', function (e) {
                var deletedSkuId = $(this).closest('tr').find('input[name=skuId]').val();
                if (deletedSkuId) {
                    var deletedSkusObject = $('div#portal-products-modal input[name=deletedSkus]');
                    deletedSkusObject.attr('value', (deletedSkusObject.val() + ',' + deletedSkuId))
                }
                $(this).closest('tr').remove();
                $(window).trigger('resize');
            });

            // Trigger table filtering, works by re-drawing
            $(document).on('submit', 'form#products-filter-form', function (e) {
                $("#portal_products_table").DataTable().draw();
                return false;
            });
        },
        getfilterProducts: function () {
            portalFilterProductsGrid = new Datatable();
            portalFilterProductsGrid.init({
                "src": $("#portal_products_table"),
                loadingMessage: 'Loading...',
                "dataTable": {
                    "processing": false,
                    "serverSide": true,
                    "dom": "<'row'<'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-sm-8'p><'col-sm-4'l>>",
                    "lengthMenu": [10, 20, 50, 75, 100, 250],
                    "scrolly": "20px",
                    "pageLength": 10,
                    "stateSave": true,
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
                        "emptyTable": "No products found.",
                        "lengthMenu": "_MENU_ records per page"
                    },
                    "columns": [
                        {"data": "id"},
                        {"data": "retailerId"},
                        {"data": "skuRegexId"},
                        {"data": "sku"},
                        {"data": "description"},
                        {
                            "data": "value", render: function (data) {
                                return (data) ? (data / 100).toFixed(2) : '0.00';
                            },
                        },
                        {"data": "allowEarn"},
                        {"data": "state"},

                    ],
                    "columnDefs": [
                        {
                        "render": function (data, type, row) {
                            return data + ' ' + retailers[data];
                        },
                            "targets":[1]
                        },
                        {
                            "render": function (data, type, row) {
                                if (data == 1) {
                                    return '<span>Equals</span>'
                                } else {
                                    return '<span>Start with</span>'
                                }
                            },
                            "targets": [2]
                        },
                        {
                            "render": function (data, type, row) {
                                if (data == 'A') {
                                    return '<span class="active">Active</span>'
                                } else {
                                    return '<span class="deactivated">Deactivated</span>'
                                }
                            },
                            "targets": [7]
                        },
                        {
                            "render": function (data, type, row) {
                                if (data === true) {
                                    return '<span>Include</span>'
                                }
                                if (data === false) {
                                    return '<span>Exclude</span>'
                                }
                            },
                            "targets": [6]
                        },
                        {
                            "render": function (data, type, row) {
                                var actions = "",
                                    actions = actions.concat('<a data-id="' + data + '" class="btn btn-sm btn-primary btn-edit" href="javascript:void(0)">Edit</a>');
                                return actions;
                            },
                            "targets": [8]
                        },
                        {
                            "targets": 'no-sort',
                            "orderable": false
                        }
                    ],
                    "ajax": {
                        "url": BASE_URL + "/product/skus?allowEarn=true",
                        "method": "GET"
                    },
                    "createdRow": function (row, data, dataIndex) {
                        $(row).addClass('clickable');
                        Shortcuts.addModalShortcut(data, function (e) {
                            $('a[data-id="' + data.id + '"]').click();
                        });
                    },
                    "extraBlockedTableContainer": 'div.table-container',
                    "extraTableFilters": {
                        "filtersContainer": 'form#products-filter-form',
                        "filterNames": ['state','sku','retailerId']
                    },
                    'extraDrawCallback': function (settings) {
                        $(window).trigger('resize');
                    }
                }
            });
            portalFilterProductsGridExclude = new Datatable();
            portalFilterProductsGridExclude.init({
                "src": $("#portal_products_table_Exclude"),
                loadingMessage: 'Loading...',
                "dataTable": {
                    "processing": false,
                    "serverSide": true,
                    "dom": "<'row'<'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-sm-8'p><'col-sm-4'l>>",
                    "lengthMenu": [10, 20, 50, 75, 100, 250],
                    "scrolly": "20px ",
                    "pageLength": 10,
                    "stateSave": true,
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
                        "emptyTable": "No products found.",
                        "lengthMenu": "_MENU_ records per page"
                    },
                    "columns": [
                        {"data": "id"},
                        {"data": "retailerId"},
                        {"data": "skuRegexId"},
                        {"data": "sku"},
                        {"data": "description"},
                        {
                            "data": "value", render: function (data) {
                                return (data) ? (data / 100).toFixed(2) : '0.00';
                            },
                        },
                        {"data": "allowEarn"},
                        {"data": "state"},

                    ],
                    "columnDefs": [
                        {
                            "render": function (data, type, row) {
                                return data + ' ' + retailers[data];
                            },
                            "targets": [1]
                        },
                        {
                            "render": function (data, type, row) {
                                if (data == 1) {
                                    return '<span>Equals</span>'
                                } else {
                                    return '<span>Start with</span>'
                                }
                            },
                            "targets": [2]
                        },
                        {
                            "render": function (data, type, row) {
                                if (data == 'A') {
                                    return '<span class="active">Active</span>'
                                } else {
                                    return '<span class="deactivated">Deactivated</span>'
                                }
                            },
                            "targets": [7]
                        },
                        {
                            "render": function (data, type, row) {
                                if (data === true) {
                                    return '<span>Include</span>'
                                }
                                if (data === false) {
                                    return '<span>Exclude</span>'
                                }
                            },
                            "targets": [6]
                        },
                        {
                            "render": function (data, type, row) {
                                var actions = "",
                                    actions = actions.concat('<a data-id="' + data + '" class="btn btn-sm btn-primary btn-edit" href="javascript:void(0)">Edit</a>');
                                return actions;
                            },
                            "targets": [8]
                        },
                        {
                            "targets": 'no-sort',
                            "orderable": false
                        }
                    ],
                    "ajax": {
                        "url": BASE_URL + "/product/skus?allowEarn=false",
                        "method": "GET"
                    },
                    "createdRow": function (row, data, dataIndex) {
                        $(row).addClass('clickable');
                        Shortcuts.addModalShortcut(data, function (e) {
                            $('a[data-id="' + data.id + '"]').click();
                        });
                    },
                    "extraBlockedTableContainer": 'div.table-container-Exclude',
                    "extraTableFilters": {
                        "filtersContainer": 'form#products-filter-form-exclude',
                        "filterNames": ['state','sku','retailerId']
                    },
                    'extraDrawCallback': function (settings) {
                        $(window).trigger('resize');
                    }
                }
            });
            // show modal on add product
            var showingModal = false;
            var productsCreateButton = '.btn.portal-products-filter-create';
            var productsEditButton = '.btn.btn-edit';
            $(document).off('click', productsCreateButton).on('click', productsCreateButton, function (e) {
                showingModal = false;
                var skuRow,
                    modalObject = $($("script#create-filter-product-modal").html());

                if ($(this).hasClass('btn-create')) {
                    var selectedRow = $(this).closest('tr');
                    var productsDataTable = $("#portal_products_table").DataTable();
                    dialogProductsTableSelectedData = productsDataTable.row(selectedRow).data();

                    populateProductModal(modalObject);
                } else if ($(this).hasClass('embedded-edit-product-btn')) {
                    populateProductModal(modalObject);
                } else {
                    modalObject.find('tbody#productRows').prepend(
                        $(modalObject.find('script.product-filter-template').html()).find('tr').parent().html()
                    );

                    $("#ajax .modal-content").html(modalObject.html());
                    $("#ajax .modal-content").find('h4.modal-title').html('Add Product Filtering Rule');
                    $('#ajax').modal('show');

                    $("#ajax").on('shown.bs.modal', function () {
                        PortalProducts.initMasks();
                    });
                }
                setTimeout(function () {
                    $(window).trigger('resize');
                }, 200);
            });

            // show modal on edit product
            $(document).off('click', productsEditButton).on('click', productsEditButton, function (e) {
                showingModal = false;
                var skuRow,
                    modalObject = $($("script#manage-filter-product-modal").html());

                skuRow = $(modalObject.find('script.product-filter-template').html());

                //load selected row details
                var selectedRow = $(this).closest('tr');
                var productsDataTable = $("#portal_products_table").DataTable();
                var productsDataTableExclude = $("#portal_products_table_Exclude").DataTable();
                dialogProductsTableSelectedData = productsDataTable.row(selectedRow).data();
                dialogProductsTableSelectedDataEx = productsDataTableExclude.row(selectedRow).data();

                // Edit existing product load
                var selectedData = dialogProductsTableSelectedData;
                if(!selectedData){
                    selectedData = dialogProductsTableSelectedDataEx;
                }
                var $skuRegexid = null;
                // Loading product

                //modalObject.find('input, textarea').attr('disabled', 'disabled');
                modalObject.find('input[name=productId]').attr('value', selectedData['id']);

                if (selectedData['skuRegexId'] == 1) {
                    $skuRegexid = 'Equals';
                } else {
                    $skuRegexid = 'Starts with';
                }
                skuRow.find('input[name=skuRegexId]').attr('value', $skuRegexid);
                skuRow.find('input[name=description]').attr('value', selectedData['description']);
                skuRow.find('input[name=sku]').attr('value', selectedData['sku']);
                skuRow.find('input[name=retailerId]').attr('value', selectedData['retailerId']);
                skuRow.find('input[name=value]').attr('value', selectedData['value']);
                skuRow.find('select[name=state]').attr('state', selectedData['state']);
                skuRow.find('select[name=allowEarn]').attr('allowEarn', selectedData['allowEarn']);
                skuRow.find('input[name=description]').addClass('disabled');

                modalObject.find('tbody#productRows').prepend(
                    $(skuRow.html()).find('tr').parent().html())

                $("#ajax .modal-content").html(modalObject.html());
                $("#ajax .modal-content").find('h4.modal-title').html('Edit Product - ' + selectedData['id']);
                $('#ajax').modal('show');

                $("#ajax").on('shown.bs.modal', function () {
                    PortalProducts.initMasks();
                    if(selectedData['state'] === 'A'){
                        $("#selectedState").val(selectedData['state']);
                        $("#selectedState").text("Active");
                    }else{
                        $("#selectedState").val(selectedData['state']);
                        $("#selectedState").text("Deactivate");
                    }
                    if(selectedData['allowEarn'] === true){
                        $("#selectedallowEarn").val(selectedData['allowEarn']);
                        $("#selectedallowEarn").text("Include");
                    }else{
                        $("#selectedallowEarn").val(selectedData['allowEarn']);
                        $("#selectedallowEarn").text("Exclude");
                    }

                });

                setTimeout(function () {
                    $(window).trigger('resize');
                }, 200);
            });

            // close modal on add/edit product
            var skusCloseButton = 'div#portal-products-modal button.close-dialog';
            $(document).off('click', skusCloseButton).on('click', skusCloseButton, function (e) {
                $('#ajax').modal('hide');
            });

            // Add new edited product
            var skusSaveButton = 'div#portal-products-modal button.save-changes';
            $(document).off('click', skusSaveButton).on('click', skusSaveButton, function (e) {
                $('div#portal-products-modal span.help-block-error').remove();
                $('div#portal-products-modal .has-error').removeClass('has-error');
                var modalObject = $('div#portal-products-modal');
                var rowData,
                    data = {
                        'skuRegexId': modalObject.find('select[name=skuRegexId]').val(),
                        'description': modalObject.find('input[name=description]').val(),
                        'sku': modalObject.find('input[name=sku]').val(),
                        'retailerId': modalObject.find('select[name=retailerId]').val(),
                        'value': modalObject.find('input[name=value]').val(),
                        'allowEarn': modalObject.find('select[name=allowEarn]').val(),
                        'state': modalObject.find('select[name=state]').val()
                    };

                // Saving product, no double submit
                modalObject.find('button').addClass('disabled');
                modalObject.find('input, textarea').attr('disabled', true);
                modalObject.find('.spinner-container > div').removeClass('hidden');

                $.post(BASE_URL + '/product/addProduct', data, function (resp) {
                    // Done
                    $('div#portal-products-modal button').removeClass('disabled');
                    $('div#portal-products-modal input, div#portal-products-modal textarea').removeAttr('disabled');
                    $('div#portal-products-modal .spinner-container > div').addClass('hidden');

                    if (resp['code'] == '-1') {
                        toastr.success('Product added successfully.', 'Success');
                        $('#portal-products .pagination li.active a').trigger('click');
                        $('#portal-products-Exclude .pagination li.active a').trigger('click');
                    } else {
                        toastr.error(resp['desc'], 'Error');
                    }
                    if (productsEmbeddedView && embeddedDialogId) {
                        $(embeddedDialogId).trigger('click');
                    } else {
                        $('#ajax').modal('toggle');
                    }
                }, 'json');

                return false;
            });

            //save edited product
            var skusEditButton = 'div#portal-products-modal button.edit-changes';
            $(document).off('click', skusEditButton).on('click', skusEditButton, function (e) {
                $('div#portal-products-modal span.help-block-error').remove();
                $('div#portal-products-modal .has-error').removeClass('has-error');
                var modalObject = $('div#portal-products-modal');
                var $skuRegexid = null;
                if (modalObject.find('input[name=skuRegexId]').val() === 'Equals') {
                    $skuRegexid = 1;
                } else {
                    $skuRegexid = 2;
                }

                var rowData,
                    data = {
                        'id': modalObject.find('input[name=productId]').val(),
                        'skuRegexId': $skuRegexid,
                        'description': modalObject.find('input[name=description]').val(),
                        'sku': modalObject.find('input[name=sku]').val(),
                        'retailerId': modalObject.find('input[name=retailerId]').val(),
                        'value': modalObject.find('input[name=value]').val(),
                        'allowEarn': modalObject.find('select[name=allowEarn]').val(),
                        'state': modalObject.find('select[name=state]').val()
                    };

                // Saving product, no double submit
                modalObject.find('button').addClass('disabled');
                modalObject.find('input, textarea').attr('disabled', true);
                modalObject.find('.spinner-container > div').removeClass('hidden');

                $.post(BASE_URL + '/product/editProduct', data, function (resp) {
                    // Done
                    $('div#portal-products-modal button').removeClass('disabled');
                    $('div#portal-products-modal input, div#portal-products-modal textarea').removeAttr('disabled');
                    $('div#portal-products-modal .spinner-container > div').addClass('hidden');

                    if (resp['code'] == '-1') {
                        toastr.success('Product edited successfully.', 'Success');
                        $('#portal-products .pagination li.active a').trigger('click');
                        $('#portal-products-Exclude .pagination li.active a').trigger('click');
                    } else {
                        toastr.error(resp['desc'], 'Error');
                    }
                    if (productsEmbeddedView && embeddedDialogId) {
                        $(embeddedDialogId).trigger('click');
                    } else {
                        $('#ajax').modal('toggle');
                    }
                }, 'json');

                return false;
            });

            // Trigger table filtering, works by re-drawing
            $(document).on('submit', 'form#products-filter-form', function (e) {
                $("#portal_products_table").DataTable().draw();
                return false;
            });
            $(document).on('submit', 'form#products-filter-form-exclude', function (e) {
                $("#portal_products_table_Exclude").DataTable().draw();
                return false;
            });
            if ($().select2) {
                $('.select2custom').select2({
                    placeholder: $(this).data('placeholder'),
                    allowClear: false
                });
            }
        },
        modal: function () {
            //Help Info
            $(document).off('click', 'a.campaign-help')
                .on('click', 'a.campaign-help', function(e) {

                    $("#ajax .modal-content").prop('outerHTML', $('script#modal-content-template').html());

                    $('#ajax').modal({
                        backdrop: 'static',
                        keyboard: false
                    });

                    var data = {};
                    $.get(BASE_URL + '/product/help', data, function(resp) {
                        $('html, body').animate({scrollTop: 0}, 'slow');
                        $('html').addClass('overflow-disabled-tmp');

                        $("#ajax .modal-content").prop('outerHTML', resp);

                    });

                    $(document).off('hidden.bs.modal', '#ajax')
                        .on('hidden.bs.modal', '#ajax', function (e) {
                            $('html').removeClass('overflow-disabled-tmp');
                            $("#ajax .modal-content").removeClass('campaign-help-modal');
                        });

                    $(document).off('slid.bs.carousel', '#ajax')
                        .on('slid.bs.carousel', '#ajax', function(e) {
                            $(window).trigger('resize');
                        });

                    $(document).off('slide.bs.carousel', '#ajax')
                        .on('slid.bs.carousel', '#ajax', function(e) {
                            $(window).trigger('resize');
                        });


                    $(document).off('show.bs.modal', '#ajax')
                        .on('show.bs.modal', '#ajax', function (e) {
                            if ($(this).find('.campaign-help-modal').length) {
                                $(window).trigger('resize');
                                intKeyboardNavigation();
                            }
                        });

                    $(document).off('shown.bs.modal', '#ajax')
                        .on('shown.bs.modal', '#ajax', function (e) {
                            if ($(this).find('.campaign-help-modal').length) {
                                $(window).trigger('resize');
                                intKeyboardNavigation();
                            }
                        });

                    return false;
                });
        }
    };
}();
