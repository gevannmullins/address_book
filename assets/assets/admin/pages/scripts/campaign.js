var Campaign = function () {

    var handleRevoke = function() {
        $(document).on('click', '.btn-revoke:not(.disabled)', function(e) {
            e.preventDefault();
            var $element = $(this),
                message = "This action will remove your sign off on the campaign. Are you sure you want to continue?";

            bootbox.dialog({
                message: message,
                title: "Confirmation",
                buttons: {
                    cancel: {
                        label: "Cancel",
                        className: "btn-default",
                        callback: function() {
                            return true;
                        }
                    },
                    success: {
                        label: "OK",
                        className: "btn-primary",
                        callback: function() {
                            window.location = $element.attr("href");
                        }
                    }
                }
            });
        });
    }

    var handleSignoff = function() {
        $(document).on('click', '.btn-signoff:not(.disabled)', function(e) {
            e.preventDefault();
            var $element = $(this),
                message = "Are you sure you want to sign off this campaign? This will place it into an active state and allow customers to earn and be rewarded from it.";

            bootbox.dialog({
                message: message,
                title: "Confirmation",
                buttons: {
                    cancel: {
                        label: "Cancel",
                        className: "btn-default",
                        callback: function() {
                            return true;
                        }
                    },
                    success: {
                        label: "OK",
                        className: "btn-primary",
                        callback: function() {
                            window.location = $element.attr("href");
                        }
                    }
                }
            });
        });
    }

    var initShortcuts = function (campaigns) {

        Mousetrap.bind("ctrl+n",function(e) {
            $('#campaign-create')[0].click();
        });

    }

    var handleWs = function() {
        var pusher = new Pusher('d3d5be5787f6595d4578', {
            encrypted: true
        });
        var channel = pusher.subscribe('campaign');
        channel.bind('create', function(data) {
            console.log(data);
        });
    }

    var handleFilterChange = function() {
        $(document).off('change', '#campaigns-filter-form select.select2me')
            .on('change', '#campaigns-filter-form select.select2me', function(e) {
                $(this).attr('data-value', $(this).val());
            })

        var refreshedInterval = setInterval(function() {
            var campaignType = $('#campaigns-filter-form select#filter-campaignType');
            if (!campaignType.attr('data-value')) {
                return;
            }
            var counterType = $('#campaigns-filter-form select#filter-counterType');

            if (campaignType.attr('data-value') == CAMPAIGN_TYPES['RANDOM']) {
                counterType.attr('disabled', 'disabled');
                counterType.closest('.form-group').addClass('hidden');
                counterType.html('');
            } else {
                counterType.attr('data-url', counterType.attr('data-url') + campaignType.attr('data-value')).trigger('refresh');
            }

            var earnType = $('#campaigns-filter-form select#filter-earnType');
            earnType.attr('data-url', earnType.attr('data-url') + campaignType.attr('data-value')).trigger('refresh');
            clearInterval(refreshedInterval);
        }, 500);
    }

    return {
        init: function () {
            handleRevoke();
            handleSignoff();
            initShortcuts();
            handleFilterChange();
        }
    }
}();