/**
 * Created by calvinmuller on 15/08/06.
 */

// Variable to store your files
var files;
var action;

var Rewards;
Rewards = function () {

    if ($.validator) {
        $.validator.addMethod('minStrict', function (value, el, param) {
            return value.replace(/\D+/g, '') > param;
        }, $.validator.format("Please enter a value greater than "+CURRENCY+"2"));

        jQuery.validator.addMethod("integerOnly", function(value, element) {
            return this.optional(element) || ((value % 100) === 0);
        }, "Value must be in whole "+CURRENCY+" 1.00 increments.");
    }

    var show = function (id) {
        $('.reward-label').addClass('hidden');
        $('.reward-label.' + id).removeClass('hidden');
    };

    var rewardChange = function () {

        var rewardType = $(this).val(),
            url;

        var campaignId = $('#uploadForm select[name=cvsCampaignId]').closest('.form-group'),
            rewardValue = $('#uploadForm input[name=rewardCentValue]').closest('.form-group'),
            externalReward = $('#uploadForm select[name=externalRewardId]').closest('.form-group');

        if (rewardType == 3 || rewardType == 2 || rewardType == 4) {
            rewardValue.removeClass('hidden');
            rewardValue.find('select').removeAttr('disabled');
        } else {
            rewardValue.addClass('hidden');
            rewardValue.find('select').attr('disabled', 'disabled');
        }
        updateValueRule();

        if (rewardType == 3) {
            show('airtime');
            campaignId.hide();
            campaignId.find('select').attr('disabled', 'disabled');
            return false;
        } else if (rewardType == 4) {
            show('fixed');
            externalReward.removeClass('hidden');
            externalReward.find('select').removeAttr('disabled');
            campaignId.hide();
            campaignId.find('select').attr('disabled', 'disabled');
        } else {
            externalReward.addClass('hidden');
            externalReward.find('select').attr('disabled', 'disabled');
            show('giftcard');
            campaignId.show();
            campaignId.find('select').removeAttr('disabled');
        }

        // campaign or giftcard
        if (rewardType == 1)
            url = BASE_URL + '/campaigns/couponcampaigns/dimension?useCase=BATCH_ISSUE';
        else if (rewardType == 4) {
            url = BASE_URL + '/campaigns/externalReward/dimension?extraData=1&useCase=BATCH_ISSUE';
        } else
            url = BASE_URL + '/campaigns/giftcard/dimension?extraData=1&useCase=BATCH_ISSUE';

        Portal.rawAjaxRequest(url, {}, '', function (response) {
            $('select.data-ajax').html(response.content);
            if (rewardType == 4) {
                $('#externalRewardId').html(response.content);
                externalReward.find('select').select2();
            } else {
                campaignId.find('select').select2();
            }
        });

    };

    var updateValueRule = function() {
        var rewardTypeId = $('#uploadForm select[name=rewardTypeId]').val();
        var rewardCentValueElem = $('#uploadForm input[name=rewardCentValue]');

        rewardCentValueElem.rules( "remove" );
        if (rewardTypeId == 3) {
            rewardCentValueElem.rules( "add", {
                required: true,
                minStrict: 199,
                integerOnly: true
            });
        } else if (rewardTypeId == 2) {
            rewardCentValueElem.rules( "add", {
                required: true,
            });
        }
    }

    var validateForm = function () {

        $('#uploadForm').validate({
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
                "cvsCampaignId": {
                    required: false
                },
                "referenceType": {
                    required: true
                },
                "dataStream": {
                    required: true
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            },
            success: function (label) {
                label
                    .addClass('valid')
                    .closest('.form-group').removeClass('has-error').addClass('has-success');
            },
            submitHandler: function (form) {
                uploadFiles();
                return false;
            }
        });

    };

    var prepareUpload = function (event) {
        $('#btnLoad').hide();
        files = event.target.files;
    };

    var uploadFiles = function () {

        Portal.blockUI({
            target: 'body',
            animate: true
        });

        // Create a formdata object and add the files
        var myForm = document.forms.namedItem("uploadForm");
        var data = new FormData(myForm);
        $.each(files, function (key, value) {
            data.append('dataStream', value);
        });
        data.append('action', action);

        $.ajax({
            url: '',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function (data, textStatus, jqXHR) {
                Rewards.initTable(data);
                Portal.unblockUI('body');
                $('#rewardsPortlet').show();
                $('#btnLoad').show();
                if (data.response) {
                    if (data.response.response.code == "-1" && !data.response.customersNotFound.length) {
                        toastr.success(data.response.response.desc, "Success");
                    } else if (data.response.response.code != "-1") {
                        toastr.error(data.response.response.desc, "Error");
                    } else {
                        toastr.error("Customers have not been found, please refer to the table.", "Error");
                    }
                }
            },
            error: function (response) {
                Portal.unblockUI('body');
            }
        });
    };

    var initItemsTable = function(batchRewardId) {
        $(window).resize(Portal.globalHandleOverflowColumns);

        // channels listing
        batchrewardsGrid = new Datatable();

        var batchrewardsColumns = [
            {"data": "id"},
            {"data": "rewardIssuedId"},
            {"data": "customerId"},
            {"data": "customerName"},
            {"data": "customerSurname"},
            {"data": "customerMobileNumber"},
            {"data": "customerReference"},
            {"data": "createDate"},
            {"data": "lastModifiedDate"},
            {"data": "state"}

        ];

        var batchrewardsDefs = [
            {
                "render": function (data, type, row) {
                    return (data) ? data : '-';
                },
                "targets": [3, 4]
            },
            {
                "render": function (data, type, row) {
                    return states[data];
                },
                "targets": [9]
            }
        ];

        batchrewardsGrid.init({
            "src": $("#items-table"),
            loadingMessage: 'Loading...',
            "dataTable": {
                "serverSide": true,
                "dom": "<'row'<'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-sm-8'p><'col-sm-4'l>>",
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
                        'first': null,
                    },
                    "emptyTable": "No channels found.",
                    "lengthMenu": "_MENU_ records per page"
                },
                "columns": batchrewardsColumns,
                "columnDefs": batchrewardsDefs,
                "ajax": {
                    "url": BASE_URL + "/batch/rewards/" + batchRewardId + "/batch-items",
                    "method": "GET"
                },
                "createdRow": function( row, data, dataIndex ) {
                    $(row).addClass( 'clickable tooltips' ).attr('title', data.responseDesc);
                    if (data.state == "F") {
                        $(row).addClass('danger');
                    } else if (data.state == "S") {
                        $(row).addClass('success');
                    }
                },
                'extraDrawCallback': function(settings) {
                    $(window).trigger('resize');
                    $('.tooltips').tooltip();
                }
            }
        });
    };

    var initFormValidation = function() {

    };

    return {
        init: function () {
            $(window).resize(Portal.globalHandleOverflowColumns);
            $("select[name='rewardTypeId']").change(rewardChange);
            $("select[name='cvsCampaignId']").change(function(e) {
                var option = $(this).find('option:selected');
                var rewardValue = $('#uploadForm input[name=rewardCentValue]').closest('.form-group');

                if ($("select[name='rewardTypeId']").val() == 2 && (option.data('min') == option.data('max'))) {
                    rewardValue.addClass('hidden');
                    rewardValue.find('input[name=rewardCentValue]').attr('disabled', 'disabled').val(option.data('min'));
                } else {
                    rewardValue.removeClass('hidden');
                    rewardValue.find('input[name=rewardCentValue]').removeAttr('disabled').val('');
                }
            });
            $('input[type=file]').on('change', prepareUpload);

            $('.btn-action').on('click', function(e) {
                action = $(this).attr('id');
            });

            $(".currency").inputmask(CURRENCY + ' [9][9][9] [9][9][9] [9][9]9.99', {
                numericInput: true,
                rightAlignNumerics: false,
                greedy: false,
                placeholder: "0",
                autoUnmask: true,
                removeMaskOnSubmit: false,
            });

            validateForm();
        },
        initTable: function (data) {
            // rewards listing
            $('#rewardsTable').dataTable().fnDestroy();
            rewardGrid = new Datatable();
            rewardGrid.init({
                "src": $("#rewardsTable"),
                loadingMessage: 'Loading...',
                "dataTable": {
                    "ajax": false,
                    "dom": "<'row'<'col-md-4 col-sm-12'f<'table-group-actions pull-right'>>r>t<'row'<'col-sm-8'p><'col-sm-4'l>>",
                    "lengthMenu": [10, 20, 50, 75, 100, 250],
                    "scrollY": "200px",
                    "pagingType": "full_numbers",
                    "serverSide": false,
                    "data": data.customers,
                    "columns": [
                        {"data": "id"},
                        {"data": "type"},
                    ],
                    "createdRow": function (row, data, dataIndex) {
                        if (data.notfound) {
                            $(row).addClass('danger');
                        }
                    },
                    'extraDrawCallback': function(settings) {
                        $(window).trigger('resize');
                    }
                }
            });
        },

        initListingTable: function() {
            $(window).resize(Portal.globalHandleOverflowColumns);

            // channels listing
            batchrewardsGrid = new Datatable();

            var batchrewardsColumns = [
                {"data": "id"},
                {"data": "rewardType"},
                {"data": "cvsCampaignId"},
                {"data": "batchSize"},
                {"data": "issuedCount"},
                {"data": "failedCount"},
                {"data": "sendSmsNotification"},
                {"data": "createDate"},
                {"data": "lastModifiedDate"},
                {"data": "state"},

            ];

            var batchrewardsDefs = [
                {
                    "render": function (data, type, row) {
                        return (data) ? data : '-';
                    },
                    "targets": [2]
                },
                {
                    "render": function (data, type, row) {
                        return states[data];
                    },
                    "targets": [9]
                },
                {
                    "render": function (data, type, row) {
                        return (data) ? "Yes" : "No";
                    },
                    "targets": [6]
                },
                {
                    "targets"  : 'no-sort',
                    "orderable": false
                }
            ];

            batchrewardsGrid.init({
                "src": $("#batch-rewards-table"),
                loadingMessage: 'Loading...',
                "dataTable": {
                    "serverSide": true,
                    "dom": "<'row'<'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-sm-8'p><'col-sm-4'l>>",
                    "lengthMenu": [10, 20, 50, 75, 100, 250],
                    "scrollY": "0px",
                    "pageLength": 20,
                    "stateSave": true,
                    "pagingType": "full_numbers",
                    "paging": true,
                    "language": {
                        "paginate": {
                            "previous": "Previous",
                            "next": "Next",
                            'last': null,
                            'first': null,
                        },
                        "emptyTable": "No channels found.",
                        "lengthMenu": "_MENU_ records per page"
                    },
                    "columns": batchrewardsColumns,
                    "columnDefs": batchrewardsDefs,
                    "ajax": {
                        "url": BASE_URL + "/rewards/batch-data",
                        "method": "GET"
                    },
                    "createdRow": function( row, data, dataIndex ) {
                        $(row).addClass( 'clickable').on('click', function(e) {
                            window.location = BASE_URL + '/batch/rewards/' + data.id + '/edit';
                        })
                        if (data.failedCount>0) {
                            $(row).addClass('warning');
                        }
                        Shortcuts.addCrudShortcut(data, 'batch/rewards', 'edit');
                    },
                    "extraBlockedTableContainer": 'div.table-container',
                    'extraDrawCallback': function(settings) {
                        $(window).trigger('resize');
                    }
                }
            });
        },

        initBatchEdit: function(batchRewardId) {
            initItemsTable(batchRewardId);
            initFormValidation();
        }
    };
}();