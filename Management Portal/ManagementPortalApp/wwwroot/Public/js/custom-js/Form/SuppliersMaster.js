var html = `
            <tr>
                <td class="d-none">
              
                    <input type="text" class="form-control Suppliers-name" id="Suppliersid" name="Suppliers" autocomplete="off" required>
                </td>
                <td>
                    <label>Suppliers Name</label>
                    <input type="text" validate-required class="form-control Suppliers-name" id="Suppliers" name="Suppliers" autocomplete="off" required>
                </td>     
                <td>
                    <label>Address</label>
                    <input type="text" validate-required class="form-control Suppliers-name" id="Address" name="Suppliers" autocomplete="off" required>
                </td>    
                <td>
                    <label>ContactNumber</label>
                    <input type="text" class="form-control Suppliers-name" validate-phone id="ContactNumber" name="Suppliers" autocomplete="off" required>
                </td>    
                <td>
                    <label>Email</label>
                    <input type="text" class="form-control Suppliers-name" id="Email" validate-email name="Suppliers" autocomplete="off" required>
                </td>    
                <td>
                    <label>Active</label>
                    <div class="form-check">
                        <input class="form-check-input is-active"  id="is-active" checked type="checkbox" name="IsActive">
                    </div>
                </td>
                <td class="text-end">
                    <button class="btn btn-primary addnewrowbtn d-none" type="button">
                        <i class='bx bx-plus'></i>
                    </button>
                    <button class="btn btn-danger removebtn d-none" type="button">
                        <i class='bx bxs-trash'></i>
                    </button>
                </td>
            </tr>
        `
$(document).ready(function () {
    $("#inputtable tbody").html('');
    $("#inputtable tbody").append(html);
    GetSuppliersData();
});


$(document).on('click', '.removebtn', function () {
    if ($('#inputtable tr').length > 1) {
        $(this).closest('tr').remove();
    }
});

$(document).on("click", "#SaveBtn", function () {
    var Suppliersid = $("#Suppliersid").val();
    var Suppliers = $("#Suppliers").val();
    var Address = $("#Address").val();
    var ContactNumber = $("#ContactNumber").val();
    var Email = $("#Email").val();
    var isActive = $("#is-active").prop("checked");

    var dt = {

        Param2: Suppliers,
        Param3: Address,
        Param4: ContactNumber,
        Param5: Email,
        Param6: isActive
    }
    var SuppliersModel = JSON.stringify(dt); // Send array directly
    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            new APICALL(GetGlobalURL('Base', 'SaveSuppliersData'), 'POST', SuppliersModel, true).FETCH((result, error) => {

                if (result) {
                    Swal.fire({
                        icon: "success",
                        title: "Success...",
                        text: "Supplier saved successfully!",
                    });
                    Clear();
                    GetSuppliersData();
                }

                if (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error...",
                        text: error.data.responseText,
                    });
                }
            });
        }
    });
});

$(document).on('click', '#UpdateBtn', function () {
    var Suppliersid = $("#Suppliersid").val();
    var Suppliers = $("#Suppliers").val();
    var Address = $("#Address").val();
    var ContactNumber = $("#ContactNumber").val();
    var Email = $("#Email").val();
    var isActive = $("#is-active").prop("checked");

    var dt = {

        Param1: Suppliersid,
        Param2: Suppliers,
        Param3: Address,
        Param4: ContactNumber,
        Param5: Email,
        Param6: isActive
    }
    var SuppliersModel = JSON.stringify(dt); // Send array directly
    new APICALL(GetGlobalURL('Base', 'SaveSuppliersData'), 'POST', SuppliersModel, true).FETCH((result, error) => {

        if (result) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Supplier saved successfully!",
            });
            Clear();
            GetSuppliersData();
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

$(document).on('click', '#ClearBtn', function () {
    Clear();
});
function Clear() {
    $("#inputtable tbody").html('');
    $("#inputtable tbody").append(html);
    if ($('.updatebutton').hasClass('d-none')) {
        $('.savebutton').toggleClass('d-none');
        $('.updatebutton').toggleClass('d-none');
    }
    if ($('.savebutton').hasClass('d-none')) {
        $('.savebutton').toggleClass('d-none');
        $('.updatebutton').toggleClass('d-none');
    }
}
function GetSuppliersData() {
    ShowLoader('SuppliersMasterDiv');

    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetSupplyData'), 'GET', '', true).FETCH((result, error) => {

                if (result) {

                    $('#Suppliers-master tbody').html('');
                    if (result.data != null) {
                        
                        $.each(result.data, function (i, option) {
                            var ActiveCell = option.IsActive == true ? '<td><input type="checkbox" class="role-active checkboxsize" disabled checked="checked"></td>' : '<td><input type="checkbox" class="role-active checkboxsize" disabled></td>'
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-orange btn-block EditSuppliers" data-value="' + option.ID + '" type="button"><i class="bx bxs-edit"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-gray btn-block DeleteSuppliers"  data-value="' + option.ID + '" type="button"><i class="bx bxs-trash"></i></button></td>' : '';

                            $('#Suppliers-master tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.SupplierName + '</td>' +
                                '<td>' + option.Address + '</td>' +
                                '<td>' + option.ContactNumber + '</td>' +
                                '<td>' + option.Email + '</td>' +
                                ActiveCell +
                                UpdateBtn +
                                DeleteBtn +
                                '</tr>'
                            );
                        });
                        $('.EditSuppliers').on('click', function () {
                            EditSuppliers(this.attributes["data-value"].value);
                        });

                        $('.DeleteSuppliers').on('click', function () {
                            DeleteSuppliers(this.attributes["data-value"].value);
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
            HideLoader('SuppliersMasterDiv');

        }
    });
}

function EditSuppliers(Id) {
    var dt = {
        Param1: Id
    }
    var SuppliersModel = JSON.stringify(dt); // Send array directly
    new APICALL(GetGlobalURL('Base', 'GetSuppliersDataByid'), 'POST', SuppliersModel, true).FETCH((result, error) => {

        if (result) {

            if (result.data.length > 0) {

                var SuppliersName = result.data[0].SupplierName;
                var Address = result.data[0].Address;
                var ContactNumber = result.data[0].ContactNumber;
                var Email = result.data[0].Email;
                var IsActive = result.data[0].IsActive;
                $('#Suppliersid').val(Id);
                $('#Suppliers').val(SuppliersName);
                $("#Address").val(Address);
                $("#ContactNumber").val(ContactNumber);
                $("#Email").val(Email);
                $('#is-active').prop('checked', IsActive);
                
                


                if ($('.updatebutton').hasClass('d-none')) {
                    $('.savebutton').toggleClass('d-none');
                    $('.updatebutton').toggleClass('d-none');
                }
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
function DeleteSuppliers(Id) {

    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            var dt = {
                Param1: Id
            }
            var SuppliersModel = JSON.stringify(dt); // Send array directly
            new APICALL(GetGlobalURL('Base', 'DeleteSuppliersDataByid'), 'POST', SuppliersModel, true).FETCH((result, error) => {

                if (result) {
                    if (result.data && result.data.length > 0) {
                        Swal.fire({
                            icon: 'info',
                            title: 'Info',
                            text: result.data[0].msg,
                            footer: ''
                        });


                    } else {
                        Swal.fire({
                            icon: "success",
                            title: "Success...",
                            text: "Supplier Delete successfully!",
                        });

                        if ($('.savebutton').hasClass('d-none')) {
                            $('.savebutton').toggleClass('d-none');
                            $('.updatebutton').toggleClass('d-none');
                        }
                        GetSuppliersData();
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
    });
}