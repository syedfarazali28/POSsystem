var html = `
            <tr>
                <td class="d-none">
              
                    <input type="text" class="form-control SalesPerson-name" id="SalesPersonid" name="SalesPerson" autocomplete="off" required>
                </td>
                <td>
                    <label>SalesPerson Name</label>
                    <input type="text" validate-required class="form-control SalesPerson-name" id="SalesPerson" name="SalesPerson" autocomplete="off" required>
                </td>     
                <td>
                    <label>Address</label>
                    <input type="text" validate-required class="form-control SalesPerson-name" id="Address" name="SalesPerson" autocomplete="off" required>
                </td>    
                <td>
                    <label>ContactNumber</label>
                    <input type="text" class="form-control SalesPerson-name" validate-phone id="ContactNumber" name="SalesPerson" autocomplete="off" required>
                </td>    
                <td>
                    <label>Email</label>
                    <input type="text" class="form-control SalesPerson-name" id="Email" validate-email name="SalesPerson" autocomplete="off" required>
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
    GetSalesPersonData();
});


$(document).on('click', '.removebtn', function () {
    if ($('#inputtable tr').length > 1) {
        $(this).closest('tr').remove();
    }
});

$(document).on("click", "#SaveBtn", function () {
    var SalesPersonid = $("#SalesPersonid").val();
    var SalesPerson = $("#SalesPerson").val();
    var Address = $("#Address").val();
    var ContactNumber = $("#ContactNumber").val();
    var Email = $("#Email").val();
    var isActive = $("#is-active").prop("checked");

    var dt = {

        Param2: SalesPerson,
        Param3: Address,
        Param4: ContactNumber,
        Param5: Email,
        Param6: isActive
    }
    var SalesPersonModel = JSON.stringify(dt); // Send array directly
    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            new APICALL(GetGlobalURL('Base', 'SaveSalesPersonData'), 'POST', SalesPersonModel, true).FETCH((result, error) => {

                if (result) {
                    Swal.fire({
                        icon: "success",
                        title: "Success...",
                        text: "SalesPerson saved successfully!",
                    });
                    Clear();
                    GetSalesPersonData();
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
    var SalesPersonid = $("#SalesPersonid").val();
    var SalesPerson = $("#SalesPerson").val();
    var Address = $("#Address").val();
    var ContactNumber = $("#ContactNumber").val();
    var Email = $("#Email").val();
    var isActive = $("#is-active").prop("checked");

    var dt = {

        Param1: SalesPersonid,
        Param2: SalesPerson,
        Param3: Address,
        Param4: ContactNumber,
        Param5: Email,
        Param6: isActive
    }
    var SalesPersonModel = JSON.stringify(dt); // Send array directly
    new APICALL(GetGlobalURL('Base', 'SaveSalesPersonData'), 'POST', SalesPersonModel, true).FETCH((result, error) => {

        if (result) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "SalesPerson saved successfully!",
            });
            Clear();
            GetSalesPersonData();
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
function GetSalesPersonData() {
    ShowLoader('SalesPersonMasterDiv');

    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetSalesPersonData'), 'GET', '', true).FETCH((result, error) => {

                if (result) {

                    $('#SalesPerson-master tbody').html('');
                    if (result.data != null) {
                        roles = result.data;
                        $.each(result.data, function (i, option) {
                            var ActiveCell = option.IsActive == true ? '<td><input type="checkbox" class="role-active checkboxsize" disabled checked="checked"></td>' : '<td><input type="checkbox" class="role-active checkboxsize" disabled></td>'
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-orange btn-block EditSalesPerson" data-value="' + option.ID + '" type="button"><i class="bx bxs-edit"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-gray btn-block DeleteSalesPerson"  data-value="' + option.ID + '" type="button"><i class="bx bxs-trash"></i></button></td>' : '';

                            $('#SalesPerson-master tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.salespersonName + '</td>' +
                                '<td>' + option.Address + '</td>' +
                                '<td>' + option.ContactNumber + '</td>' +
                                '<td>' + option.Email + '</td>' +
                                ActiveCell +
                                UpdateBtn +
                                DeleteBtn +
                                '</tr>'
                            );
                        });
                        $('.EditSalesPerson').on('click', function () {
                            EditSalesPerson(this.attributes["data-value"].value);
                        });

                        $('.DeleteSalesPerson').on('click', function () {
                            DeleteSalesPerson(this.attributes["data-value"].value);
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
            HideLoader('SalesPersonMasterDiv');

        }
    });
}

function EditSalesPerson(Id) {
    var dt = {
        Param1: Id
    }
    var SalesPersonModel = JSON.stringify(dt); // Send array directly
    new APICALL(GetGlobalURL('Base', 'GetSalesPersonByid'), 'POST', SalesPersonModel, true).FETCH((result, error) => {

        if (result) {

            if (result.data.length > 0) {

                var SalesPersonName = result.data[0].salespersonName;
                var Address = result.data[0].Address;
                var ContactNumber = result.data[0].ContactNumber;
                var Email = result.data[0].Email;
                var IsActive = result.data[0].IsActive;
                $('#SalesPersonid').val(Id);
                $('#SalesPerson').val(SalesPersonName);
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
function DeleteSalesPerson(Id) {

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
            var SalesPersonModel = JSON.stringify(dt); // Send array directly
            new APICALL(GetGlobalURL('Base', 'DeleteSalesPersonByid'), 'POST', SalesPersonModel, true).FETCH((result, error) => {

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
                            text: "SalesPerson Delete successfully!",
                        });

                        if ($('.savebutton').hasClass('d-none')) {
                            $('.savebutton').toggleClass('d-none');
                            $('.updatebutton').toggleClass('d-none');
                        }
                        GetSalesPersonData();
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