var items = [];
var earning = [];
var spending = [];
var checked = [];
var grid = null;
var groupGrid = null;

var Rules = function () {

    var form = $('#campaign_rules_form'),
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
                "campaign[maxRewards]": {
                    required: true,
                    digits: true
                },
                "campaign[maxCampaignCompletions]": {
                    required: true,
                    digits: true
                },
                "rule[minBasketValue]": {
                    required: true,
                },
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
                // $('.currency').inputmask('remove');
                form.submit();
            }
        });
    }

    return {
        init: function () {
            initEverytimeValidation();
            CampaignWizard.initMasks();

            $('.button-next').on('click', function(e) {
               form.submit();
            });
        }

    }
}();