$(document).ready(function () {
    $("#inputtable tbody").html('');
    $("#inputtable tbody").append(`
            <tr>
                <td class="d-none">
              
                    <input type="text" class="form-control category-name" id="categoryid" name="Category" autocomplete="off" required>
                </td>
                <td>
                    <label>Category Name</label>
                    <input type="text" class="form-control category-name" id="category" name="Category" autocomplete="off" required>
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
    GetCategoryData();
});
$(document).on('click', '.addnewrowbtn', function () {
    $("#inputtable tbody").append(`
            <tr>
                <td class="d-none">
              
                    <input type="text" class="form-control category-name" id="categoryid" name="Category" autocomplete="off" required>
                </td>
                <td>
                    <label>Category Name</label>
                    <input type="text" class="form-control category-name" id="Category" name="Category" autocomplete="off" required>
                </td>
                <td>
                    <label>Active</label>
                    <div class="form-check">
                        <input class="form-check-input is-active" id="is-active" type="checkbox" name="IsActive">
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
});

$(document).on('click', '.removebtn', function () {
    if ($('#inputtable tr').length > 1) {
        $(this).closest('tr').remove();
    }
});

$(document).on("click", "#SaveBtn", function () {
    var categoryName = $("#category").val();
    var isActive = $("#is-active").prop("checked");

    var dt = {

        Param2: categoryName,
        Param3: isActive
    }
    var CategoryModel = JSON.stringify(dt); // Send array directly
    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            new APICALL(GetGlobalURL('Base', 'SaveCategoryData'), 'POST', CategoryModel, true).FETCH((result, error) => {

                if (result) {
                    Swal.fire({
                        icon: "success",
                        title: "Success...",
                        text: "Categories saved successfully!",
                    });
                    Clear();
                    GetCategoryData();
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
    var categoryName = $("#category").val();
    var isActive = $("#is-active").prop("checked");
    var categoryid = $("#categoryid").val();
    var dt = {
        Param1: categoryid,
        Param2: categoryName,
        Param3: isActive
    }
    var CategoryModel = JSON.stringify(dt); // Send array directly
    new APICALL(GetGlobalURL('Base', 'SaveCategoryData'), 'POST', CategoryModel, true).FETCH((result, error) => {

        if (result) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Categories saved successfully!",
            });
            Clear();
            GetCategoryData();
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
              
                    <input type="text" class="form-control category-name" id="categoryid" name="Category" autocomplete="off" required>
                </td>
                <td>
                    <label>Category Name</label>
                    <input type="text" class="form-control category-name" id="category" name="Category" autocomplete="off" required>
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
function GetCategoryData() {
    ShowLoader('CategoryMasterDiv');

    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetCategoryData'), 'GET', '', true).FETCH((result, error) => {

                if (result) {

                    $('#category-master tbody').html('');
                    if (result.data != null) {
                        roles = result.data;
                        $.each(result.data, function (i, option) {
                            var ActiveCell = option.IsActive == true ? '<td><input type="checkbox" class="role-active checkboxsize" disabled checked="checked"></td>' : '<td><input type="checkbox" class="role-active checkboxsize" disabled></td>'
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-orange btn-block Editcategory" data-value="' + option.ID + '" type="button"><i class="bx bxs-edit"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-gray btn-block Deletecategory"  data-value="' + option.ID + '" type="button"><i class="bx bxs-trash"></i></button></td>' : '';

                            $('#category-master tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.CategoryName + '</td>' +
                                ActiveCell +
                                UpdateBtn +
                                DeleteBtn +
                                '</tr>'
                            );
                        });
                        $('.Editcategory').on('click', function () {
                            Editcategory(this.attributes["data-value"].value);
                        });

                        $('.Deletecategory').on('click', function () {
                            Deletecategory(this.attributes["data-value"].value);
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
            HideLoader('CategoryMasterDiv');

        }
    });
}

function Editcategory(Id) {
    var dt = {
        Param1: Id
    }
    var CategoryModel = JSON.stringify(dt); // Send array directly
    new APICALL(GetGlobalURL('Base', 'GetCategoryDataByid'), 'POST', CategoryModel, true).FETCH((result, error) => {

        if (result) {

            if (result.data.length > 0) {

                var CategoryName = result.data[0].CategoryName;
                var IsActive = result.data[0].IsActive;

                $('#category').val(CategoryName);
                $('#is-active').prop('checked', IsActive);
                $('#categoryid').val(Id);

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
function Deletecategory(Id) {

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
            var CategoryModel = JSON.stringify(dt); // Send array directly
            new APICALL(GetGlobalURL('Base', 'DeleteCategoryDataByid'), 'POST', CategoryModel, true).FETCH((result, error) => {

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
                            text: "Category Delete successfully!",
                        });

                        if ($('.savebutton').hasClass('d-none')) {
                            $('.savebutton').toggleClass('d-none');
                            $('.updatebutton').toggleClass('d-none');
                        }
                        GetCategoryData();
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