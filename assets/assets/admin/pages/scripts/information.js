var CampaignInformation = function () {

    var handleInformationPage = function() {
        if ($('select#filter-campaignType').attr('data-value') == CAMPAIGN_TYPES['RANDOM']) {
            $('select#filter-counterType').closest('.form-group').addClass('hidden');
            $('select#filter-counterType').attr('disabled', 'disabled');
        }

        $(document).off('change', 'select#filter-campaignType')
            .on('change', 'select#filter-campaignType', function(e) {
                var affectedElem = $(this).closest('form')
                    .find('select#filter-counterType, select#filter-earnType');
                var that = this;

                if (affectedElem.length) {
                    affectedElem.each(function(index, block) {
                        block = $(block)
                        var dataUrl = block.data('url');
                        // set updated url
                        dataUrl = dataUrl.split('?');
                        dataUrl = dataUrl[0] + '?campaignTypeId=' + ($(that).val() || '');
                        block.attr('data-url', dataUrl);

                        block.html('').select2('data', null);
                        block.removeAttr('data-value');

                        if ($(that).val() == CAMPAIGN_TYPES['RANDOM'] && block.attr('name') == 'counterTypeId') {
                            block.closest('.form-group').addClass('hidden');
                            block.attr('disabled', 'disabled');
                        } else {
                            block.closest('.form-group').removeClass('hidden');
                            block.removeAttr('disabled');
                            // reload options
                            $('select#' + block.attr('id')).trigger('refresh');
                        }
                    });
                }
            });
    }

    return {
        init: function () {
            handleInformationPage();
        }
    }
}();