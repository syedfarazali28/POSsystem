$(document).ready(function () {

    GetRoles_DDL();
    GetForms();

    $('#selectrole').on('change', function (e) {
        $('input:checkbox:checked').prop('checked', false);
        var selected_value = $(this).val();
        if (selected_value !== '') {
            GetMapping(selected_value);
        }
    });

    $('#SaveBtn').on('click', function () {
        UpdateRolesMapping();
    });


});

function GetRoles_DDL() {
    new APICALL(GetGlobalURL('Base', 'GetRoles'), 'GET', '', true).FETCH((result, error) => {

        if (result) {
            if (result.data != null) {
                $.each(result.data, function (i, option) {
                    $('#selectrole').append(
                        '<option value="' + option.RoleID + '">' + option.RoleName + '</option>'
                    );
                });
            }
        }
        if (error) {

            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: error.data.responseText,
                footer: ''
            });
        }
    });
}

function GetForms() {
    ShowLoader('RolesMappingDiv');
    UTILITY.CheckSession((data_) => {

        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetForms'), 'GET', '', true).FETCH((result, error) => {

                if (result) {
                    if (result.data != null) {

                        $('#addmoretable').DataTable().clear().destroy();
                        $.each(result.data, function (i, option) {
                            try {

                                var AllowInsert = option.AllowInsert == true ? '<td><input type="checkbox" checked="checked" class="Insert checkboxsize" FormID="' + option.FormID + '"></td>' : '<td><input type="checkbox" class="Insert checkboxsize" FormID="' + option.FormID + '"></td>'
                                var AllowUpdate = option.AllowUpdate == true ? '<td><input type="checkbox" checked="checked" class="Update checkboxsize" FormID="' + option.FormID + '"></td>' : '<td><input type="checkbox" class="Update checkboxsize" FormID="' + option.FormID + '"></td>'
                                var AllowDelete = option.AllowDelete == true ? '<td><input type="checkbox" checked="checked" class="Delete checkboxsize" FormID="' + option.FormID + '"></td>' : '<td><input type="checkbox" class="Delete checkboxsize" FormID="' + option.FormID + '"></td>'

                                $('#addmoretable tbody').append(
                                    '<tr>' +
                                    '<td class="d-none">' + option.GroupName + '</td>' +
                                    '<td>' + option.FormDisplayName + '</td>' +
                                    '<td><input type="checkbox" class="View checkboxsize FormID-' + option.FormID + '"></td>' +
                                    //((data_[0].AllowInsert == true && data_[0].AllowUpdate == true && data_[0].AllowDelete == true) ? AllowInsert : '') +
                                    //((data_[0].AllowInsert == true && data_[0].AllowUpdate == true && data_[0].AllowDelete == true) ? AllowUpdate : '') +
                                    //((data_[0].AllowInsert == true && data_[0].AllowUpdate == true && data_[0].AllowDelete == true) ? AllowDelete : '') +
                                    ((true == true) ? AllowInsert : '') +
                                    ((true == true) ? AllowUpdate : '') +
                                    ((true == true) ? AllowDelete : '') +
                                    '</tr>'
                                );
                            }
                            catch (ex) {
                                alert(ex);
                            }
                        });
                        UTILITY._AccessEventHandler_RolesMapping($('input:checkbox'));

                        $('#addmoretable').DataTable({

                            paging: false,
                            searching: false,
                            order: [[0, 'asc']],
                            rowGroup: {
                                dataSrc: 0
                            }
                        });

                    }
                    HideLoader('RolesMappingDiv');
                }
                if (error) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: error.data.responseText,
                        footer: ''
                    });
                }
            });
        }
    });
}

function GetMapping(RoleID) {
    ShowLoader('RolesMappingDiv');
    UTILITY.CheckSession((data_) => {

        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetMapping_2?RoleId=' + RoleID), 'GET', '', true).FETCH((result, error) => {

                if (result) {
                    if (result.data != null) {


                        $('#accessedtable').DataTable().clear().destroy();
                        $('#addmoretable').DataTable().clear().destroy();

                        $('#accessedtable tbody').html('');
                        $('#addmoretable tbody').html('');

                        $.each(result.data, function (i, option) {
                            if (option.IsView.toString() == 'true' || option.IsView.toString() == '1') {
                                var AllowInsert = option.AllowInsert == true ? '<td><input type="checkbox" checked="checked" class="Insert checkboxsize" FormID="' + option.FormID + '"></td>' : '<td><input type="checkbox" class="Insert checkboxsize" FormID="' + option.FormID + '"></td>'
                                var AllowUpdate = option.AllowUpdate == true ? '<td><input type="checkbox" checked="checked" class="Update checkboxsize" FormID="' + option.FormID + '"></td>' : '<td><input type="checkbox" class="Update checkboxsize" FormID="' + option.FormID + '"></td>'
                                var AllowDelete = option.AllowDelete == true ? '<td><input type="checkbox" checked="checked" class="Delete checkboxsize" FormID="' + option.FormID + '"></td>' : '<td><input type="checkbox" class="Delete checkboxsize" FormID="' + option.FormID + '"></td>'

                                $('#accessedtable tbody').append(
                                    '<tr>' +
                                    '<td class="d-none">' + option.GroupName + '</td>' +
                                    '<td>' + option.FormDisplayName + '</td>' +
                                    '<td><input type="checkbox" checked class="View checkboxsize FormID-' + option.FormID + '"></td>' +
                                    //((data_[0].AllowInsert == true && data_[0].AllowUpdate == true && data_[0].AllowDelete == true) ? AllowInsert : '') +
                                    //((data_[0].AllowInsert == true && data_[0].AllowUpdate == true && data_[0].AllowDelete == true) ? AllowUpdate : '') +
                                    //((data_[0].AllowInsert == true && data_[0].AllowUpdate == true && data_[0].AllowDelete == true) ? AllowDelete : '') +
                                    ((true == true) ? AllowInsert : '') +
                                    ((true == true) ? AllowUpdate : '') +
                                    ((true == true) ? AllowDelete : '') +
                                    '</tr>'
                                );
                            }
                            else {
                                var AllowInsert = option.AllowInsert == true ? '<td><input type="checkbox" checked="checked" class="Insert checkboxsize" FormID="' + option.FormID + '"></td>' : '<td><input type="checkbox" class="Insert checkboxsize" FormID="' + option.FormID + '"></td>'
                                var AllowUpdate = option.AllowUpdate == true ? '<td><input type="checkbox" checked="checked" class="Update checkboxsize" FormID="' + option.FormID + '"></td>' : '<td><input type="checkbox" class="Update checkboxsize" FormID="' + option.FormID + '"></td>'
                                var AllowDelete = option.AllowDelete == true ? '<td><input type="checkbox" checked="checked" class="Delete checkboxsize" FormID="' + option.FormID + '"></td>' : '<td><input type="checkbox" class="Delete checkboxsize" FormID="' + option.FormID + '"></td>'
                                $('#addmoretable tbody').append(
                                    '<tr>' +
                                    '<td class="d-none">' + option.GroupName + '</td>' +
                                    '<td>' + option.FormDisplayName + '</td>' +
                                    '<td><input type="checkbox" class="View checkboxsize FormID-' + option.FormID + '"></td>' +
                                    //((data_[0].AllowInsert == true && data_[0].AllowUpdate == true && data_[0].AllowDelete == true) ? AllowInsert : '') +
                                    //((data_[0].AllowInsert == true && data_[0].AllowUpdate == true && data_[0].AllowDelete == true) ? AllowUpdate : '') +
                                    //((data_[0].AllowInsert == true && data_[0].AllowUpdate == true && data_[0].AllowDelete == true) ? AllowDelete : '') +
                                    ((true == true) ? AllowInsert : '') +
                                    ((true == true) ? AllowUpdate : '') +
                                    ((true == true) ? AllowDelete : '') +
                                    '</tr>'
                                );
                            }
                        });
                        UTILITY._AccessEventHandler_RolesMapping($('input:checkbox'));
                    }
                    $('#accessedtable').DataTable({
                        paging: false,
                        searching: false,
                        order: [[0, 'asc']],
                        rowGroup: {
                            dataSrc: 0
                        }
                    });

                    $('#addmoretable').DataTable({

                        paging: false,
                        searching: false,
                        order: [[0, 'asc']],
                        rowGroup: {
                            dataSrc: 0
                        }
                    });
                    HideLoader('RolesMappingDiv');
                }
                if (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: error.data.responseText,
                        footer: ''
                    });
                }
            });
        }
    });
}

function UpdateRolesMapping() {

    var RoleID_ = $('#selectrole').val();

    if (RoleID_ !== '') {
        var View_Collection = $('.View:input:checkbox:checked');
  
        var FormId_Collection= $(View_Collection).map(function () {
            return this.className.split('-')[1];
        }).get();

        var RoleMappingCollection = [];
        var obj = {};

        for (var i = 0; FormId_Collection.length > i; i++) {

            obj["FormsID"] = FormId_Collection[i];

            if (FormId_Collection[i].toString() == $('.Insert:input[type="checkbox"][FormID="' + FormId_Collection[i] +'"]').attr('FormID').toString()) {
                obj["AllowInsert"] = $('.Insert:input[type="checkbox"][FormID="' + FormId_Collection[i] + '"]')[0].checked;
            }

            if (FormId_Collection[i].toString() == $('.Update:input[type="checkbox"][FormID="' + FormId_Collection[i] + '"]').attr('FormID').toString()) {
                obj["AllowUpdate"] = $('.Update:input[type="checkbox"][FormID="' + FormId_Collection[i] + '"]')[0].checked;
            }
            if (FormId_Collection[i].toString() == $('.Delete:input[type="checkbox"][FormID="' + FormId_Collection[i] + '"]').attr('FormID').toString()) {
                obj["AllowDelete"] = $('.Delete:input[type="checkbox"][FormID="' + FormId_Collection[i] + '"]')[0].checked;
            }
            RoleMappingCollection.push(obj)
            obj = {};
        }
       

        if (FormId_Collection.length > 0 && RoleMappingCollection.length > 0) {

            Swal.fire({
                title: 'Do you want to save the changes?',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Ok',
                denyButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    var Data = JSON.stringify({
                        RoleID: RoleID_,
                        RoleMappingCollection: RoleMappingCollection

                    });
                    new APICALL(GetGlobalURL('Base', 'UpdateRolesMapping'), 'POST', Data, true).FETCH((result, error) => {

                        if (result) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success...',
                                text: 'Forms Updated Successfully!',
                                footer: ''
                            });
                            var RoleID_ = $('#selectrole').val();
                            GetMapping(RoleID_);
                        }
                        if (error) {

                            Swal.fire({
                                icon: 'error',
                                title: 'Error...',
                                text: error.data.responseText,
                                footer: ''
                            });
                        }
                    });
                }
            });
        }
    }
}