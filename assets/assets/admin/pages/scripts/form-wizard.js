var submitted = false;

var CampaignWizard = function () {

    var initShortcuts = function() {
        Mousetrap.bind("ctrl+o",function(e) {
            $('#campaign-overview')[0].click();
        });
        Mousetrap.bind("ctrl+1", function(e) {
            $('#campaign-information')[0].click();
        });
        Mousetrap.bind("ctrl+2", function(e) {
            $('#campaign-stores')[0].click();
        });
        Mousetrap.bind("ctrl+3", function(e) {
            $('#campaign-rules')[0].click();
        });
        Mousetrap.bind("ctrl+4", function(e) {
            $('#campaign-rewards')[0].click();
        });
        Mousetrap.bind("ctrl+5", function(e) {
            $('#campaign-confirm')[0].click();
        });
    }

    return {
        //main function to initiate the module
        handleShortcuts: function() {
          initShortcuts();
        },
        init: function (next) {

          if (window.mode == "edit" && state !== 'N') {
            const customerPerUse = $('input[name="campaign[maxEarnsPerCustomerPerDay]"]'),
              originalValue = parseInt(customerPerUse.val()),
              helpBlock = $(customerPerUse.next('.help-block')[0]),
              originalText = helpBlock.text();

            if (customerPerUse) {

              customerPerUse.on('change', (val) => {
                if (customerPerUse.val() > originalValue && originalValue === 0) {
                  helpBlock.text('The limit will only be active from the following day ' + originalText);
                } else {
                  helpBlock.text(originalText);
                }
              });

            }
          }
            if (window.mode == "create") {
                $('input[name="name"]').focus();
            }

            $(".select2").select2({
                placeholder: "Select",
                allowClear: true,
                escapeMarkup: function (m) {
                    return m;
                }
            });

            $('input,textarea').each(function () {
                $(this).attr('data-initial', $(this).val());
            });

            window.onbeforeunload = function () {
                if (submitted) {
                    return;
                }
                var msg = 'You haven\'t saved your changes.';
                var isDirty = false;

                $('input,textarea').each(function () {
                    var attr = $(this).attr('data-initial');
                    if (typeof attr !== typeof undefined) {
                        if ($(this).attr('data-initial') != $(this).val()) {
                            isDirty = true;
                        }
                    }
                });

                if (isDirty == true) {
                    return msg;
                }
            };

            var form = $('#campaign_form');
            var error = $('.alert-danger', form);
            var success = $('.alert-success', form);
            var extraCampaignFormRules = {
                'counterTypeId': {
                    required: true
                },
            }

            if (typeof CAMPAIGN_TYPES !== 'undefined'
                && ($('select#filter-campaignType').val() == CAMPAIGN_TYPES['RANDOM'])) {
                delete extraCampaignFormRules['counterTypeId'];
            }

            form.validate({
                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: $.extend({}, {
                    //information
                    'name': {
                        minlength: 4,
                        required: true
                    },
                    'description': {
                        required: true
                    },
                    'campaignTypeId': {
                        required: true
                    },
                    'earnTypeId': {
                        required: true
                    },
                    'maxRewards': {
                        digits: true
                    },
                    'maxRewardsPerCustomer': {
                        lessThan: {
                            element: "input[name=\"maxRewards\"]"
                        }
                    },
                    'maxNrEarnsPerBasket': {
                        digits: true
                    }
                }, extraCampaignFormRules),

                messages: { // custom messages for radio buttons and checkboxes
                    maxRewardsPerCustomer: 'Value must be less than or equal to Maximum Rewards.'
                },
                errorPlacement: function (error, element) { // render error placement for each input type
                    if (element.attr("name") == "gender") { // for uniform radio buttons, insert the after the given container
                        error.insertAfter("#form_gender_error");
                    } else if (element.attr("name") == "distribution[]") { // for uniform checkboxes, insert the after the given container
                        error.insertAfter("#form_distribution_error");
                    } else {
                        error.insertAfter(element); // for other inputs, just perform default behavior
                    }
                },
                invalidHandler: function (event, validator) { //display error alert on form submit
                    errors = "Please fill in all the required fields.";
                    success.hide();
                    toastr.error(errors)
                },
                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
                },
                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },
                success: function (label) {
                    label
                        .addClass('valid') // mark the current input as valid and display OK icon
                        .closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
                },

                submitHandler: function (form) {
                    success.hide();
                    error.hide();
                    form.submit();
                    //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
                }

            });

            $('.button-next').on('click', function () {
                submitted = true;
                form.submit();
            });

            $(document).on('click', '.step', function (e) {
                if (window.mode == "create") {
                    e.preventDefault();
                    return false;
                }
            });

            CampaignWizard.initCustomValidation();

            initShortcuts();

        },

        addValidation: function (form, element, options) {
            if ($(element).length > 0) {
                $(element).rules("add", options);
            }
        },
        initMasks: function () {
            $(".currency").inputmask(CURRENCY + ' [9][9][9] [9][9][9] [9][9]9.99', {
                numericInput: true,
                rightAlignNumerics: false,
                greedy: false,
                placeholder: "0",
                autoUnmask: true,
                removeMaskOnSubmit: false,

            });

            $(".currency-no-decimal").inputmask(CURRENCY + ' [9][9][9] [9][9][9] [9][9]9.00', {
                numericInput: true,
                rightAlignNumerics: false,
                greedy: false,
                placeholder: "0",
                autoUnmask: true,
                removeMaskOnSubmit: false
            });

        },
        initCustomValidation: function () {

            $.validator.addMethod('minStrict', function (value, el, param) {
                return value.replace(/\D+/g, '') > param;
            }, $.validator.format("Please enter a value greater than {0}"));

            $.validator.addMethod('greaterThan', function (value, el, param) {
                if ($(param.element).length > 0 && $(param.element).val()) {
                    return Number(value.replace(/\D+/g, '')) > Number($(param.element).val().replace(/\D+/g, ''));
                }
                return true;
            }, $.validator.format("Please enter a value greater than the value above."));

            $.validator.addMethod('lessThan', function (value, el, param) {
                if ($(param.element).length > 0) {
                    return Number(value.replace(/\D+/g, '')) <= Number($(param.element).val().replace(/\D+/g, ''));
                }
                return true;
            }, $.validator.format("Please enter a value less than or equal to the value above."));
        }
    };

}();

function CallService(serviceName, objParams, friendlyName, callbackFn, method) {
    if (!window.CallServiceRequests) {
        window.CallServiceRequests = [];
    }
    var request = $.ajax({
        type: 'POST',
        url: BASE_URL + "/campaigns/service",
        context: this,
        data: {"resource": serviceName, "params": objParams, "method": method}
    });
    window.CallServiceRequests.push(request);
    request.done(
        function (responseData) {
            if (typeof (callbackFn) == "function") {
                callbackFn(serviceName, friendlyName, objParams, responseData);
            }

            if (window.CallServiceRequests.length > 0) {
                for (var req in window.CallServiceRequests) {
                    if (window.CallServiceRequests[req].readyState === 4) {
                        window.CallServiceRequests[req].abort();
                        window.CallServiceRequests.splice(req, 1);
                    }
                }
            }
            if (window.CallServiceRequests.length === 0) {
            }
        }
    );
}