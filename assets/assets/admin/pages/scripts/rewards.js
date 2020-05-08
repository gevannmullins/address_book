var Rewards = function () {

    jQuery.validator.addMethod("integerOnly", function(value, element) {
        return this.optional(element) || ((value % 100) === 0);
    }, "Value must be in whole "+CURRENCY+" 1.00 increments.");

    var form = $('#campaign_reward_form');

    var initValidation = function() {
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
                    required: true,
                    minStrict: 199,
                    integerOnly: true
                }
            },
            messages: {
                "reward[rewardCentValue]": "Please enter a value greater than "+CURRENCY+"2.00 in R 1.00 increments."
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
                form.submit();
            }
        });
    }

    return {
        init: function () {

            initValidation();

            $('.button-next').on('click', function () {
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

            $('.select-change').change(function () {
                if ($(this).attr('id') == 'filter-rewardType' && $(this).val() == 2) {
                    $('input[name*=sendSmsNotification]').prop('checked', false).uniform().trigger('change')
                        .closest('.form-group').addClass('hidden');
                } else {
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

            CampaignWizard.initMasks();
        }
    }
}();