$(document).ready(function () {
    Getformmaster();
    $('#SaveBtn').on('click', function () {
        SaveUser();
    });
});

$(document).on('click', '#SaveBtn', function () {

    var dt = {
        Param1: $('#FormController').val(),
        Param2: $('#FormAction').val(),
        Param3: $('#FormDisplayName').val(),
        Param4: $('#Icon').val(),
        Param5: $('#FormID').val(),
        Param6: $('#RoleID').val(),
        Param7: $('#isview').prop('checked'),
        Param8: $('#AllowUpdate').prop('checked'),
        Param9: $('#AllowDelete').prop('checked'),
        Param10: $('#AllowInsert').prop('checked'),
        Param11: $('#IsActive').prop('checked')
    };

    var formmastermodel = JSON.stringify(dt); // Send array directly
    new APICALL(GetGlobalURL('Base', 'Saveformsmaster'), 'POST', formmastermodel, true).FETCH((result, error) => {

        if (result) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Forms Master saved successfully!",
            });
            Clear();
            Getformmaster();
        }

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Error...",
                text: error.data.responseText,
            });
        }
    });
});

function DoEmptyFields() {
    $('#FormController').val('');
    $('#FormAction').val('');
    $('#FormDisplayName').val('');
    $('#Icon').val('');
    $('#FormID').val('');
    $('#RoleID').val('').change();
    $('#isview').prop('checked', false);
    $('#AllowUpdate').prop('checked', false);
    $('#AllowDelete').prop('checked', false);
    $('#AllowInsert').prop('checked', false);
    $('#IsActive').prop('checked', false);
    
}
function Getformmaster() {
    ShowLoader('formMasterDiv');
    UTILITY.CheckSession((data_) => {

        if (data_) {
            new APICALL(GetGlobalURL('Base', 'Getformsmaster'), 'GET', '', true).FETCH((result, error) => {

                if (result) {
                    $("#form-master").dataTable().fnDestroy();
                    $('#form-master tbody').html('');

                    if (result.data != null) {
                        users = result.data;
                        $.each(result.data, function (i, option) {
                            var IsView = option.IsView == 1 ? '<td><input type="checkbox" class="role-active" disabled checked="checked"></td>' : '<td><input type="checkbox" class="role-active" disabled></td>'
                            var AllowUpdate = option.AllowUpdate == 1 ? '<td><input type="checkbox" class="role-active" disabled checked="checked"></td>' : '<td><input type="checkbox" class="role-active" disabled></td>'
                            var AllowInsert = option.AllowInsert == 1 ? '<td><input type="checkbox" class="role-active" disabled checked="checked"></td>' : '<td><input type="checkbox" class="role-active" disabled></td>'
                            var AllowDelete = option.AllowDelete == 1 ? '<td><input type="checkbox" class="role-active" disabled checked="checked"></td>' : '<td><input type="checkbox" class="role-active" disabled></td>'
                            var isActiveCell = option.IsActive == true ? '<td><input type="checkbox" class="role-active" disabled checked="checked"></td>' : '<td><input type="checkbox" class="role-active" disabled></td>'
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-orange btn-block Editfrom" data-value="' + option.UserID + '" data-value1="' + i + '" type="button"><i class="bx bxs-edit"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-gray btn-block Deleteform" data-value="' + option.UserID + '" type="button"><i class="bx bxs-trash"></i></button></td>' : '';

                            
                            $('#form-master tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.FormController + '</td>' +
                                '<td>' + option.FormAction + '</td>' +
                                '<td>' + option.FormDisplayName + '</td>' +
                                '<td>' + option.Icon + '</td>' +
                                '<td>' + option.ParentFormName + '</td>' +
                                '<td>' + option.RoleName + '</td>' +
                                IsView +
                                AllowUpdate +
                                AllowInsert +
                                AllowDelete +
                                isActiveCell +
                                UpdateBtn +
                                DeleteBtn +
                                '</tr>'
                            );
                        });
                        $('.Editform').on('click', function () {
                            EditUser(this.attributes["data-value"].value, this.attributes["data-value1"].value);
                        });

                        $('.Deleteform').on('click', function () {
                            DeleteUser(this.attributes["data-value"].value);
                        });

                    }
                    $('#form-master').DataTable();
                    HideLoader('formMasterDiv');
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
