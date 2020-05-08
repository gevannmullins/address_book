var Portal = function () {

    // IE mode
    var isRTL = false;
    var isIE8 = false;
    var isIE9 = false;
    var isIE10 = false;

    var resizeHandlers = [];
    // initializes main settings

    var handleInit = function () {

        if ($('body').css('direction') === 'rtl') {
            isRTL = true;
        }

        isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
        isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
        isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);

        if (isIE10) {
            $('html').addClass('ie10'); // detect IE10 version
        }

        if (isIE10 || isIE9 || isIE8) {
            $('html').addClass('ie'); // detect IE10 version
        }

        if ($.fn.dataTable) {
            $.fn.dataTableExt.sErrMode = "";
        }
    };

    // runs callback functions set by Portal.addResponsiveHandler().
    var _runResizeHandlers = function () {
        // reinitialize other subscribed elements
        for (var i = 0; i < resizeHandlers.length; i++) {
            var each = resizeHandlers[i];
            each.call();
        }
    };

    // handle the layout reinitialization on window resize
    var handleOnResize = function () {
        var resize;
        if (isIE8) {
            var currheight;
            $(window).resize(function () {
                if (currheight == document.documentElement.clientHeight) {
                    return; //quite event since only body resized not window.
                }
                if (resize) {
                    clearTimeout(resize);
                }
                resize = setTimeout(function () {
                    _runResizeHandlers();
                }, 50); // wait 50ms until window resize finishes.
                currheight = document.documentElement.clientHeight; // store last body client height
            });
        } else {
            $(window).resize(function () {
                if (resize) {
                    clearTimeout(resize);
                }
                resize = setTimeout(function () {
                    _runResizeHandlers();
                }, 50); // wait 50ms until window resize finishes.
            });
        }
    };

    // Handles portlet tools & actions
    var handlePortletTools = function () {
        // handle portlet remove
        $('body').on('click', '.portlet > .portlet-title > .tools > a.remove', function (e) {
            e.preventDefault();
            var portlet = $(this).closest(".portlet");

            if ($('body').hasClass('page-portlet-fullscreen')) {
                $('body').removeClass('page-portlet-fullscreen');
            }

            portlet.find('.portlet-title .fullscreen').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .reload').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .remove').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .config').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand').tooltip('destroy');

            portlet.remove();
        });

        // handle portlet fullscreen
        $('body').on('click', '.portlet > .portlet-title .fullscreen', function (e) {
            e.preventDefault();
            var portlet = $(this).closest(".portlet");
            if (portlet.hasClass('portlet-fullscreen')) {
                $(this).removeClass('on');
                portlet.removeClass('portlet-fullscreen');
                $('body').removeClass('page-portlet-fullscreen');
                portlet.children('.portlet-body').css('height', 'auto');
                portlet.find('.chart-holder').css('height', '400px');
            } else {
                var height = Portal.getViewPort().height -
                    portlet.children('.portlet-title').outerHeight() -
                    parseInt(portlet.children('.portlet-body').css('padding-top')) -
                    parseInt(portlet.children('.portlet-body').css('padding-bottom'));

                portlet.find('.chart-holder').css('height', height + 'px');

                $(this).addClass('on');
                portlet.addClass('portlet-fullscreen');
                $('body').addClass('page-portlet-fullscreen');
                portlet.children('.portlet-body').css('height', height);
            }
            window.dispatchEvent(new Event('resize'));
        });

        $('body').on('click', '.reporting-portlet > .portlet-title > .tools > a.reload', function (e) {
            e.preventDefault();
            var el = $(this).closest(".portlet").children(".portlet-body");
            var url = $(this).data("url");
            var error = $(this).attr("data-error-display");

            data = $('#filter-form').serializeArray();
            data2 = $('#report-form-' + $(this).data('report-id')).serializeArray();

            if (url) {
                Portal.rawAjaxRequest(url, data.concat(data2), el, function (response) {
                    $('#dash-chart-' + response.dashblock + ' .portlet-body').html(response.content);
                    if (TableEditable) {
                        TableEditable.init();
                        Index.handleTableExport();
                    }
                });
            }
        });

        $('body').on('click', '.reporting-portlet > .portlet-title > .tools > a.expand', function (e) {
            $(this).closest('.tools').find('.reload').click();
            $(this).parent().parent().addClass('open');
        });

        // handle reporting portlet title click
        $('body').on('click', '.reporting-portlet > .portlet-title > .caption', function (e) {
            $(this).parent().find('.tools').find('.collapse,.expand').click();
        });

        $('body').on('click', '.reporting-portlet > .portlet-title', function (e) {
            var target = $(e.target);
            if (target.hasClass('portlet-title')) {
                $(this).find('.tools').find('.collapse,.expand').click();
            }
        });

        $('body').on('click', '.portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand', function (e) {
            e.preventDefault();
            var el = $(this).closest(".portlet").children(".portlet-body");
            if ($(this).hasClass("collapse")) {
                $(this).removeClass("collapse").addClass("expand");
                el.slideUp(200);
                $(this).parent().parent().removeClass('open').addClass('closed');
            } else {
                $(this).removeClass("expand").addClass("collapse");
                el.slideDown(200);
                $(this).parent().parent().addClass('open').removeClass('closed');
            }
        });
    };

    // Handles custom checkboxes & radios using jQuery Uniform plugin
    var handleUniform = function () {
        if (!$().uniform) {
            return;
        }
        var test = $("input[type=checkbox]:not(.toggle, .make-switch, .icheck), input[type=radio]:not(.toggle, .star, .make-switch, .icheck)");
        if (test.size() > 0) {
            test.each(function () {
                if ($(this).parents(".checker").size() === 0) {
                    $(this).show();
                    $(this).uniform();
                }
            });
        }
    };

    var handleDatePicker = function () {
        //init datepickers
        $('.date-picker').datepicker({
            rtl: Portal.isRTL(),
            autoclose: true
        });

        //init datetimepickers
        $(".datetime-picker").datetimepicker({
            isRTL: Portal.isRTL(),
            autoclose: true,
            todayBtn: true,
            pickerPosition: (Portal.isRTL() ? "bottom-right" : "bottom-left"),
            minuteStep: 10
        });
    }

    // Handles Bootstrap Tabs.
    var handleTabs = function () {
        //activate tab if tab id provided in the URL
        if (location.hash) {
            var tabid = location.hash.substr(1);
            $('a[href="#' + tabid + '"]').parents('.tab-pane:hidden').each(function () {
                var tabid = $(this).attr("id");
                $('a[href="#' + tabid + '"]').click();
            });
            $('a[href="#' + tabid + '"]').click();
        }

        //state tabs across page navigation
        $(function () {
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                if ($.fn.dataTable) {
                    var tables = $.fn.dataTable.tables(true);
                    $(tables).DataTable().columns.adjust();
                }
                // save the latest tab; use cookies if you like 'em better:
                localStorage.setItem('lastTab', $(this).attr('href'));
            });

            // go to the latest tab, if it exists:
            var lastTab = localStorage.getItem('lastTab');
            if (lastTab) {
                $('[href="' + lastTab + '"]').tab('show');
            }
        });
    };

    // Handles Bootstrap Modals.
    var handleModals = function () {
        // fix stackable modal issue: when 2 or more modals opened, closing one of modal will remove .modal-open class.
        $('body').on('hide.bs.modal', function () {
            if ($('.modal:visible').size() > 1 && $('html').hasClass('modal-open') === false) {
                $('html').addClass('modal-open');
            } else if ($('.modal:visible').size() <= 1) {
                $('html').removeClass('modal-open');
            }
        });

        // fix page scrollbars issue
        $('body').on('show.bs.modal', '.modal', function () {
            if ($(this).hasClass("modal-scroll")) {
                $('body').addClass("modal-open-noscroll");
            }
        });

        // fix page scrollbars issue
        $('body').on('hide.bs.modal', '.modal', function () {
            $('body').removeClass("modal-open-noscroll");
        });

        // remove ajax content and remove cache on modal closed
        $('body').on('hidden.bs.modal', '.modal:not(.modal-cached)', function () {
            $(this).removeData('bs.modal');
        });
    };

    // Handles Bootstrap Tooltips.
    var handleTooltips = function () {
        // global tooltips
        $('.tooltips').tooltip({
            delay: {
                show: 1000,
                hide: 0
            }
        });

        // portlet tooltips
        $('.portlet > .portlet-title .fullscreen').tooltip({
            container: 'body',
            title: 'Fullscreen'
        });
        $('.portlet > .portlet-title > .tools > .reload').tooltip({
            container: 'body',
            title: 'Reload'
        });
        $('.portlet > .portlet-title > .tools > .remove').tooltip({
            container: 'body',
            title: 'Remove'
        });
        $('.portlet > .portlet-title > .tools > .config').tooltip({
            container: 'body',
            title: 'Settings'
        });
        $('.portlet > .portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand').tooltip({
            container: 'body',
            title: 'Collapse/Expand'
        });
    };

    // Handles Bootstrap Dropdowns
    var handleDropdowns = function () {
        /*
         Hold dropdown on click
         */
        $('body').on('click', '.dropdown-menu.hold-on-click', function (e) {
            e.stopPropagation();
        });
    };

    var handleAlerts = function () {
        $('body').on('click', '[data-close="alert"]', function (e) {
            $(this).parent('.alert').hide();
            $(this).closest('.note').hide();
            e.preventDefault();
        });

        $('body').on('click', '[data-close="note"]', function (e) {
            $(this).closest('.note').hide();
            e.preventDefault();
        });

        $('body').on('click', '[data-remove="note"]', function (e) {
            $(this).closest('.note').remove();
            e.preventDefault();
        });
    };

    // Handle Hower Dropdowns
    var handleDropdownHover = function () {
        $('[data-hover="dropdown"]').not('.hover-initialized').each(function () {
            $(this).dropdownHover();
            $(this).addClass('hover-initialized');
        });
    };

    // Handles Bootstrap Popovers

    // last popep popover
    var lastPopedPopover;

    var handlePopovers = function () {
        $('.popovers').popover({trigger: "hover focus", placement: "top"});

        // close last displayed popover

        $(document).on('click.bs.popover.data-api', function (e) {
            if (lastPopedPopover) {
                lastPopedPopover.popover('hide');
            }
        });
    };

    // Fix input placeholder issue for IE8 and IE9
    var handleFixInputPlaceholderForIE = function () {
        //fix html5 placeholder attribute for ie7 & ie8
        if (isIE8 || isIE9) { // ie8 & ie9
            // this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
            $('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function () {
                var input = $(this);

                if (input.val() === '' && input.attr("placeholder") !== '') {
                    input.addClass("placeholder").val(input.attr('placeholder'));
                }

                input.focus(function () {
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });

                input.blur(function () {
                    if (input.val() === '' || input.val() == input.attr('placeholder')) {
                        input.val(input.attr('placeholder'));
                    }
                });
            });
        }
    };

    // Handle Select2 Dropdowns
    var handleSelect2 = function () {
        if ($().select2) {
            $('.select2me').select2({
                placeholder: $(this).data('placeholder'),
                allowClear: true
            });
        }
    };

    var handleAjaxError = function () {
        $(document).ajaxError(function (e, jqXHR, settings, exception) {
            if (jqXHR.status == 500) {
                data = JSON.parse(jqXHR.responseText);
                toastr.error(data.error.message, data.error.type);
            } else if (jqXHR.status == 302) {
                toastr.error("Unable to follow route, please try again.");
                setTimeout(function () {
                    location.href = BASE_URL + '/user/login';
                }, 2000);
            }
        });
    }

    var handleShortcuts = function () {
    }

    var handleFilterLoading = function () {
        if ($('select.populate-select').length) {
            function handlePopulateSelect(block) {
                var $url = block.attr('data-url');
                // custom filter id
                var filterId = block.attr('data-filterid');

                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: $url,
                    async: true,
                    beforeSend: function (xhr) {
                    }
                }).done(function (data) {
                    if (filterId) {
                        data.filterId = filterId;
                    }
                    $('#filter-' + data.filterId).html(data.content).addClass('loaded');
                    $('#filter-' + data.filterId).select2("val", $('#filter-' + data.filterId).attr('data-value'));
                });
            };
            $('select.populate-select').each(function () {
                if ($(this).attr('id')) {
                    // allow refreshing identifiable select inputs
                    $(document).off('refresh', 'select#' + $(this).attr('id'))
                        .on('refresh', 'select#' + $(this).attr('id'), function() {
                            handlePopulateSelect($(this))
                        });
                }
                handlePopulateSelect($(this))
            });
        }
    }

    var handleToastr = function () {
        if (!toastr)
            return;

        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": true,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    }

    //* END:CORE HANDLERS *//

    return {

        //main function to initiate the theme
        init: function () {
            //Core handlers
            handleAjaxError();
            handleInit(); // initialize core variables
            handleOnResize(); // set and handle responsive
            handleTabs();

            //UI Component handlers
            handleSelect2(); // handle custom Select2 dropdowns
            handlePortletTools(); // handles portlet action bar functionality(refresh, configure, toggle, remove)
            handleAlerts(); //handle closabled alerts
            handleDropdowns(); // handle dropdowns
            handleTooltips(); // handle bootstrap tooltips
            handlePopovers(); // handles bootstrap popovers
            handleModals(); // handle modals
            handleToastr();
            handleUniform();
            handleFilterLoading();

            Portal.initComponentState();
            // Hacks
            handleFixInputPlaceholderForIE(); //IE8 & IE9 input placeholder issue fix
        },
        //main function to initiate core javascript after ajax complete
        initAjax: function () {
            handleUniform(); // handles custom radio & checkboxes
            handleSelect2(); // handle custom Select2 dropdowns
            handleDropdowns(); // handle dropdowns
            handleTooltips(); // handle bootstrap tooltips
            handlePopovers(); // handles bootstrap popovers
            handleTableExport();
        },

        //init main components
        initComponents: function () {
            this.initAjax();
        },

        //public function to remember last opened popover that needs to be closed on click
        setLastPopedPopover: function (el) {
            lastPopedPopover = el;
        },

        //public function to add callback a function which will be called on window resize
        addResizeHandler: function (func) {
            resizeHandlers.push(func);
        },

        //public functon to call _runresizeHandlers
        runResizeHandlers: function () {
            _runResizeHandlers();
        },
        // Attach controls to dataset selector
        attachControls: function () {
            $('.amChartsDataSetSelector').append($('#milti-limit'));
        },
        // wrPortaler function to scroll(focus) to an element
        scrollTo: function (el, offeset) {
            var pos = (el && el.size() > 0) ? el.offset().top : 0;

            if (el) {
                if ($('body').hasClass('page-header-fixed')) {
                    pos = pos - $('.page-header').height();
                }
                pos = pos + (offeset ? offeset : -1 * el.height());
            }

            $('html,body').animate({
                scrollTop: pos
            }, 'slow');
        },

        initSlimScroll: function (el) {
        },
        destroySlimScroll: function (el) {
        },
        scrollTop: function () {
            Portal.scrollTo();
        },
        blockUI: function (options) {
            options = $.extend(true, {}, options);
            var html = '';

            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="spinner"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div></div>' + '</div>';

            if (options.target) { // element blocking
                var el = $(options.target);
                if (el.height() <= ($(window).height())) {
                    options.cenrerY = true;
                }
                el.block({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                    css: {
                        top: '10%',
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            } else { // page blocking
                $.blockUI({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    css: {
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            }
        },

        // wrPortaler function to  un-block element(finish loading)
        unblockUI: function (target) {
            if (target) {
                $(target).unblock({
                    onUnblock: function () {
                        $(target).css('position', '');
                        $(target).css('zoom', '');
                    }
                });
            } else {
                $.unblockUI();
            }
        },

        alert: function (options) {

            options = $.extend(true, {
                container: "", // alerts parent container(by default placed after the page breadcrumbs)
                place: "append", // "append" or "prepend" in container
                type: 'success', // alert's type
                message: "", // alert's message
                close: true, // make alert closable
                reset: true, // close all previouse alerts first
                focus: true, // auto scroll to the alert after shown
                closeInSeconds: 0, // auto close after defined seconds
                icon: "" // put icon before the message
            }, options);

            var id = Portal.getUniqueID("Portal_alert");

            var html = '<div id="' + id + '" class="Portal-alerts alert alert-' + options.type + ' fade in">' + (options.close ? '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>' : '') + (options.icon !== "" ? '<i class="fa-lg fa fa-' + options.icon + '"></i>  ' : '') + options.message + '</div>';

            if (options.reset) {
                $('.Portal-alerts').remove();
            }

            if (!options.container) {
                if ($('body').hasClass("page-container-bg-solid")) {
                    $('.page-title').after(html);
                } else {
                    if ($('.page-bar').size() > 0) {
                        $('.page-bar').after(html);
                    } else {
                        $('.page-breadcrumb').after(html);
                    }
                }
            } else {
                if (options.place == "append") {
                    $(options.container).append(html);
                } else {
                    $(options.container).prepend(html);
                }
            }

            if (options.focus) {
                Portal.scrollTo($('#' + id));
            }

            if (options.closeInSeconds > 0) {
                setTimeout(function () {
                    $('#' + id).remove();
                }, options.closeInSeconds * 1000);
            }

            return id;
        },

        // initializes uniform elements
        initUniform: function (els) {
            if (els) {
                $(els).each(function () {
                    if ($(this).parents(".checker").size() === 0) {
                        $(this).show();
                        $(this).uniform();
                    }
                });
            } else {
                handleUniform();
            }
        },

        //wrPortaler function to update/sync jquery uniform checkbox & radios
        updateUniform: function (els) {
            $.uniform.update(els); // update the uniform checkbox & radios UI after the actual input control state changed
        },

        //public helper function to get actual input value(used in IE9 and IE8 due to placeholder attribute not supported)
        getActualVal: function (el) {
            el = $(el);
            if (el.val() === el.attr("placeholder")) {
                return "";
            }
            return el.val();
        },

        //public function to get a paremeter by name from URL
        getURLParameter: function (paramName) {
            var searchString = window.location.search.substring(1),
                i, val, params = searchString.split("&");

            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }
            return null;
        },

        // check for device touch support
        isTouchDevice: function () {
            try {
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                return false;
            }
        },

        initComponentState: function () {

        },

        // To get the correct viewport width based on  http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
        getViewPort: function () {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }

            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },

        getUniqueID: function (prefix) {
            return 'prefix_' + Math.floor(Math.random() * (new Date()).getTime());
        },

        // check IE8 mode
        isIE8: function () {
            return isIE8;
        },

        // check IE9 mode
        isIE9: function () {
            return isIE9;
        },

        //check RTL mode
        isRTL: function () {
            return isRTL;
        },

        getResponsiveBreakpoint: function (size) {
            // bootstrap responsive breakpoints
            var sizes = {
                'xs': 480,     // extra small
                'sm': 768,     // small
                'md': 900,     // medium
                'lg': 1200     // large
            };

            return sizes[size] ? sizes[size] : 0;
        },
        ajaxRequest: function (url, data, callback) {
            Portal.blockUI({animate: true, target: ".form-wizard"});
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "json",
                success: function (response) {
                    if (response.response.code === "-1") {
                        toastr.success(response.response.desc);
                    } else {
                        toastr.error(response.response.desc);
                    }
                    Portal.unblockUI(".form-wizard");
                    callback(response);
                },
                error: function (response) {
                    toastr.error(response.responseJSON.error.message);
                    Portal.unblockUI(".form-wizard");
                }
            });
        },
        rawAjaxRequest: function (url, data, target, callback) {
            Portal.blockUI({animate: true, target: target});
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "json",
                success: function (response) {
                    Portal.unblockUI(target);
                    callback(response);
                },
                error: function (response) {
                    //toastr.error("An error occured performing the request, please try again later.");
                    Portal.unblockUI(target);
                }
            });
        },
        wigroupSpinner: '<div class="spinner"><div class="circle1"></div>'
        + '<div class="circle2"></div><div class="circle3"></div></div>'
    };

}();

Portal.globalHandleHelpModal = function () {
    $(document).off('click', 'a.portal-help-btn')
        .on('click', 'a.portal-help-btn', function(e) {
            $(window).resize(Portal.globalHandleOverflowColumns);

            $("#ajax .modal-content").prop('outerHTML', $('script#portal-help-modal-content-template').html());

            $('#ajax').modal({
                backdrop: 'static',
                keyboard: false
            });

            $(document).off('hidden.bs.modal', '#ajax')
                .on('hidden.bs.modal', '#ajax', function (e) {
                    $('html').removeClass('overflow-disabled-tmp');
                    $("#ajax .modal-content").removeClass('portal-help-modal');
                });

            return false;
        });
};

// Handle overflowing columns
// `data-bottom-offset` refers to the space to be left below/bottom of
// the overflowing div to account for visible divs like pagination.
// `data-content-extra-height` accounts for extra rows in the overflowing
// div, like dropdown action menus, also accounts for using div contents'
// height (missing the overflowing div's properties, margin, padding etc).
Portal.globalHandleOverflowColumns = function (event, fixPadding) {
    $('div.dataTables_scrollBody, div.overflow-y').each(function (index, block) {
        block = $(block);

        if (block.find('.skip-overflow-handle').length) {
            return ;
        }

        var contentExtraHeight,
            contentBottomOffset,
            overflowingTable;

        if (block.hasClass('dataTables_scrollBody')) {
            overflowingTable = $(this).find('table');
            contentExtraHeight = overflowingTable.attr('data-content-extra-height');
            contentBottomOffset = overflowingTable.attr('data-bottom-offset');
        } else {
            contentExtraHeight = $(block).attr('data-content-extra-height');
            contentBottomOffset = $(block).attr('data-bottom-offset');
        }
        // contents height
        var contentsHeight = 0;
        // overflowing div's height
        var blockHeight = $(window).height();
        // calculate contents height
        $.each(block.children(), function (index, child) {
            // skip perfect scrollbar elements
            if (!$(child).hasClass('ps-scrollbar-y-rail') && !$(child).hasClass('ps-scrollbar-x-rail')) {
                contentsHeight += $(child).height();
            }
        });
        // account for overflowing div padding etc in contents height
        if (contentExtraHeight) {
            contentsHeight += parseInt(contentExtraHeight);
        }
        // height to leave for visible divs below (pagination etc)
        var _bottom = 0;
        if (contentBottomOffset) {
            _bottom = parseInt(contentBottomOffset);
        } else {
            // don't touch bottom frame if offset not set
            _bottom = 20;
        }
        // overflowing div adjusted for top and bottom heights
        var adjustedHeight = blockHeight - (block.offset().top + _bottom);

        // if the div is not overflowing (`adjustedHeight > contentsHeight`)
        // and there are elements below the div, use the contents height so not
        // to display the elements below further down the overflowing div
        if (contentBottomOffset && contentsHeight != 0
            && adjustedHeight > contentsHeight) {
            adjustedHeight = contentsHeight;
        }
        // lock overflowing div to height
        if ($(this).hasClass('dataTables_scrollBody')) {
            if (overflowingTable.length) {
                overflowingTable = overflowingTable.DataTable();
                overflowingTable.settings()[0].oScroll.sY = (adjustedHeight - 50) + 'px';
            }
            block.height(adjustedHeight);
        } else {
            block.height(adjustedHeight);
        }
    });
};