var CampaignCommon = function () {

    var handleDisplayHelp = function() {
        $(window).resize(Portal.globalHandleOverflowColumns);


        function intKeyboardNavigation() {
            $(document).off('keydown', '#carousel-campaign-help-modal')
                .on('keydown', '#carousel-campaign-help-modal', function (e) {
                    if (/input|textarea/i.test(e.target.tagName)) return
                    switch (e.which) {
                    case 37: $(this).carousel('prev'); break
                    case 39: $(this).carousel('next'); break
                    default: return
                    }

                    e.preventDefault()
                });
        }

        $(document).off('click', 'a.campaign-help')
            .on('click', 'a.campaign-help', function(e) {

                $("#ajax .modal-content").prop('outerHTML', $('script#modal-content-template').html());

                $('#ajax').modal({
                    backdrop: 'static',
                    keyboard: false
                });

                var data = {};
                $.get(BASE_URL + '/campaigns/help', data, function(resp) {
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

    var handleCampaignsFilters = function() {
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
                        if (block.attr('data-optional')) {
                            dataUrl = dataUrl[0] + '?optional='
                                + block.attr('data-optional') + '&campaignTypeId=' + ($(that).val() || '');
                        } else {
                            dataUrl = dataUrl[0] + '?campaignTypeId=' + ($(that).val() || '');
                        }
                        block.attr('data-url', dataUrl);

                        block.html('').select2('data', null);
                        block.attr('data-value', '');

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
        handleCampaignsFilters: function() {
            handleCampaignsFilters();
        },
        init: function () {
            handleDisplayHelp();
        }
    }
}();