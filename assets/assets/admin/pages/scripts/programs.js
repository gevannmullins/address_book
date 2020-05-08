
var Programs = function () {

    // Current favourite program
    var favouriteProgramId = $('#selectProgram span').attr('data-favourite-id');

    // Reload programs table
    $(document).off('click', "#ajax a.programs-refresh")
        .on('click', "#ajax a.programs-refresh", function() {
            $(this).removeClass('fa-spin');
            if ($("#programs-table").length) {
                $("#programs-table").DataTable().draw();
            } else {
                $('div.top-menu a#selectProgram').trigger('click');
            }
    });

    // Trigger table filtering, works by re-drawing
    $(document).on('submit', 'form#programs-filter-form', function(e) {
        $("#programs-table").DataTable().draw();
        return false;
    });

    $(document).off('click', 'div.top-menu a#selectProgram')
        .on('click', 'div.top-menu a#selectProgram', function(e) {

            var programsModalTitle = 'Please select a Program&nbsp;&nbsp;&nbsp;'
                + '<a class="fa fa-refresh programs-refresh"></a>'
            var activeButton = $(this);
            $("#ajax .modal-content").html($('script#modal-content-template').html());
            $("#ajax .modal-content").find('h4.modal-title').html(programsModalTitle);
            if ($(this).find(' > span').attr('data-id')) {
                $('#ajax .modal-header button.close').hide()
            }
            $('#ajax').modal({
                backdrop: 'static',
                keyboard: false
            });
            if (!activeButton.find(' > span').attr('data-id')) {
                jQuery('#ajax .modal-header button.close').hide()
            }
            var data = {};
            $.get(BASE_URL + '/programs', data, function(resp) {
                $('html, body').animate({scrollTop: 0}, 'slow');
                $('html').addClass('overflow-disabled-tmp');
                $("#ajax .modal-content").html(resp);
                $("#ajax .modal-content").find('h4.modal-title > span').html(programsModalTitle);
                setTimeout(function() { Programs.init(); }, 300);
                if (!activeButton.find(' > span').attr('data-id')) {
                    $('#ajax .modal-header button.close').hide()
                }
                $('#ajax').on('hidden.bs.modal', function (e) {
                    $('html').removeClass('overflow-disabled-tmp');
                });
            });
        });

    $(document).off('click', 'div.programs-select-user').on('click', 'div.programs-select-user', function(e) {
        $('div.top-menu a#selectUser').trigger('click');
    });

    $(document).on({
        mouseenter: function(){
            $(this).find('i').removeClass('fa-star-o').addClass('fa-star');
        },
        mouseleave: function(){
            if (!$(this).find('i').hasClass('selected')) {
                $(this).find('i').removeClass('fa-star').addClass('fa-star-o');
            }
        }
    }, "table#programs-table tr td:first-child a.favorite");

    $(document).off('click', 'table#programs-table tbody tr a.favorite')
        .on('click', 'table#programs-table tbody tr a.favorite', function(e) {

            var programsDataTable =  $("table#programs-table").DataTable();
            var selectedData = programsDataTable.row($(this).closest('tr')).data();
            var url = BASE_URL + "/programs/setfavourite";

            selectedData['currentFavourite'] = favouriteProgramId;

            Portal.rawAjaxRequest(url, selectedData, "#ajax .modal-content", function (response) {
                if (response['code'] == '-1') {
                    if (favouriteProgramId == selectedData['id']) {
                        favouriteProgramId = null;
                        toastr.success('Program unmarked as favourite', 'Success');
                    } else {
                        favouriteProgramId = selectedData['id'];
                        toastr.success('Program marked as favourite', 'Success');
                    }
                    $('.programs-content .pagination li.active a').trigger('click');
                } else {
                    toastr.error(response['desc'], 'Error');
                }
            });
        });

    return {
        init: function () {
            $(window).resize(Portal.globalHandleOverflowColumns);

            // select session program
            $(document).off('click', 'table#programs-table tbody tr.clickable')
                .on('click', 'table#programs-table tbody tr.clickable', function(e) {
                if (e.target.tagName != 'TD') {
                    // probably clicked button to edit program row
                    return false;
                }
                var programsDataTable =  $("table#programs-table").DataTable();
                var selectedData = programsDataTable.row($(this).closest('tr')).data();
                var url = BASE_URL + "/programs/setprogram";

                Portal.rawAjaxRequest(url, selectedData, "#ajax .modal-content", function (response) {
                    toastr.success('Applying selected program', 'Success');
                    window.location.reload(true);
                });
            });

            // listing split view
            $(document).on('click', 'table#programs-table tbody tr a.btn-edit, a.programs-create', function(e) {
                var programsDataTable =  $("table#programs-table").DataTable();
                var formBlock = $('div.split-display-column:eq(0)').next();
                $('div.split-display-column:eq(0)').removeClass('col-sm-12').addClass('col-sm-7');
                formBlock.html($('script#create-edit-program').html());

                if ($(this).hasClass('btn-edit')) {
                    var selectedData = programsDataTable.row($(this).closest('tr')).data();
                    if (selectedData === undefined) {
                        var programsDataTable =  $("table#programs-table").DataTable();
                        programsDataTable =  $("table#programs-table").DataTable();
                    }
                    formBlock.find('> div > h3').text('Edit Program - ' + selectedData.name);
                    formBlock.find('input[name=id]').val(selectedData.id);
                    formBlock.find('input[name=name]').val(selectedData.name);
                    formBlock.find('select[name=state]').val(selectedData.state)
                    formBlock.find('input[name=visible]').attr('checked', selectedData.visible);
                    formBlock.find('select[name=programTypeId]').val(selectedData.programTypeId)
                        .attr('disabled', true);
                    formBlock.find('button[type=submit]').text('Save');
                } else {
                    formBlock.find('select[name=state]').closest('div.form-group').remove();
                }
                $('div.split-display-column:eq(0)').next().removeClass('hidden');

                $(window).trigger('resize');
            });

            $(document).on('click', '.programs-content .split-display-column button.close', function(e) {
                var formColumn = $(this).closest('.split-display-column');
                formColumn.addClass('hidden');
                formColumn.prev().addClass('col-sm-12').removeClass('col-sm-7');

                $(window).trigger('resize');
            });

            // validate programs form
            $(document).off('submit', 'form#save-program-form')
                .on('submit', 'form#save-program-form', function() {
                // remove previous errors
                $('div.has-error .help-inline').remove();
                $('div.has-error').removeClass('has-error');
                var that = this,
                    data = {},
                    url = BASE_URL + "/programs/create",
                    errors;
                var constraints = {
                    name: {presence: true},
                    programTypeId: {presence: true}
                }
                $(this).serializeArray().map(function(x){ data[x.name] = x.value; });

                data['visible'] = (data['visible'] == 'on') ? 1: 0;
                if (data['id']) {
                    delete constraints['programTypeId'];
                }
                data['_token'] = _portalCsrfToken;

                errors = validate(data, constraints);
                if (typeof errors === 'undefined') {
                    errors = {};
                }

                $.each(errors, function(index, error) {
                    var fieldObject = $(that).find('input[name=' + index + ']');
                    fieldObject.after('<div class="help-inline">' + error[0] + '</div>');
                    fieldObject.closest('.form-group').addClass('has-error');
                });

                if (!$.isEmptyObject(errors)) {
                    return false;
                }
                // Disable all inputs
                $(this).find('input, select').attr('disabled', true);

                $('#save-program-form .spinner').removeClass('hidden');

                if (data['id']) {
                    url = BASE_URL + "/programs/" + data['id'] + "/edit";
                }

                $.post(url, data, function(resp) {
                    $('#save-program-form .spinner').addClass('hidden');
                    if (resp['code'] == -1) {
                        $('#save-program-form').closest('.split-display-column').addClass('hidden');
                        $('div.split-display-column:eq(0)').addClass('col-sm-12').removeClass('col-sm-7');
                        //
                        $('.programs-content .pagination li.active a').trigger('click');

                        if (data['id']) {
                            toastr.success('Updated program', 'Success');
                        } else {
                            toastr.success('Created program', 'Success');
                        }
                    } else {
                        if (data['id']) {
                            $(that).find('input, select[name=state]').removeAttr('disabled');
                        } else {
                            $(that).find('input, select').removeAttr('disabled');
                        }
                        toastr.error(resp['desc'], 'Error');
                    }
                }, 'json');

                return false;
            });

            var portalProgramTypes = {};
            var programsFormBlock =  $($('script#create-edit-program').html());
            var programTypes = programsFormBlock.find('select[name=programTypeId] option');
            $.each(programTypes, function(index, option) {
                option = $(option);
                portalProgramTypes[option.attr('value')] = option.text();
            });

            var programsTableColumns = [
                {"data": "id"},
                {"data": "name"},
                {"data": "visible"},
                {"data": "state"}
            ];

            var programsTableColumnDefs = [
                {
                    "render": function (data, type, row) {
                        var favClasses = 'fa-star-o';
                        if (favouriteProgramId == data) {
                            favClasses = 'fa-star selected';
                        }

                        data = ' <a class="favorite"><i class="fa ' + favClasses + '"></i></a>' + data;
                        return data;
                    },
                    "targets": [0]
                },
                {
                    "render": function (data, type, row) {
                        if (data == true) {
                            return 'Yes'
                        } else {
                            return 'No'
                        }
                    },
                    "targets": [2]
                },
                {
                    "render": function (data, type, row) {
                        var blockContent;
                        if (data == 'A') {
                            blockContent = '<span>Active</span>'
                        } else {
                            blockContent = '<span class="deactivated">Deactivated</span>'
                        }

                        return blockContent;
                    },
                    "targets": [3]
                },
                {
                    "targets"  : 'no-sort',
                    "orderable": false
                }
            ];
            if (!userIsAdmin) {
                programsTableColumns.push({"data": "id"});
                programsTableColumnDefs.push({
                    "render": function (data, type, row) {
                        var actions = "",
                            buttonLabel = 'Edit';
                        actions = actions.concat('<a data-id="' + data + '" class="btn btn-sm btn-primary btn-edit" href="javascript:void(0)">' + buttonLabel + '</a>');

                        return actions;
                    },
                    "targets": [4]
                });
            }

            // programs listing
            var portalProgramsGrid = new Datatable();
            portalProgramsGrid.init({
                "src": $("#programs-table"),
                loadingMessage: 'Loading...',
                "dataTable": {
                    "processing": false,
                    "serverSide": true,
                    "dom": "<'row'<'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-sm-7'p><'col-sm-5'l>>",
                    "lengthMenu": [10, 20, 50, 75, 100, 250],
                    "scrollY": "20px",
                    "pageLength": 20,
                    "stateSave": false,
                    // "autoWidth": true,
                    "pagingType": "full_numbers",
                    "paging": true,
                    "language": {
                        "paginate": {
                            "previous": "Previous",
                            "next": "Next",
                            'last': null,
                            'first': null
                        },
                        "emptyTable": "No programs found.",
                        "lengthMenu": "_MENU_ records per page"
                    },
                    "columns": programsTableColumns,
                    "columnDefs": programsTableColumnDefs,
                    "ajax": {
                        "url": BASE_URL + "/programs/data",
                        "method": "GET"
                    },
                    "createdRow": function( row, data, dataIndex ) {
                        $(row).addClass( 'clickable' );
                    },
                    "extraBlockedTableContainer": 'div.table-container',
                    "extraTableFilters": {
                        "filtersContainer": 'form#programs-filter-form',
                        "filterNames": ['programName']
                    },
                    'extraDrawCallback': function(settings) {
                        $(window).trigger('resize');
                        // Search focus
                        $('#ajax input[name=programName]:first').focus();
                    }
                }
            });
        }
    };

}();
