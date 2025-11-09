var html = `
            <tr>
                <td class="d-none">
              
                    <input type="text" class="form-control Customer-name" id="Customerid" name="Customer" autocomplete="off" required>
                </td>
                <td>
                    <label>Customer Name</label>
                    <input type="text" validate-required class="form-control Customer-name" id="Customer" name="Customer" autocomplete="off" required>
                </td>     
                <td>
                    <label>Address</label>
                    <input type="text" validate-required class="form-control Customer-name" id="Address" name="Customer" autocomplete="off" required>
                </td>    
                <td>
                    <label>ContactNumber</label>
                    <input type="text" class="form-control Customer-name" validate-phone id="ContactNumber" name="Customer" autocomplete="off" required>
                </td>    
                <td>
                    <label>Email</label>
                    <input type="text" class="form-control Customer-name" id="Email" validate-email name="Customer" autocomplete="off" required>
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
    GetCustomerData();
});


$(document).on('click', '.removebtn', function () {
    if ($('#inputtable tr').length > 1) {
        $(this).closest('tr').remove();
    }
});

$(document).on("click", "#SaveBtn", function () {
    var Customerid = $("#Customerid").val();
    var Customer = $("#Customer").val();
    var Address = $("#Address").val();
    var ContactNumber = $("#ContactNumber").val();
    var Email = $("#Email").val();
    var isActive = $("#is-active").prop("checked");

    var dt = {

        Param2: Customer,
        Param3: Address,
        Param4: ContactNumber,
        Param5: Email,
        Param6: isActive
    }
    var CustomerModel = JSON.stringify(dt); // Send array directly
    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            new APICALL(GetGlobalURL('Base', 'SaveCustomerData'), 'POST', CustomerModel, true).FETCH((result, error) => {

                if (result) {
                    Swal.fire({
                        icon: "success",
                        title: "Success...",
                        text: "Customer saved successfully!",
                    });
                    Clear();
                    GetCustomerData();
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
    var Customerid = $("#Customerid").val();
    var Customer = $("#Customer").val();
    var Address = $("#Address").val();
    var ContactNumber = $("#ContactNumber").val();
    var Email = $("#Email").val();
    var isActive = $("#is-active").prop("checked");

    var dt = {

        Param1: Customerid,
        Param2: Customer,
        Param3: Address,
        Param4: ContactNumber,
        Param5: Email,
        Param6: isActive
    }
    var CustomerModel = JSON.stringify(dt); // Send array directly
    new APICALL(GetGlobalURL('Base', 'SaveCustomerData'), 'POST', CustomerModel, true).FETCH((result, error) => {

        if (result) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Customer saved successfully!",
            });
            Clear();
            GetCustomerData();
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
function GetCustomerData() {
    ShowLoader('CustomerMasterDiv');

    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetCustomerData'), 'GET', '', true).FETCH((result, error) => {

                if (result) {

                    $('#Customer-master tbody').html('');
                    if (result.data != null) {
                        
                        $.each(result.data, function (i, option) {
                            var ActiveCell = option.IsActive == true ? '<td><input type="checkbox" class="role-active checkboxsize" disabled checked="checked"></td>' : '<td><input type="checkbox" class="role-active checkboxsize" disabled></td>'
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-orange btn-block EditCustomer" data-value="' + option.ID + '" type="button"><i class="bx bxs-edit"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-gray btn-block DeleteCustomer"  data-value="' + option.ID + '" type="button"><i class="bx bxs-trash"></i></button></td>' : '';

                            $('#Customer-master tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.CustomerName + '</td>' +
                                '<td>' + option.Address + '</td>' +
                                '<td>' + option.ContactNumber + '</td>' +
                                '<td>' + option.Email + '</td>' +
                                ActiveCell +
                                UpdateBtn +
                                DeleteBtn +
                                '</tr>'
                            );
                        });
                        $('.EditCustomer').on('click', function () {
                            EditCustomer(this.attributes["data-value"].value);
                        });

                        $('.DeleteCustomer').on('click', function () {
                            DeleteCustomer(this.attributes["data-value"].value);
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
            HideLoader('CustomerMasterDiv');

        }
    });
}

function EditCustomer(Id) {
    var dt = {
        Param1: Id
    }
    var CustomerModel = JSON.stringify(dt); // Send array directly
    new APICALL(GetGlobalURL('Base', 'GetCustomerDataByid'), 'POST', CustomerModel, true).FETCH((result, error) => {

        if (result) {

            if (result.data.length > 0) {

                var CustomerName = result.data[0].CustomerName;
                var Address = result.data[0].Address;
                var ContactNumber = result.data[0].ContactNumber;
                var Email = result.data[0].Email;
                var IsActive = result.data[0].IsActive;
                $('#Customerid').val(Id);
                $('#Customer').val(CustomerName);
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
function DeleteCustomer(Id) {

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
            var CustomerModel = JSON.stringify(dt); // Send array directly
            new APICALL(GetGlobalURL('Base', 'DeleteCustomerDataByid'), 'POST', CustomerModel, true).FETCH((result, error) => {

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
                            text: "Customer Delete successfully!",
                        });

                        if ($('.savebutton').hasClass('d-none')) {
                            $('.savebutton').toggleClass('d-none');
                            $('.updatebutton').toggleClass('d-none');
                        }
                        GetCustomerData();
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