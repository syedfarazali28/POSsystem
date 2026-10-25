
var html = `
         <div class="container">
    <div class="row align-items-center mb-3">
        <div class="col-md-4">
        <input type="hidden" class="form-control" id="Productid" name="Productid" autocomplete="off" >
            <label for="category">Category Name</label>
            <select id="category" class="form-select searchingenable" validate-required>
                <option></option>
                <!-- Add options here -->
            </select>
        </div>
        <div class="col-md-4">
            <label for="Product">Product Name</label>
            <input type="text" class="form-control" id="Product" name="Product" autocomplete="off" validate-required>
        </div>
        <div class="col-md-4 d-flex align-items-center">
            <div>
                <label for="is-active" class="me-2">Active</label>
                <input class="form-check-input" id="is-active" type="checkbox" name="IsActive" checked>
            </div>
        </div>
    </div>
    
   
</div>

        `
$(document).ready(function () {
    $("#inputtable tbody").html('');
    $("#inputtable tbody").append(html);
    GetCategoryData();
    GetProductData();
});

$(document).on('click', '.addnewrowbtn', function () {
    $("#inputtable tbody").append(html);
});

$(document).on('click', '.removebtn', function () {
    if ($('#inputtable tr').length > 1) {
        $(this).closest('tr').remove();
    }
});

$(document).on("click", "#SaveBtn", function () {
    var Categoryid = $('#category').val();
    var ProductName = $("#Product").val();
    var isActive = $("#is-active").prop("checked");

    var dt = {

        Param2: Categoryid,
        Param3: ProductName,
        Param4: isActive
    }
    var ProductModel = JSON.stringify(dt); // Send array directly
    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            new APICALL(GetGlobalURL('Base', 'SaveProductData'), 'POST', ProductModel, true).FETCH((result, error) => {

                if (result) {
                    Swal.fire({
                        icon: "success",
                        title: "Success...",
                        text: "Product saved successfully!",
                    });
                    Clear();
                    GetProductData();
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
    var Categoryid = $('#category').val();
    var ProductName = $("#Product").val();
    var isActive = $("#is-active").prop("checked");
    var Productid = $("#Productid").val();
    var dt = {

        Param1: Productid,
        Param2: Categoryid,
        Param3: ProductName,
        Param4: isActive
    }
    var ProductModel = JSON.stringify(dt); // Send array directly
    new APICALL(GetGlobalURL('Base', 'SaveProductData'), 'POST', ProductModel, true).FETCH((result, error) => {

        if (result) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Categories saved successfully!",
            });
            Clear();
            GetProductData();
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
    GetCategoryData();
});
function Clear() {
    $('#category').val(null).trigger('change');
    $("#Product").val('');
    $("#is-active").prop("checked");
    $("#Productid").val('');
    if ($('.updatebutton').hasClass('d-none')) {
        $('.savebutton').toggleClass('d-none');
        $('.updatebutton').toggleClass('d-none');
    }
    if ($('.savebutton').hasClass('d-none')) {
        $('.savebutton').toggleClass('d-none');
        $('.updatebutton').toggleClass('d-none');
    }
}
function GetProductData() {
    ShowLoader('ProductMasterDiv');

    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetProductData'), 'GET', '', true).FETCH((result, error) => {

                if (result) {
 
                    $('#Product-master tbody').html('');
                    if (result.data != null) {
                        
                        $.each(result.data, function (i, option) {
                            var ActiveCell = option.IsActive == true ? '<td><input type="checkbox" class="role-active checkboxsize" disabled checked="checked"></td>' : '<td><input type="checkbox" class="role-active checkboxsize" disabled></td>'
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-orange btn-block EditProduct" data-value="' + option.ID + '" type="button"><i class="bx bxs-edit"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-gray btn-block DeleteProduct"  data-value="' + option.ID + '" type="button"><i class="bx bxs-trash"></i></button></td>' : '';

                            $('#Product-master tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.CategoryName + '</td>' +
                                '<td>' + option.ProductName + '</td>' +
                                ActiveCell +
                                UpdateBtn +
                                DeleteBtn +
                                '</tr>'
                            );
                        });
                        $('.EditProduct').on('click', function () {
                            EditProduct(this.attributes["data-value"].value);
                        });

                        $('.DeleteProduct').on('click', function () {
                            DeleteProduct(this.attributes["data-value"].value);
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
            HideLoader('ProductMasterDiv');

        }
    });
}

function GetCategoryData() {
    ShowLoader('CategoryMasterDiv');

    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetactiveCategory'), 'GET', '', true).FETCH((result, error) => {

                if (result) {


                    if (result.data != null) {
                        

                        $('#category').empty().append('<option value="">-- Select Category --</option>');
                        $.each(result.data, function (i, option) {
                            $('#category').append(
                                '<option value="' + option.ID + '">' + option.CategoryName + '</option>'
                            );
                        });

                        if ($.fn.select2 && $('#category').hasClass("select2-hidden-accessible")) {
                            $('#category').select2('destroy');
                        }
                    
                    }

                    $('.searchingenable').select2({
                        placeholder: "-- Select Category --",
                        allowClear: true,
                        width: '100%',
                        minimumResultsForSearch: 0
                    });
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
function EditProduct(Id) {
    var dt = {
        Param1: Id
    }
    var ProductModel = JSON.stringify(dt); // Send array directly
    new APICALL(GetGlobalURL('Base', 'GetProductDataByid'), 'POST', ProductModel, true).FETCH((result, error) => {

        if (result) {

            if (result.data.length > 0) {

                var ProductID = result.data[0].ProductID;
                var ProductName = result.data[0].ProductName;
                var IsActive = result.data[0].IsActive;
                var CategoryID = result.data[0].CategoryID;
                $("#Productid").val(ProductID);
                $('#Product').val(ProductName);
                $('#is-active').prop('checked', IsActive);
                $('#Productid').val(Id);
                $('#category').val(CategoryID).trigger('change');

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
function DeleteProduct(Id) {

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
            var ProductModel = JSON.stringify(dt); // Send array directly
            new APICALL(GetGlobalURL('Base', 'DeleteProductDataByid'), 'POST', ProductModel, true).FETCH((result, error) => {

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
                            text: "Product Delete successfully!",
                        });
                        if ($('.savebutton').hasClass('d-none')) {
                            $('.savebutton').toggleClass('d-none');
                            $('.updatebutton').toggleClass('d-none');
                        }
                        GetProductData();

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