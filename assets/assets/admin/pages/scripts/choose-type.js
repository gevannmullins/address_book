var CampaignChooseType = function () {

    var handleCampaignTypesDisplay = function() {

        // handle campaign types block
        $(document).on('click', '#campaign-choosetype ul.campaign-types-box li', function(e) {
            if ($(this).hasClass('active')) {
                return ;
            }

            $(this).addClass('active')
                .siblings(':not(:nth-child(' + $(this).index() + 1 + '))').removeClass('active');

            $('div.choose-type-content div.item:eq(' + $(this).index() + ')').addClass('active')
                .siblings(':not(:nth-child(' + $(this).index() + 1 + '))').removeClass('active');

            // remove counter
            $('#campaign-choosetype .counter-type-select li').removeClass('active');
            $('#campaign-choosetype .counter-type-select + div > p').removeClass('active')
                .removeClass('focused');
            $('#campaign-choosetype .earn-type-select:not(._show)').addClass('hidden');

            // clear error
            $('.campaign-choosetype-bottom div.submit-block .error-msg').text('');
            //
            $('.item.active form [name=counterTypeId]').val('')
        });
    }

    var handleCounterTypesDisplay = function() {
        // handle counter types block
        $(document).on('click', '#campaign-choosetype .counter-type-select li', function(e) {
            // set counter type
            $(this).closest('form').find('input[name=counterTypeId]').val($(this).attr('data-id'))
                .trigger('change');

            $(this).addClass('active')
                .siblings(':not(:nth-child(' + $(this).index() + 1 + '))').removeClass('active');

            $(this).closest('.counter-type-select').next().find('>p[data-id=' + $(this).attr('data-id') + ']')
                .addClass('active')
                .siblings(':not([data-id=' + $(this).attr('data-id') + '])').removeClass('active');

            // show earn types
            $('#campaign-choosetype .earn-type-select').removeClass('hidden');

            // clear error
            $('.campaign-choosetype-bottom div.submit-block .error-msg').text('');
        });

        // help text hover
        $(document).on({
            mouseenter: function () {
                $(this).closest('.counter-type-select').next().find('>p[data-id=' + $(this).attr('data-id') + ']')
                    .addClass('focused')
                    .siblings(':not([data-id=' + $(this).attr('data-id') + '])').removeClass('focused');
            },
            mouseleave: function () {
                $(this).closest('.counter-type-select').next().find('>p[data-id=' + $(this).attr('data-id') + ']')
                    .removeClass('focused');
            }
        }, '#campaign-choosetype .counter-type-select li');
    }

    var handleEarnTypesDisplay = function() {
        // handle
        $(document).on('change', '#campaign-choosetype input[name=counterTypeId]', function(e) {
            var earnTypeBlock = $(this).closest('form').find('.earn-type-select');

            earnTypeBlock.find('>h2 span[data-counter-id=' + $(this).val() + ']').removeClass('hidden')
                .siblings(':not([data-counter-id=' + $(this).val() + '])').addClass('hidden');

            $(this).closest('form').find('select[name=earnTypeId]').trigger('change');
        });

        $(document).on('change', '#campaign-choosetype select[name=earnTypeId]', function(e) {
            $(this).siblings('p.input-help').addClass('hidden');
            //
            $(this).siblings('p.input-help[data-id=' + $(this).val() + ']').removeClass('hidden');
        });
    }

    var handleFormSubmit = function() {
        $(document).on('click', '.campaign-choosetype-bottom .submit-block button', function(e) {
            var errorMessage = '';
            if (!$('.choose-type-content .item.active').length) {
                errorMessage = 'Please choose a campaign type.';
            } else if ($('.item.active form [name=counterTypeId]').length
                       && !$('.item.active form [name=counterTypeId]').val()) {
                errorMessage = 'Please choose a campaign counter type.';
            } else if (!$('.item.active form select[name=earnTypeId]').val()) {
                errorMessage = 'Please choose a campaign earn type.';
            }
            if (errorMessage) {
                $('.campaign-choosetype-bottom div.submit-block .error-msg').text(errorMessage);
                return false;
            }

            $('#campaign-choosetype div.item.active form').submit();
        });
    }

    return {
        init: function () {
            //
            handleCampaignTypesDisplay();

            //
            handleCounterTypesDisplay();

            //
            handleEarnTypesDisplay();

            //
            handleFormSubmit();
        }
    }

}();



