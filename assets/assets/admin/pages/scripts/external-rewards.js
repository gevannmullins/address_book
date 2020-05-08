var ExternalRewards = function () {

    return {

        modal: function () {

            $(document).off('click', 'a.btn-test')
                .on('click', 'a.btn-test', function (e) {

                    $("#ajax .modal-content").prop('outerHTML', $('script#modal-content-template').html());

                    $('#ajax').modal({
                        backdrop: 'static',
                        keyboard: false
                    });

                    var data = externalReward;
                    $.get(BASE_URL + '/external-rewards/test', data, function (resp) {
                        $('html, body').animate({scrollTop: 0}, 'slow');
                        $("#ajax .modal-content").prop('outerHTML', resp);

                    });

                });

            $(document).off('click', 'a.campaign-help')
                .on('click', 'a.campaign-help', function (e) {

                    $("#ajax .modal-content").prop('outerHTML', $('script#modal-content-template').html());

                    $('#ajax').modal({
                        backdrop: 'static',
                        keyboard: false
                    });

                    var data = {};
                    $.get(BASE_URL + '/external-rewards/help', data, function (resp) {
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
                        .on('slid.bs.carousel', '#ajax', function (e) {
                            $(window).trigger('resize');
                        });

                    $(document).off('slide.bs.carousel', '#ajax')
                        .on('slid.bs.carousel', '#ajax', function (e) {
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
        },
        init: function () {
            $(window).resize(Portal.globalHandleOverflowColumns);

            // channels listing
            grid = new Datatable();

            var externalRewardColumns = [
                {"data": "id"},
                {"data": "name"},
                {"data": "externalRewardUrl"},
                {"data": "supplierRewardId"},
                {"data": "createDate"},
                {"data": "lastModifiedDate"},
                {"data": "state"}
            ];

            var externalRewardColumnDefs = [
                {
                    "render": function (data, type, row) {
                        if (data == 'A') {
                            return '<span>Active</span>'
                        } else {
                            return '<span class="deactivated">Deactivated</span>'
                        }
                    },
                    "targets": [6]
                },
                {
                    "targets": 'no-sort',
                    "orderable": false
                }
            ];

            externalRewardColumns.push({"data": "id"});

            externalRewardColumnDefs.push(
                {
                    "render": function (data, type, row) {
                        var actions = '<a href="' + BASE_URL + '/external-rewards/' + row.id + '/edit?state=' + row.state + '" class="btn btn-sm btn-primary">Edit</a>';

                        return actions;
                    },
                    "targets": [7]
                }
            );

            grid.init({
                "src": $("#extrernalrewards-table"),
                loadingMessage: 'Loading...',
                "dataTable": {
                    "serverSide": true,
                    "sDom": "<''<'col-sm-10'<'toolbar'>><'col-sm-2'l>r>t<''<'col-sm-6'p><'col-sm-6'i>>",
                    "lengthMenu": [10, 20, 50, 75, 100, 250],
                    "scrollY": "20px",
                    "pageLength": 20,
                    "stateSave": true,
                    "pagingType": "full_numbers",
                    "paging": true,
                    deferRender: true,
                    "language": {
                        "paginate": {
                            "previous": "Previous",
                            "next": "Next",
                            'last': null,
                            'first': null
                        },
                        "emptyTable": "No external rewards found.",
                        "lengthMenu": "_MENU_ records per page"
                    },
                    "columns": externalRewardColumns,
                    "columnDefs": externalRewardColumnDefs,
                    "ajax": {
                        "url": BASE_URL + "/external-rewards/data",
                        "method": "GET"
                    },
                    "createdRow": function (row, data, dataIndex) {
                        $(row).addClass('clickable');
                    },
                    "extraTableFilters": {
                        "filtersContainer": 'form#externalrewards-filter-form',
                        "filterNames": ['state']
                    },
                    "extraBlockedTableContainer": 'div.table-container',
                    'extraDrawCallback': function (settings) {
                        $(window).trigger('resize');
                    }
                }
            });


            // Trigger table filtering, works by re-drawing
            $(document).on('submit', 'form#externalrewards-filter-form', function (e) {
                $("#extrernalrewards-table").DataTable().draw()
                return false;
            });

            var filterTable = $('div.custom-table-filter').detach();
            $("div.toolbar").append(filterTable);
        }
    };
}();
