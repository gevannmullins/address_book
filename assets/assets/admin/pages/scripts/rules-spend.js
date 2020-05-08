
var Rules = function () {


    jQuery.validator.addMethod("greaterAllowNoLimit", function(value, element, params) {
        var lowerBoundryValue = parseInt(jQuery(params['element']).val());
        return (parseInt(value) === 0) || (value > lowerBoundryValue);
    }, jQuery.validator.format("Please enter a value greater than the value above."));

    var campaignForm = $('#campaign_rules_form'),
        earningForm = $('#earning_rule_form'),
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

    $.validator.addMethod('ruleIsUnique', function (value, el, param) {
        var found = false,
            currentMin = $(param.min).val(),
            currentMax = value;

        spendingRules = $.grep(spending, function (n) {
            return (n)
        });

        $.each(spendingRules, function (index, value) {
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


    // spend value
    var initThresholdValidation = function () {
        hasRuleChanged();
        CampaignWizard.initCustomValidation();
        var formEarningRules = {
            "rule[contribution]": {
                required: true,
                number: true,
                minStrict: 0
            }
        };

        if ($.inArray(SPEND_EARN_TYPE_NAME, ['SPEND_BETWEEN_PERCENTAGE', 'SPEND_BETWEEN_FIXED']) !== -1) {
            formEarningRules = $.extend({}, formEarningRules, {
                "rule[minBasketValue]": {
                    required: true,
                },
                "rule[maxBasketValue]": {
                    required: true,
                    greaterAllowNoLimit: {
                        element: "#minBasketValue",
                        label: "Lower Boundary"
                    },
                    ruleIsUnique: {
                        min: "#minBasketValue",
                        max: "#maxBasketValue"
                    }
                }
            });
        } else {
            formEarningRules = $.extend({}, formEarningRules, {
                required: true,
                greaterAllowNoLimit: {
                    element: "#minBasketValue",
                    label: "Lower Boundary"
                }
            });
        }
        var formValidationDefaults = {
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
            rules: $.extend({}, {
                "campaign[maxRewards]": {
                    required: true,
                    digits: true
                },
                "campaign[maxCampaignCompletions]": {
                    required: true,
                    digits: true
                }
            }, formEarningRules),
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            },
            success: function (label) {
                label
                    .addClass('valid') // mark the current input as valid and display OK icon
                    .closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
            },
            submitHandler: function (form) {
                //$('.currency').inputmask('remove');
                form.submit(function () {});
            }
        };
        // campaign form
        campaignForm.validate(formValidationDefaults);

        // earning form
        var formValidationRules =  formValidationDefaults;
        formValidationRules['rules'] = formEarningRules;
        earningForm.validate(formValidationRules);
    }

    return {
        init: function () {

            initThresholdValidation();

            $('.button-next').on('click', function () {
                campaignForm.submit();
            });

            CampaignWizard.initMasks();

        }

    }
}();