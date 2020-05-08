var Index = function () {

    // split the array into chunks
    Array.prototype.chunk = function (chunkSize) {
        var array = this;
        return [].concat.apply([],
            array.map(function (elem, i) {
                return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
            })
        );
    }

    var transformToAssocArray = function (parameterString) {
        var params = {};
        var prmarr = parameterString.split("&");
        for (var i = 0; i < prmarr.length; i++) {
            var tmparr = prmarr[i].split("=");
            params[tmparr[0]] = tmparr[1];
        }
        return params;
    }

    var updateFilter = function (key, value) {
        var $element = $('[name="' + key + '"]');
        $element.data("value", value);
        Index.initReporting($element);
    }

    // making 10 simultaneous calls caused performance issues and program/user
    // setting issues so lets merge them into 1 call ( slower but better )
    var handleScalarCalls = function (element) {
        var calls = [];
        if ($('.populate').length) {
            $('.populate').each(function () {
                $dashBlock = $(this);
                $data = $('#filter-form').serializeArray();

                if (IsAffectedBy($dashBlock, element)) {
                    calls[calls.length] = $dashBlock.attr('data-id');
                    $dashBlock.closest('.number').html('<i class="fa fa-spinner fa-loader fa-spin"></i>');
                }
            });
        }

        // we can split in into chunks here for better loading
        var splits = calls.sort(function () {
            return Math.round(Math.random()) - 0.5;
        }).chunk(4);

        $.each(splits, function (key, value) {
            $data[$data.length] = {name: "reports", value: value};
            $.ajax({
                type: "POST",
                dataType: "json",
                url: BASE_URL + '/reporting/scalars',
                data: $.param($data)
            }).done(function (data) {
                $.each(data, function (key, value) {
                    var stat = value.data;
                    if (!isNaN(stat)) {
                        $('.dash-box-' + key).animateNumber({number: stat});
                    } else {
                        $('.dash-box-' + key).html(value.data);
                    }
                });
            });
        });

    };

    var handleDashboardCalls = function (element) {
        if ($('.reporting-portlet').length) {
            $('.reporting-portlet').each(function () {
                var $expanded = $(this).find('.collapse');
                if ($expanded.length) {
                    //if (IsAffectedBy($(this), element)) {
                    $(this).find('.reload').click();
                    //}
                }
            });
        }
    };

    var handleReportCall = function (reportId) {
        var report = $('#dash-chart-' + reportId);
        report.find('.reload').click();
    };

    var initReport = function (id) {
        handleReportCall(id);
    }

    var IsAffectedBy = function (report, element) {
        if (!element)
            return true;

        var affectedByElement = report.data('affectedby').toString();
        if (affectedByElement) {

            var affectedBy = affectedByElement.length > 1 ? affectedByElement.split(",") : affectedByElement,
                filter = $(element).attr('name');

            if ($.inArray(filter, affectedBy) !== -1) {
                return true;
            }
        }
        return false;

    }

    var handleFilterLoading = function () {
        var calls = [];
        if ($('select.populate-reporting-select').length) {
            $('select.populate-reporting-select').each(function () {

                $(this).change(function () {
                    Index.initReporting($(this));
                });

                calls[calls.length] = $(this).attr('data-id');

            });

            // we can split in into chunks here for better loading
            var splits = calls.sort(function () {
                return Math.round(Math.random()) - 0.5;
            }).chunk(4);

            $.each(splits, function (key, value) {
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: BASE_URL + '/reporting/filters',
                    async: true,
                    data: {"filters": value},
                    beforeSend: function (xhr) {
                    }
                }).done(function (data) {
                    $.each(data, function (key, value) {
                        $('#filter-' + value.filterId).html(value.content).addClass('loaded');
                        $('#filter-' + value.filterId).select2("val", $('#filter-' + value.filterId).data('value'));
                    });
                });
            });


        }
    }

    var handleTableExport = function () {
        $('.export-table').click(function () {
            data = $('#filter-form').serializeArray();
            data2 = $('#report-form-' + $(this).data('report-id')).serializeArray();
            $theForm = $('#filter-form');
            $theForm.attr('action', $(this).data('export-url'));
            $theForm.attr('method', 'POST');

            $theForm.submit();

        });
    }

    var handleLimitClick = function () {
        $(document).on('click', '.limit', function () {
            value = $(this).data('limit')
            if (value > 0) {
                $('input.limit').val(value);
                //Portal.initOpenReporting();
            }
        });
        handleToggleClick();
    }

    var handleToggleClick = function () {
        $(document).on('click', '.display-toggle', function () {
            value = $(this).data('display')
            if (value) {
                reportId = $(this).data('report');
                $('input.display-type').val(value);
                initReport(reportId);
            }
        });
    }

    var handleFilterClick = function () {
        $('.filter-toggle').click(function () { // First li of it's parent
            $('.page-bar').toggleClass('filters-open');
            $(this).toggleClass('open');
            $('.filter-dropdown').toggleClass('open');
        });
    }

    // Hanles sidebar toggler
    var handleFilterToggler = function () {
        var body = $('body');
        if ($.cookie && $.cookie('filters_closed') === '1' && Portal.getViewPort().width >= Portal.getResponsiveBreakpoint('md')) {
            $('body').addClass('filters-closed');
            $('.filter-dropdown').removeClass('open');
        } else {
            $('.page-bar').addClass('filters-open');
        }

        // handle sidebar show/hide
        $('body').on('click', '.filter-toggle', function (e) {
            var filters = $('.filter-dropdown');
            var pageBar = $('.page-bar');

            if (body.hasClass("filters-closed")) {
                body.removeClass("filters-closed");
                pageBar.addClass('filters-open');
                filters.addClass("open");
                if ($.cookie) {
                    $.cookie('filters_closed', '0', {expires: 365, path: '/'});
                }
            } else {
                body.addClass("filters-closed");
                pageBar.removeClass('filters-open');
                filters.removeClass("open");
                if ($.cookie) {
                    $.cookie('filters_closed', '1', {expires: 365, path: '/'});
                }
            }

            $(window).trigger('resize');
        });
    };

    return {

        initLoadReport: function () {

            var queryString = window.location.search.substr(1);
            var parameters = transformToAssocArray(queryString);
            $.each(parameters, function (key, value) {
                updateFilter(key, value);
            });
        },

        initCalendar: function () {
            if (!jQuery().fullCalendar) {
                return;
            }

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            var h = {};

            if ($('#calendar').width() <= 400) {
                $('#calendar').addClass("mobile");
                h = {
                    left: 'title, prev, next',
                    center: '',
                    right: 'today,month,agendaWeek,agendaDay'
                };
            } else {
                $('#calendar').removeClass("mobile");
                if (Portal.isRTL()) {
                    h = {
                        right: 'title',
                        center: '',
                        left: 'prev,next,today,month,agendaWeek,agendaDay'
                    };
                } else {
                    h = {
                        left: 'title',
                        center: '',
                        right: 'prev,next,today,month,agendaWeek,agendaDay'
                    };
                }
            }
        },

        initDashboardDaterange: function () {

            if (!jQuery().daterangepicker) {
                return;
            }

            $('#dashboard-report-range').daterangepicker({
                    opens: (Portal.isRTL() ? 'right' : 'left'),
                    startDate: moment($('#dateFrom').val()),
                    endDate: moment($('#dateTo').val()),
                    showDropdowns: false,
                    showWeekNumbers: true,
                    timePicker: false,
                    timePickerIncrement: 1,
                    timePicker12Hour: true,
                    ranges: {
                        'All': [moment("2015-01-01"), moment()],
                        'Today': [moment(), moment()],
                        'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                        'Last 7 Days': [moment().subtract('days', 6), moment()],
                        'Last 30 Days': [moment().subtract('days', 29), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                    },
                    buttonClasses: ['btn btn-sm'],
                    applyClass: ' btn-primary',
                    cancelClass: 'default',
                    format: 'MM/DD/YYYY',
                    separator: ' to ',
                    locale: {
                        applyLabel: 'Apply',
                        fromLabel: 'From',
                        toLabel: 'To',
                        customRangeLabel: 'Custom Range',
                        daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                        firstDay: 1
                    }
                },
                function (start, end) {
                    $('#dashboard-report-range span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                    if ($('#dateFrom').length) {
                        $('#dateFrom').val(start.format('MMMM D, YYYY'));
                        $('#dateTo').val(end.format('MMMM D, YYYY'));
                        Index.initReporting();
                    }
                }
            );
            $('#dashboard-report-range span').html($('#dateFrom').val() + ' - ' + $('#dateTo').val());
            $('#dashboard-report-range').show();
        },

        initReporting: function (element) {
            handleScalarCalls(element);
            handleDashboardCalls(element);
            handleTableExport();
        },

        init: function () {
            handleFilterToggler();
            Index.initDashboardDaterange();
            Index.initCalendar();
            Index.initLoadReport();
            handleFilterClick();
            handleFilterLoading();
            handleLimitClick();
            handleTableExport();
            handleScalarCalls();

            $('.js-stalker').stalker({offset: 70, stalkerStyle: "border-bottom"});
        },
        handleTableExport: function()
        {
            handleTableExport();
        }

    };

}();