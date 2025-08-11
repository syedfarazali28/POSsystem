var productdata;
var DataScreen = true;
var dataArray = [];
var UpdatedataArray = [];
var editIndex = -1;
var html = `
<tr>
    <!-- Hidden ID -->
    <td class="d-none">
        <input type="text" id="productskuid" name="productsku" autocomplete="off" required>
    </td>

    <!-- Product Dropdown -->
   <td>
        <p class="form-label">Product Name</p>
        <select id="Product" class="form-select product-dropdown searchingenable" required>
            <option></option>
            <!-- Options will be added dynamically -->
        </select>
           
            
           
    </td>

    <!-- Product SKU -->
    <td>
        <label for="productsku" class="form-label">ProductSku Name</label>
        <input type="text" validate-required class="form-control" id="productsku" name="productsku" autocomplete="off" required>
    </td>

    

    <!-- Image Upload -->
    <td>
        <label for="imagefile" class="form-label">Image</label>
        <input validate-file type="file" class="form-control" id="imagefile" name="ImageName" autocomplete="off" required>
      
    </td>
    <td>
      <img id="previewImage" src="" width="60" height="60" class="ms-2" />
    </td>

    <!-- Amount -->
    <td>
        <label for="Amount" class="form-label">Amount</label>
        <input validate-number type="text" class="form-control" id="Amount" name="Amount" autocomplete="off" required>
    </td>

    <!-- Active Checkbox -->
    <td>
        <label for="is-active" class="form-label">Active</label>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="is-active" checked name="IsActive" >
        </div>
    </td>

    
</tr>`

var Updateformhtml = `
<tr>
    <!-- Hidden ID -->
    <td class="d-none">
        <input type="text" id="updateproductskuid" name="productsku" autocomplete="off" required>
    </td>

    <!-- Product Dropdown -->
   <td>
        <p class="form-label">Product Name</p>
        <select id="updateProduct" class="form-select product-dropdown searchingenable" required>
            <option></option>
            <!-- Options will be added dynamically -->
        </select>
           
            
           
    </td>

    <!-- Product SKU -->
    <td>
        <label for="productsku" class="form-label">ProductSku Name</label>
        <input type="text" validate-required class="form-control" id="updateproductsku" name="productsku" autocomplete="off" required>
    </td>

    

    <!-- Image Upload -->
    <td>
        <label for="imagefile" class="form-label">Image</label>
        <input validate-file type="file" class="form-control" id="updateimagefile" name="ImageName" autocomplete="off" required>
      
    </td>
    <td>
      <img id="updatepreviewImage" src="" width="60" height="60" class="ms-2" />
    </td>

    <!-- Amount -->
    <td>
        <label for="Amount" class="form-label">Amount</label>
        <input validate-number type="text" class="form-control" id="updateAmount" name="Amount" autocomplete="off" required>
    </td>

    <!-- Active Checkbox -->
    <td>
        <label for="is-active" class="form-label">Active</label>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="updateis-active" checked name="IsActive" >
        </div>
    </td>

    
</tr>`




//#region formscreen
$(document).ready(function () {
    //$('#UpdateDiv').hide();
    $('#tabs').tabs({
        activate: function (event, ui) {

            if (ui.newPanel.attr("id") == "DataScreen") {
                if (DataScreen) {
                    Getproductsku();
                    
                }
            }
        }
    });

    $("#inputtable tbody").html('');
    $("#inputtable tbody").append(html);
   
    $('#previewImage').hide();
    $('#UpdateDiv').hide();
    GetproductData();
});
$(document).on('click', '.removebtn', function () {
    if ($('#inputtable tr').length > 1) {
        $(this).closest('tr').remove();
    }
});
$(document).on('click', '.addnewrowbtn', function () {
    $("#inputtable tbody").append(html);

    var $newRow = $("#inputtable tbody tr").last();
    var $dropdown = $newRow.find('.product-dropdown');

    if (productdata?.length > 0) {
        $dropdown.empty().append('<option value="">-- Select Product --</option>');
        $.each(productdata, function (i, option) {
            $dropdown.append(
                '<option value="' + option.ID + '">' + option.ProductName + '</option>'
            );
        });

        // Initialize select2 on the new dropdown
        if ($.fn.select2) {
            $dropdown.select2({
                placeholder: "-- Select Product --",
                allowClear: true,
                width: 'resolve',
                minimumResultsForSearch: 0
            });
        }
    }
});
$(document).on('click', '#addbutton', function () {
    addinlist();
});
function addinlist() {
    validration();
    var file = $('#imagefile')[0].files[0];
    var imageName = file ? file.name : "";
    var reader = new FileReader();

    reader.onload = function (event) {
        var base64String = file ? event.target.result : "";

        // If editing existing row
        if (editIndex >= 0) {
            var entry = {
                param2: $('#Product').val(),
                param3: $('#Product option:selected').text(),
                param4: $('#productsku').val(),
                param5: base64String || $('#previewImage').attr('src'), // fallback to preview image
                param6: $('#Amount').val(),
                param7: $('#is-active').is(':checked'),
                param8: imageName
            };

            dataArray[editIndex] = entry;
            editIndex = -1;
        } else {
            // If adding new row
            var entry = {
                param2: $('#Product').val(),
                param3: $('#Product option:selected').text(),
                param4: $('#productsku').val(),
                param5: base64String || $('#previewImage').attr('src'), // fallback if no file selected
                param6: $('#Amount').val(),
                param7: $('#is-active').is(':checked'),
                param8: imageName
            };

            dataArray.push(entry);
        }

        RenderTable();
        Clear();
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        // Trigger load manually with existing image if no file selected
        var existingImage = $('#previewImage').attr('src');
        reader.onload({ target: { result: existingImage } });
    }
    $('#previewImage').attr('src', ''); // ✅ This sets the src to empty

    $('#previewImage').hide();
}
$(document).on('click', '#ClearBtn', function () {
    Clear();
});
function Clear() {
    $('#Product').val("").trigger('change');
    $('#productsku').val("");
    $('#Amount').val("");

    $('#imagefile').val(""); // Clear file input
    $('#previewImage').attr('src', ''); // ✅ This sets the src to empty

    $('#previewImage').hide();
}
function RenderTable() {
    var row = "";
    for (var i = 0; i < dataArray.length; i++) {
        row += "<tr>";
        row += "<td class='d-none'>" + dataArray[i].param2 + "</td>";
        row += "<td>" + dataArray[i].param4 + "</td>";
        row += "<td>" + dataArray[i].param3 + "</td>";
        row += "<td><img src='" + dataArray[i].param5 + "' width='50' height='50'/></td>";
        row += "<td>" + dataArray[i].param6 + "</td>";
        row += dataArray[i].param7 ? '<td><input type="checkbox" disabled checked></td>' : '<td><input type="checkbox" disabled></td>';
        row += "<td 'colspan='2' ><button class='btn btn-sm btn-primary edit-btn me-1' data-index='" + i + "'>Edit</button><button class='btn btn-sm btn-danger delete-btn' data-index='" + i + "'>Delete</button></td>";

        row += "</tr>";
    }
    $("#Productsku tbody").html(row);
}
$(document).on("click", "#SavedataBtn", function () {



    var productskuModel = JSON.stringify(dataArray); // send raw array
    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            new APICALL(GetGlobalURL('Base', 'SaveproductskuData'), 'POST', productskuModel, true).FETCH((result, error) => {

                if (result) {
                    Swal.fire({
                        icon: "success",
                        title: "Success...",
                        text: "productsku saved successfully!",
                    });
                    Clear();
                    dataArray = [];
                    $('#Productsku tbody').text('');
                    DataScreen = true;
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
//#endregion
//#region Datascreen
function GetproductData() {
    ShowLoader('productskuMasterDiv');

    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetactiveProductData'), 'GET', '', true).FETCH((result, error) => {
                if (result && result.data != null) {
                    productdata = result.data;

                    // Loop through each product dropdown in the table and populate it
                    $('#inputtable .product-dropdown').each(function () {
                        var $dropdown = $(this);

                        // Reset options
                        $dropdown.empty().append('<option value="">-- Select Product --</option>');

                        // Populate dropdown
                        $.each(productdata, function (i, option) {
                            $dropdown.append('<option value="' + option.ID + '">' + option.ProductName + '</option>');
                        });

                        // Initialize or re-initialize select2
                        if ($.fn.select2) {
                            if ($dropdown.hasClass("select2-hidden-accessible")) {
                                $dropdown.select2('destroy');
                            }

                            $dropdown.select2({
                                placeholder: "-- Select Product --",
                                allowClear: true,
                                width: 'resolve',
                                minimumResultsForSearch: 0
                            });
                        }
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

                HideLoader('productskuMasterDiv');
            });
        }
    });
}
$(document).on('click', '.edit-btn', function () {
    editIndex = $(this).data('index');
    var row = dataArray[editIndex];

    $('#Product').val(row.param2).trigger('change');
    $('#productsku').val(row.param4);
    $('#Amount').val(row.param6);
    $('#is-active').prop('checked', row.param7);

    
    $('#previewImage').attr('src', row.param5);
    $('#previewImage').show();
});
$(document).on('click', '.delete-btn', function () {
    var index = $(this).data('index');
    dataArray.splice(index, 1);
    RenderTable();
});

$(document).on('click', '#datascreenClearBtn', function () {
    DatascreenClear();
});
function validration() {
    var isValid = true;

    // Email Validation
    $(".form-select").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        
        if (val === "") {
            Swal.fire("Selection Required.");
            $(currentFieldId).focus();
            isValid = false;
            return false;
        }
    });
    $("[validate-email]").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        
        if (val === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            Swal.fire("Invalid email address.");
            $(currentFieldId).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    // Phone Validation
    $("[validate-phone]").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        if (val === "" || !/^[0-9]{10,15}$/.test(val)) {
            Swal.fire("Invalid phone number.");
            $(currentFieldId).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    // CNIC Validation
    $("[validate-cnic]").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        if (val === "" || !/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/.test(val)) {
            Swal.fire("Invalid CNIC. Format: 12345-1234567-1");
            $(currentFieldId).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    // Required Field
    $("[validate-required]").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        if (val === "") {
            Swal.fire("This field is required.");
            $(currentFieldId).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    // Number Field
    $("[validate-number]").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        if (val === "" || !/^\d+$/.test(val)) {
            Swal.fire("Only numbers are allowed.");
            $(currentFieldId).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    // File Field
    $("[validate-file]").each(function () {
        var fileInput = $(this)[0];
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        if ($('#previewImage').attr('src') == "") {
            // Check if a file is selected
            if (!fileInput.files || fileInput.files.length === 0) {
                Swal.fire("Please select a file.");
                $(currentFieldId).focus();
                isValid = false;
                return false;
            }

            // Optional: Check file type (e.g., only allow images)
            var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
            var fileName = fileInput.files[0].name;
            if (!allowedExtensions.exec(fileName)) {
                Swal.fire("Only JPG, JPEG, PNG, or PDF files are allowed.");
                $(this).val(""); // Clear the input
                $(currentFieldId).focus();
                isValid = false;
                return false;
            }

            // Optional: Check file size (e.g., max 2MB)
            var maxSize = 2 * 1024 * 1024; // 2MB
            if (fileInput.files[0].size > maxSize) {
                Swal.fire("File size must be less than 2MB.");
                $(this).val(""); // Clear the input
                $(currentFieldId).focus();
                isValid = false;
                return false;
            }
        }


    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

}
function Deleteproductsku(Id) {

    Swal.fire({
        title: 'Do you want to Delete the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            var dt = {
                Param1: Id
            }
            var productskuModel = JSON.stringify(dt); // Send array directly
            new APICALL(GetGlobalURL('Base', 'DeleteproductskuDataByid'), 'POST', productskuModel, true).FETCH((result, error) => {

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
                            text: "productsku Delete successfully!",
                        });

                        if ($('.savebutton').hasClass('d-none')) {
                            $('.savebutton').toggleClass('d-none');
                            $('.updatebutton').toggleClass('d-none');
                        }
                        Getproductsku();
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
function Getproductsku() {
    ShowLoader('ProductSkuDiv');

    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetMasterProductSkuData'), 'GET', '', true).FETCH((result, error) => {

                if (result) {

                    $('#Productskudata tbody').html('');
                    if (result.data != null) {
                        
                        $.each(result.data, function (i, option) {
                            var ActiveCell = option.IsActive
                                ? '<td><input type="checkbox" class="role-active checkboxsize" disabled checked></td>'
                                : '<td><input type="checkbox" class="role-active checkboxsize" disabled></td>';

                            var UpdateBtn = (data_[0].AllowUpdate === true)
                                ? '<td><button class="btn btn-sm btn-orange btn-block EditProductSku" data-value="' + option.ID + '" type="button"><i class="bx bxs-edit"></i></button></td>'
                                : '<td></td>';

                            var DeleteBtn = (data_[0].AllowDelete === true)
                                ? '<td><button class="btn btn-sm btn-gray btn-block DeleteProductSku" data-value="' + option.ID + '" type="button"><i class="bx bxs-trash"></i></button></td>'
                                : '<td></td>';

                            $('#Productskudata tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.CategoryName + '</td>' +
                                '<td>' + option.ProductName + '</td>' +
                                '<td>' + option.SkuName + '</td>' +
                                '<td><img src="' + option.Base64Image + '" width="50" height="50" /></td>' +
                                '<td>' + option.Amount + '</td>' +
                                ActiveCell +
                                UpdateBtn +
                                DeleteBtn +
                                '</tr>'
                            );

                        });
                        $('.EditProductSku').on('click', function () {
                            Editproductsku(this.attributes["data-value"].value);
                        });

                        $('.DeleteProductSku').on('click', function () {
                            Deleteproductsku(this.attributes["data-value"].value);
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

                DataScreen = false;
            });
            HideLoader('ProductSkuDiv');

        }
    });
}
function Editproductsku(Id) {
    var dt = {
        Param1: Id
    }
    var productskuModel = JSON.stringify(dt); // Send array directly
    new APICALL(GetGlobalURL('Base', 'GetProductSkuDataByid'), 'POST', productskuModel, true).FETCH((result, error) => {

        if (result) {

            if (result.data.length > 0) {
                $("#UpdateDiv").show();

                if ($("#updateform tbody tr").length === 0) {
                    $("#UpdateDiv tbody").append(Updateformhtml);


                    if (productdata?.length > 0) {
                        $('#updateProduct').empty().append('<option value="">-- Select Product --</option>');
                        $.each(productdata, function (i, option) {
                            $('#updateProduct').append(
                                '<option value="' + option.ID + '">' + option.ProductName + '</option>'
                            );
                        });

                        if ($.fn.select2) {
                            $('#updateProduct').select2({
                                placeholder: "-- Select Product --",
                                allowClear: true,
                                width: 'resolve',
                                minimumResultsForSearch: 0
                            });
                        }
                    }
                }


                var ID = result.data[0].ID;
                var ProductID = result.data[0].ProductID;
                var SkuName = result.data[0].SkuName;
                var Amount = result.data[0].Amount;
                var Base64Image = result.data[0].Base64Image;
                var IsActive = result.data[0].IsActive;

                $('#updateproductskuid').val(ID);
                $('#updateProduct').val(ProductID).trigger('change');
                $('#updateproductsku').val(SkuName);
                $('#updateAmount').val(Amount);
                $('#updateis-active').prop('checked', IsActive);
                $('#updatepreviewImage').attr('src', Base64Image);
                $('#updatepreviewImage').show();

                if ($('.UpdateNewBtn').hasClass('d-none')) {
                    $('.updatesavebutton').toggleClass('d-none');
                    $('.UpdateNewBtn').toggleClass('d-none');
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
$(document).on('click', '#UpdateNewBtn', function () {
    var file = $('#updateimagefile')[0].files[0]; // Move this to top
    var reader = new FileReader(); // Make sure reader is defined
    var base64String = "";

    reader.onload = function (event) {
        base64String = file ? event.target.result : $('#updatepreviewImage').attr('src');
        var imageName = file ? file.name : "";

        var entry = {
            param1: $('#updateproductskuid').val(),
            param2: $('#updateProduct').val(),
            param3: $('#updateProduct option:selected').text(),
            param4: $('#updateproductsku').val(),
            param5: base64String,
            param6: $('#updateAmount').val(),
            param7: $('#updateis-active').is(':checked'),
            param8: imageName
        };

        UpdatedataArray.push(entry);

        var productskuModel = JSON.stringify(UpdatedataArray);

        Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Ok',
            denyButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                new APICALL(GetGlobalURL('Base', 'SaveproductskuData'), 'POST', productskuModel, true).FETCH((result, error) => {
                    if (result) {
                        Swal.fire({
                            icon: "success",
                            title: "Success...",
                            text: "productsku Updated successfully!",
                        });
                        Clear();
                        UpdatedataArray = [];
                        $("#UpdateDiv tbody").text('');
                        
                        $("#UpdateDiv").hide();
                        Getproductsku();
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
    };

    // Call reader.onload with file or fallback
    if (file) {
        reader.readAsDataURL(file);
    } else {
        // Manually trigger the reader.onload with existing image
        reader.onload({ target: { result: $('#UpdateDiv #previewImage').attr('src') } });
    }
});
function DatascreenClear() {

    $('#updateproductskuid').val('');
    $('#updateProduct').val('').trigger('change');
    $('#updateproductsku').val('');
    $('#updateAmount').val('');
    $('#updateis-active').prop('checked', true);
    $('#updatepreviewImage').attr('src', '');
    $('#updatepreviewImage').hide();
}

//#endregion