
var html = `
            <tr>
    <input type="hidden" class="form-control CompanyID" id="CompanyID" name="CompanyID" autocomplete="off" required>
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
        <input type="text" validate-required class="form-control" validate-email id="Email" name="Email" autocomplete="off">
    </td>
    <td>
        <label>Website</label>
        <input type="text" validate-required class="form-control" id="Website" name="Website" autocomplete="off">
    </td>
    <td>
        <label>Address</label>
        <input type="text" validate-required class="form-control" id="Address" name="Address" autocomplete="off">
    </td>
    <td>
        <label>City</label>
        <input type="text" validate-required class="form-control" id="City" name="City" autocomplete="off">
    </td>
</tr>
<tr>
    <td>
        <label>Country</label>
        <input type="text" validate-required class="form-control" id="Country" name="Country" autocomplete="off">
    </td>

    <td>
        <label>GST Number</label>
        <input type="text" validate-required class="form-control" id="GSTNumber" name="GSTNumber" autocomplete="off">
    </td>
    <td>
        <label>NTN Number</label>
        <input type="text" validate-required class="form-control" id="NTNNumber" name="NTNNumber" autocomplete="off">
    </td>
   
</tr>
<tr>
    <td>
        <label>Logo</label>
        <img id="LogoPreview" src="" width="60" height="60" alt="Logo Preview" class="ms-2 mt-2 rounded shadow-sm border border-2" style="max-height:100px; display:none;">
        <input type="file" class="form-control" id="Logo" name="Logo" accept="image/*" onchange="previewImage(event)">

    </td>
    <td>
        <label>Active</label>
        <div class="form-check">
            <input class="form-check-input" id="IsActive" checked type="checkbox" name="IsActive">
        </div>
    </td>
</tr>

        `


$(document).ready(function () {
    $("#inputtable tbody").html('');
    $("#inputtable tbody").append(html);
    $('#LogoPreview').hide();
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



$(document).on("click", "#UpdateBtn", function () {
    var fileInput = $("#Logo")[0].files[0];

    if (fileInput) {
        fileToBase64(fileInput, updateCompanyData);
    } else {
        var existingLogo = $("#previewImage").attr("src") || "";
        updateCompanyData(existingLogo);
    }
});

function updateCompanyData(base64Str) {
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
                        text: "Data updated successfully!"
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


$(document).on('click', '#ClearBtn', function () {
    Clear();
});
function Clear() {
    $("#inputtable tbody").html('');
    $("#inputtable tbody").append(html);
    $('#LogoPreview').hide();
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
                            var ViewProfile = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-orange btn-block ViewProfile" data-value="' + option.CompanyID + '" type="button"><i class="bx bx-detail"></i></button></td>' : '';
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-orange btn-block EditCompany" data-value="' + option.CompanyID + '" type="button"><i class="bx bxs-edit"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-gray btn-block DeleteCompany"  data-value="' + option.CompanyID + '" type="button"><i class="bx bxs-trash"></i></button></td>' : '';
                            var img =
                                $('#Company-master tbody').append(
                                    '<tr id="rowid-' + i + '">' +
                                    '<td>' + option.CompanyName + '</td>' +
                                    '<td>' + option.ContactPerson + '</td>' +
                                    '<td>' + option.PhoneNumber + '</td>' +
                                    '<td>' + option.Email + '</td>' +   
                                    ActiveCell +
                                    ViewProfile +
                                    UpdateBtn +
                                    DeleteBtn +
                                    '</tr>'
                                );

                        });
                        $('.EditCompany').on('click', function () {
                            EditCompany(this.attributes["data-value"].value);
                        });
                        $('.ViewProfile').on('click', function () {
                            ViewProfile(this.attributes["data-value"].value);
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
function ViewProfile(Id) {
    var dt = { Param1: Id };
    var CompanyModel = JSON.stringify(dt);

    new APICALL(GetGlobalURL('Base', 'GetCompanyDataById'), 'POST', CompanyModel, true).FETCH((result, error) => {
        if (result && result.data.length > 0) {
            var data = result.data[0];

            // Fill in modal details
            $('#ProfileCompanyName').text(data.CompanyName);
            $('#ProfileRegistrationNumber').text(data.RegistrationNumber);
            $('#ProfileContactPerson').text(data.ContactPerson);
            $('#ProfilePhoneNumber').text(data.PhoneNumber);
            $('#ProfileEmail').html('<a href="mailto:' + data.Email + '">' + data.Email + '</a>');
            $('#ProfileWebsite').html('<a href="' + data.Website + '" target="_blank">' + data.Website + '</a>');
            $('#ProfileAddress').text(data.Address);
            $('#ProfileCity').text(data.City);
            $('#ProfileCountry').text(data.Country);
            $('#ProfileGSTNumber').text(data.GSTNumber);
            $('#ProfileNTNNumber').text(data.NTNNumber);
            $('#ProfileStatus').html(data.IsActive ? '<span class="badge bg-success">Active</span>' : '<span class="badge bg-danger">Inactive</span>');
            $('#ProfileCreatedDate').text(new Date(data.CreatedDate).toLocaleDateString("en-GB").replace(/\//g, "-"));

            // Logo
            if (data.Logo && data.Logo.trim() !== '') {
                $('#CompanyLogo').attr('src', 'data:image/png;base64,' + data.Logo).show();
            } else {
                $('#CompanyLogo').hide();
            }

            // Show modal
            $('#ModalCompanyProfile').modal('show');
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

function EditCompany(Id) {
    var dt = {
        Param1: Id
    };
    var CompanyModel = JSON.stringify(dt);

    new APICALL(GetGlobalURL('Base', 'GetCompanyDataById'), 'POST', CompanyModel, true).FETCH((result, error) => {
        if (result) {
            if (result.data.length > 0) {
                var company = result.data[0];

                // Fill form fields
                $('#CompanyID').val(company.CompanyID);
                $('#CompanyName').val(company.CompanyName);
                $('#RegistrationNumber').val(company.RegistrationNumber);
                $('#ContactPerson').val(company.ContactPerson);
                $('#PhoneNumber').val(company.PhoneNumber);
                $('#Email').val(company.Email);
                $('#Website').val(company.Website);
                $('#Address').val(company.Address);
                $('#City').val(company.City);
                $('#Country').val(company.Country);
                $('#GSTNumber').val(company.GSTNumber);
                $('#NTNNumber').val(company.NTNNumber);
                $('#IsActive').prop('checked', company.IsActive);

                // If you want to preview logo
                if (company.Logo && company.Logo.trim() !== '') {
                    $('#LogoPreview').attr('src', 'data:image/png;base64,' + company.Logo).show();
                } else {
                    $('#LogoPreview').hide();
                }

                // Toggle buttons
                if ($('.updatebutton').hasClass('d-none')) {
                    $('.savebutton').addClass('d-none');
                    $('.updatebutton').removeClass('d-none');
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