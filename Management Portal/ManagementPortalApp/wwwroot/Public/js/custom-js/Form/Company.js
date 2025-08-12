var html = `
            <tr>
             <input type="hide" class="form-control CompanyID" id="CompanyID" name="CompanyID" autocomplete="off" required>
            <td>
        <label>Company Name</label>
        <input type="text" validate-required class="form-control CompanyName" id="CompanyName" name="CompanyName" autocomplete="off" required>
    </td>
    <td>
        <label>Registration Number</label>
        <input type="text" class="form-control RegistrationNumber" id="RegistrationNumber" name="RegistrationNumber" autocomplete="off">
    </td>
    <td>
        <label>Contact Person</label>
        <input type="text" validate-required class="form-control ContactPerson" id="ContactPerson" name="ContactPerson" autocomplete="off">
    </td>
        <td>
        <label>Phone Number</label>
        <input type="text" validate-required class="form-control PhoneNumber" validate-phone id="PhoneNumber" name="PhoneNumber" autocomplete="off">
    </td>
                </tr>
 <tr>

    <td>
        <label>Email</label>
        <input type="text" validate-required class="form-control Suppliers-name" validate-email id="Email" name="Email" autocomplete="off">
    </td>
    <td>
        <label>Website</label>
        <input type="text" validate-required class="form-control Suppliers-name" id="Website" name="Website" autocomplete="off">
    </td>
    <td>
        <label>Address</label>
        <input type="text" validate-required class="form-control Suppliers-name" id="Address" name="Address" autocomplete="off">
    </td>
    <td>
        <label>City</label>
        <input type="text" validate-required class="form-control Suppliers-name" id="City" name="City" autocomplete="off">
    </td>
     </tr>
 <tr>
    <td>
        <label>Country</label>
        <input type="text" validate-required class="form-control Suppliers-name" id="Country" name="Country" autocomplete="off">
    </td>
    <td>
        <label>Logo</label>
        <input type="file" validate-required class="form-control Suppliers-name" id="Logo" name="Logo" accept="image/*">
    </td>
    <td>
        <label>GST Number</label>
        <input type="text" validate-required class="form-control Suppliers-name" id="GSTNumber" name="GSTNumber" autocomplete="off">
    </td>
    <td>
        <label>NTN Number</label>
        <input type="text" validate-required class="form-control Suppliers-name" id="NTNNumber" name="NTNNumber" autocomplete="off">
    </td>
    <tr>
    <td>
        <label>Active</label>
        <div class="form-check">
            <input class="form-check-input" id="IsActive" checked type="checkbox" name="IsActive">
        </div>
    </td>
    </tr>
    
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
    GetCompanyData();
});
$(document).on("click", "#SaveBtn", function () {
    var fileInput = $("#Logo")[0].files[0];

    if (fileInput) {
        fileToBase64(fileInput, saveCompanyData);
    } else {
        saveCompanyData("");
    }
});

function saveCompanyData(base64Str) {
    var CompanyData = {
        Param2: $("#CompanyName").val(),
        Param3: $("#RegistrationNumber").val(),
        Param4: $("#ContactPerson").val(),
        Param5: $("#PhoneNumber").val(),
        Param6: $("#Email").val(),
        Param7: $("#Website").val(),
        Param8: $("#Address").val(),
        Param9: $("#City").val(),
        Param10: $("#Country").val(),
        Param11: base64Str || "",
        Param12: $("#GSTNumber").val(),
        Param13: $("#NTNNumber").val(),
        Param14: $("#IsActive").is(":checked")
    };

    Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        confirmButtonText: "Ok",
        denyButtonText: "Cancel"
    }).then((result) => {
        if (!result.isConfirmed) return;

        new APICALL(GetGlobalURL("Base", "SavecompanyData"), "POST", JSON.stringify(CompanyData), true)
            .FETCH((res, err) => {
                if (res) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Data saved successfully!"
                    });
                    Clear();
                    GetCompanyData();
                }
                if (err) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: err.data?.responseText || "An error occurred."
                    });
                }
            });
    });
}




$(document).on('click', '#UpdateBtn', function () {
    if (files[0].length > 0) {


        var myBase64 = "";
        fileToBase64($("#Logo")[0].files[0], function (base64Str) {
            if (base64Str) {
                console.log("Base64:", base64Str);
                // assign to variable
                myBase64 = base64Str;
                // now you can send it in AJAX or save it
            }
        });
    }
    else {

        myBase64 = $('#previewImage').attr('src'); // fallback if no file selected
    }
    var CompanyData = {
        Param1: $("#CompanyID").val(),
        Param2: $("#CompanyName").val(),
        Param3: $("#RegistrationNumber").val(),
        Param4: $("#ContactPerson").val(),
        Param5: $("#PhoneNumber").val(),
        Param6: $("#Email").val(),
        Param7: $("#Website").val(),
        Param8: $("#Address").val(),
        Param9: $("#City").val(),
        Param10: $("#Country").val(),
        Param11: myBase64,
        Param12: $("#GSTNumber").val(),
        Param13: $("#NTNNumber").val(),
        Param14: $("#IsActive").is(":checked")
    };


    var CompanyDataModel = JSON.stringify(CompanyData); // Send array directly
    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            new APICALL(GetGlobalURL('Base', 'SavecompanyData'), 'POST', CompanyDataModel, true).FETCH((result, error) => {

                if (result) {
                    Swal.fire({
                        icon: "success",
                        title: "Success...",
                        text: "Complete saved successfully!",
                    });
                    Clear();
                    GetCompanyData();
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
function GetCompanyData() {
    ShowLoader('CompanymasterDiv');

    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetCompanyData'), 'GET', '', true).FETCH((result, error) => {

                if (result) {

                    $('#Company-master tbody').html('');
                    if (result.data != null) {

                        $.each(result.data, function (i, option) {
                            var ActiveCell = option.IsActive == true ? '<td><input type="checkbox" class="role-active checkboxsize" disabled checked="checked"></td>' : '<td><input type="checkbox" class="role-active checkboxsize" disabled></td>'
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-orange btn-block EditCompany" data-value="' + option.ID + '" type="button"><i class="bx bxs-edit"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-gray btn-block DeleteCompany"  data-value="' + option.ID + '" type="button"><i class="bx bxs-trash"></i></button></td>' : '';
                            var img = 
                            $('#Company-master tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.CompanyName + '</td>' +
                                '<td>' + option.RegistrationNumber + '</td>' +
                                '<td>' + option.ContactPerson + '</td>' +
                                '<td>' + option.PhoneNumber + '</td>' +
                                '<td>' + option.Email + '</td>' +
                                '<td>' + option.Website + '</td>' +
                                '<td>' + option.Address + '</td>' +
                                '<td>' + option.City + '</td>' +
                                '<td>' + option.Country + '</td>' +
                                '<td><img ' + (option.Logo ? '' : 'src="data: image/png;base64, '+option.Logo) + '" height="50"/></td>'+
                                '<td>' + option.GSTNumber + '</td>' +
                                '<td>' + option.NTNNumber + '</td>' +
                                '<td>' + option.ActiveCell + '</td>' +
                                '<td>' + option.UpdateBtn + '</td>' +
                                '<td>' + option.DeleteBtn + '</td>' +
                                '</tr>'
                            );

                        });
                        $('.EditCompany').on('click', function () {
                            EditSuppliers(this.attributes["data-value"].value);
                        });

                        $('.DeleteCompany').on('click', function () {
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
                        GetCompanyData();
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