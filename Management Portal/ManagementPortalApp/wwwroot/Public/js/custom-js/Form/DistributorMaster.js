$(document).ready(function () {
    $("#inputtable tbody").html('');
    $("#inputtable tbody").append(`
            <tr>
                <td class="d-none">
              
                    <input type="text" class="form-control Distributor-name" id="Distributorid" name="Distributor" autocomplete="off" required>
                </td>
                <td>
                    <label>Distributor Name</label>
                    <input type="text" validate-required class="form-control Distributor-name" id="Distributor" name="Distributor" autocomplete="off" required>
                </td>     
                <td>
                    <label>Address</label>
                    <input type="text" validate-required class="form-control Distributor-name" id="Address" name="Distributor" autocomplete="off" required>
                </td>    
                <td>
                    <label>ContactNumber</label>
                    <input type="text" class="form-control Distributor-name" validate-phone id="ContactNumber" name="Distributor" autocomplete="off" required>
                </td>    
                <td>
                    <label>Email</label>
                    <input type="text" class="form-control Distributor-name" id="Email" validate-email name="Distributor" autocomplete="off" required>
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
        `);
    GetDistributorData();
});


$(document).on('click', '.removebtn', function () {
    if ($('#inputtable tr').length > 1) {
        $(this).closest('tr').remove();
    }
});

$(document).on("click", "#SaveBtn", function () {
    var Distributorid = $("#Distributorid").val();
    var Distributor = $("#Distributor").val();
    var Address = $("#Address").val();
    var ContactNumber = $("#ContactNumber").val();
    var Email = $("#Email").val();
    var isActive = $("#is-active").prop("checked");

    var dt = {

        Param2: Distributor,
        Param3: Address,
        Param4: ContactNumber,
        Param5: Email,
        Param6: isActive
    }
    var DistributorModel = JSON.stringify(dt); // Send array directly
    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            new APICALL(GetGlobalURL('Base', 'SaveDistributorData'), 'POST', DistributorModel, true).FETCH((result, error) => {

                if (result) {
                    Swal.fire({
                        icon: "success",
                        title: "Success...",
                        text: "Distributor saved successfully!",
                    });
                    Clear();
                    GetDistributorData();
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
    var Distributorid = $("#Distributorid").val();
    var Distributor = $("#Distributor").val();
    var Address = $("#Address").val();
    var ContactNumber = $("#ContactNumber").val();
    var Email = $("#Email").val();
    var isActive = $("#is-active").prop("checked");

    var dt = {

        Param1: Distributorid,
        Param2: Distributor,
        Param3: Address,
        Param4: ContactNumber,
        Param5: Email,
        Param6: isActive
    }
    var DistributorModel = JSON.stringify(dt); // Send array directly
    new APICALL(GetGlobalURL('Base', 'SaveDistributorData'), 'POST', DistributorModel, true).FETCH((result, error) => {

        if (result) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Distributor saved successfully!",
            });
            Clear();
            GetDistributorData();
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
    $("#inputtable tbody").append(`
            <tr>
                <td class="d-none">
              
                    <input type="text" class="form-control Distributor-name" id="Distributorid" name="Distributor" autocomplete="off" required>
                </td>
                <td>
                    <label>Distributor Name</label>
                    <input type="text" validate-required class="form-control Distributor-name" id="Distributor" name="Distributor" autocomplete="off" required>
                </td>     
                <td>
                    <label>Address</label>
                    <input type="text" validate-required class="form-control Distributor-name" id="Address" name="Distributor" autocomplete="off" required>
                </td>    
                <td>
                    <label>ContactNumber</label>
                    <input type="text" class="form-control Distributor-name" validate-phone id="ContactNumber" name="Distributor" autocomplete="off" required>
                </td>    
                <td>
                    <label>Email</label>
                    <input type="text" class="form-control Distributor-name" id="Email" validate-email name="Distributor" autocomplete="off" required>
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
        `);
    if ($('.updatebutton').hasClass('d-none')) {
        $('.savebutton').toggleClass('d-none');
        $('.updatebutton').toggleClass('d-none');
    }
    if ($('.savebutton').hasClass('d-none')) {
        $('.savebutton').toggleClass('d-none');
        $('.updatebutton').toggleClass('d-none');
    }
}
function GetDistributorData() {
    ShowLoader('DistributorMasterDiv');

    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetDistributorData'), 'GET', '', true).FETCH((result, error) => {

                if (result) {

                    $('#Distributor-master tbody').html('');
                    if (result.data != null) {
                        roles = result.data;
                        $.each(result.data, function (i, option) {
                            var ActiveCell = option.IsActive == true ? '<td><input type="checkbox" class="role-active checkboxsize" disabled checked="checked"></td>' : '<td><input type="checkbox" class="role-active checkboxsize" disabled></td>'
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-orange btn-block EditDistributor" data-value="' + option.ID + '" type="button"><i class="bx bxs-edit"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-gray btn-block DeleteDistributor"  data-value="' + option.ID + '" type="button"><i class="bx bxs-trash"></i></button></td>' : '';

                            $('#Distributor-master tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.DistributorName + '</td>' +
                                '<td>' + option.Address + '</td>' +
                                '<td>' + option.ContactNumber + '</td>' +
                                '<td>' + option.Email + '</td>' +
                                ActiveCell +
                                UpdateBtn +
                                DeleteBtn +
                                '</tr>'
                            );
                        });
                        $('.EditDistributor').on('click', function () {
                            EditDistributor(this.attributes["data-value"].value);
                        });

                        $('.DeleteDistributor').on('click', function () {
                            DeleteDistributor(this.attributes["data-value"].value);
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
            HideLoader('DistributorMasterDiv');

        }
    });
}

function EditDistributor(Id) {
    var dt = {
        Param1: Id
    }
    var DistributorModel = JSON.stringify(dt); // Send array directly
    new APICALL(GetGlobalURL('Base', 'GetDistributorDataByid'), 'POST', DistributorModel, true).FETCH((result, error) => {

        if (result) {

            if (result.data.length > 0) {

                var DistributorName = result.data[0].DistributorName;
                var Address = result.data[0].Address;
                var ContactNumber = result.data[0].ContactNumber;
                var Email = result.data[0].Email;
                var IsActive = result.data[0].IsActive;
                $('#Distributorid').val(Id);
                $('#Distributor').val(DistributorName);
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
function DeleteDistributor(Id) {

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
            var DistributorModel = JSON.stringify(dt); // Send array directly
            new APICALL(GetGlobalURL('Base', 'DeleteDistributorDataByid'), 'POST', DistributorModel, true).FETCH((result, error) => {

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
                            text: "Distributor Delete successfully!",
                        });

                        if ($('.savebutton').hasClass('d-none')) {
                            $('.savebutton').toggleClass('d-none');
                            $('.updatebutton').toggleClass('d-none');
                        }
                        GetDistributorData();
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