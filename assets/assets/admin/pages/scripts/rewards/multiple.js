var campaignRewards = [];
var Rewards = function () {

    $(window).resize(Portal.globalHandleOverflowColumns);

    jQuery.validator.addMethod("integerOnly", function (value, element) {
        return this.optional(element) || ((value % 100) === 0);
    }, "Value must be in whole "+CURRENCY+" 1.00 increments.");

    var form = $('#campaign_reward_form');

    var handleRewardClear = function (e) {
        e.preventDefault();
        $('#reward-id').val("");
        $("input[name='reward[triggerBalance]']").val("");
        $("textarea[name='reward[notificationMessage]']").val("");
        $('#rewardCentValue').val("");
        $("input[name='reward[sendSmsNotification]']").prop('checked', false).uniform().trigger('change');
        $('#btn-create').html('Create Reward');
        $('#btn-clear-reward').addClass('hidden');
    }

    var handleRowClick = function (e) {
        e.preventDefault();
        var element = $(this),
            id = element.attr('data-id'),
            reward = campaignRewards[id];

        $('#reward-id').val(id);
        $('#filter-rewardType').select2('val', reward.rewardTypeId).trigger('change');
        $("input[name='reward[triggerBalance]']").val(reward.triggerBalance);
        $("textarea[name='reward[notificationMessage]']").val(reward.notificationMessage);
        $('#rewardCentValue').val(reward.rewardCentValue);
        $("input[name='reward[sendSmsNotification]']").prop('checked', reward.sendSmsNotification).uniform().trigger('change');

        $('#btn-create').html('Update Reward');
        $('#btn-clear-reward').removeClass('hidden');

    }

    var updateValueRule = function () {
        var rewardTypeId = $('#filter-rewardType').val();
        var rewardCentValueElem = $('input[name="reward[rewardCentValue]"]');

        rewardCentValueElem.rules("remove");
        if (rewardTypeId == 3) {
            rewardCentValueElem.rules("add", {
                required: true,
                minStrict: 199,
                integerOnly: true
            });
        } else {
            rewardCentValueElem.rules("add", {
                required: true
            });
        }
    };


    var initValidation = function () {

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
                "reward[rewardTypeId]": {
                    required: true
                },
                "reward[triggerBalance]": {
                    required: true,
                    digits: true,
                    minStrict: 0
                },
                "earningPerBasket": {
                    required: true,
                    digits: true
                },
                "reward[rewardCentValue]": {
                    required: true
                }
            },
            messages: {
                "reward[rewardCentValue]": {
                    required: "This value is required.",
                    minStrict: "Please enter a value greater than " + CURRENCY + "2.00."
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
                var url = $(form).attr('action'),
                    data = $(form).serialize();

                Portal.rawAjaxRequest(url, data, "#campaign_wizard", function (resp) {
                    if (resp.response.code == "-1") {
                        initTables();
                        $('#btn-create').html('Create Reward');
                        $('#btn-clear-reward').addClass('hidden');
                    } else {
                        toastr.error(resp.response.desc, "Error");
                    }
                });
            }
        });
    }

    var handleRewardDelete = function (e) {
        var $id = $(this).data('id');

        var $data = {
            'reward': {
                'id': $id,
                'state': 'D'
            }
        };

        Portal.rawAjaxRequest(BASE_URL + '/rewards/reward', $data, '#rewards-table_wrapper', function (response) {
            initTables();
        });
    }

    var initTables = function () {
        // channels listing

        $('#rewards-table').dataTable().fnDestroy();
        rewardsGrid = new Datatable();

        var rewardsColumns = [
            {"data": "rewardTypeId"},
            {"data": "cvsCampaignId"},
            {"data": "triggerBalance"},
            {"data": "rewardValueType"},
            {"data": "rewardCentValue"},
            {"data": "externalRewardId"},
            {"data": "sendSmsNotification"},
            {"data": "notificationMessage"},
            {"data": "state"},
            {"data": "actions"}
        ];
        var columnsAfterSecond = 0;

        if (CAMPAIGN_TYPE_NAME != 'RANDOM') {
            rewardsColumns.splice(3, 0, {"data": "allowTriggerOnMultiples"});
            columnsAfterSecond = 1;
        }

        var rewardsColumnsDefs = [
            {
                "render": function (data, type, row) {
                    return (rewardTypes[data]) ? rewardTypes[data] : 'N/A';
                },
                "targets": [0]
            },
            {
                "render": function (data, type, row) {
                    return (data) ? data : '';
                },
                "targets": [1]
            },
          {
            "render": function (data, type, row) {
              if (CAMPAIGN_TYPE_NAME == 'RANDOM') {
                return '1/' + data;
              } else {
                return data;
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
                "targets": [8 + columnsAfterSecond]
            },


          {
                "render": function (data, type, row) {
                    var options = document.getElementById('filter-externalReward').options;
                    for (i = 0; i < options.length; i++) {
                        if (options[i].value == data) {
                            return options[i].label;
                        }
                    }
                    return (data);
                },
                "targets": [5 + columnsAfterSecond]
            },
            {
                "render": function (data, type, row) {
                    return (data) ? "Yes" : "No";
                },
                "targets": [6 + columnsAfterSecond]
            },
            {
                "targets": 'no-sort',
                "orderable": false
            },
            {
                "render": function (data, type, row) {
                    var actions = "";
                    if (row.fake) {
                        actions = actions.concat('<a data-id="' + row.id + '" class="btn btn-xs btn-default btn-edit-rule" href="javascript:void(0)">Edit Rule</a>');
                        actions = actions.concat('<button data-id="' + row.id + '" class="btn btn-xs red btn-delete-rule" type="button" onclick="Rules.deleteRule(this); return false;">Delete Rule</button>');
                    } else {
                        actions = actions.concat('<a data-id="' + row.id + '" class="btn btn-xs red btn-delete-reward" href="javascript:void(0)">Deactivate</a>');
                    }
                    return actions;
                },
                "targets": [9 + columnsAfterSecond]
            }
        ];

        if (CAMPAIGN_TYPE_NAME != 'RANDOM') {
            rewardsColumnsDefs.splice(2, 0, {
                "render": function (data, type, row) {
                    return (data) ? "Yes" : "No";
                },
              "targets": [3]
            });
        }

        rewardsGrid.init({
            "src": $("#rewards-table"),
            loadingMessage: 'Loading...',
            "dataTable": {
                "serverSide": true,
                "dom": "<'row'<'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-sm-8'p><'col-sm-4'l>>",
                "lengthMenu": [10, 20, 50, 75, 100, 250],
                "scrollY": "225px",
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
                    "emptyTable": "No rewards found.",
                    "lengthMenu": "_MENU_ records per page"
                },
                "columns": rewardsColumns,
                "columnDefs": rewardsColumnsDefs,
                "ajax": {
                    "url": BASE_URL + "/rewards/data",
                    "method": "GET"
                },
                "createdRow": function (row, data, dataIndex) {
                    campaignRewards[data.id] = data;
                    if (row.fake) {
                        $(row).addClass('clickable').attr('data-id', data.id).click(handleRowClick);
                    }
                },
                'extraDrawCallback': function (settings) {
                    $(window).trigger('resize');
                }
            }
        });
    }

    return {
        init: function () {

            initValidation();

            $('#btn-clear-reward').click(handleRewardClear);

            $('.btn-delete-reward').off('click', handleRewardDelete);
            $(document).on('click', '.btn-delete-reward', handleRewardDelete);

            $('#btn-create').click(function (e) {
                form.submit();
            });

            $('.checkbox-change').change(function () {
                item = $(this);
                if (item.is(':checked')) {
                    container = $(item.data("container")).removeClass('hidden');
                    $(item.data("container")).find('textarea').removeAttr('disabled');
                } else {
                    container = $(item.data("container")).addClass('hidden');
                    $(item.data("container")).find('textarea').attr('disabled', 'disabled');
                }
            });

            $('.reward-value-change').change(function () {
                item = $(this);
                if (item.is(':checked')) {
                    container = $('.reward-containers').addClass('hidden');
                    $('.reward-containers').find('input').attr('disabled', 'disabled');

                    container = $(item.data("container")).removeClass('hidden');
                    $(item.data("container")).find('input').removeAttr('disabled');
                }
            });

            $('.select-change').change(function () {
                updateValueRule();
                if ($(this).attr('id') == 'filter-rewardType' && $(this).val() == 2) {
                    $('input[name*=sendSmsNotification]').prop('checked', false).uniform().trigger('change')
                        .closest('.form-group').addClass('hidden');
                } else if ($(this).val() == 4) {

                }
                else {
                    $('input[name*=sendSmsNotification]').closest('.form-group').removeClass('hidden');
                }
                $('.hide-on-change').each(function () {
                    $(this).addClass('hidden');
                    $(this).find('input,select,textarea').each(function () {
                        $(this).attr("disabled", "disabled");
                        $(this).attr("readonly", "readonly");
                    })
                })
                item = $(this).val();
                container = $('.reward-' + item + '-container').removeClass('hidden');
                $('.reward-' + item + '-container').find('input,select,textarea').each(function () {
                    $(this).removeAttr("disabled");
                    $(this).removeAttr("readonly");
                })

                $('.checkbox-change').change();

            });

            initTables();

            CampaignWizard.initMasks();
        }
    }
}();