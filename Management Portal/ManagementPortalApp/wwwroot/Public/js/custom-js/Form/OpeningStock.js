var _html = `
    <div class="row mb-3">
        <div class="col-md-4">
            <label>Date</label>
            <small class="text-muted">*</small>
            <input type="date" id="Date" validate-required class="form-control" required>
        </div>
          <div class="col-md-4">
            <label>Category</label>
            <small class="text-muted">*</small>
            <select id="Categorydata" validate-required class="form-control searchingenable" required>
                <option value="">-- Select Category --</option>
            </select>
        </div>
          <div class="col-md-4">
            <label>Products</label>
            <small class="text-muted">*</small>
            <select id="ProductID" validate-required class="form-control searchingenable" required>
                <option value="">-- Select Products --</option>
            </select>
        </div>
           <div class="col-md-4">
            <label>Product Sku</label>
            <small class="text-muted">*</small>
            <select id="productsku" validate-required class="form-control searchingenable" required>
                <option value="">-- Select Sku --</option>
            </select>
        </div>

        <div class="col-md-4">
            <label>Quantity</label>
            <small class="text-muted">*</small>
           <input type="number" class="form-control qty" min="1" value="1" title="Quantity" />
        </div>
        <div class="col-md-4">
            <label>Unit Price</label>
            <small class="text-muted">*</small>
           <input type="number" class="form-control price" min="1" value="1" title="price" />
        </div>
        <div class="col-md-4">
            <label>Total Price</label>
            <small class="text-muted">*</small>
           <input type="number" class="form-control Total" readonly min="1" value="1" title="price" />
        </div>
        <div class="col-md-3 mt-3">
              <button type="button" class="btn btn-primary btn-orange me-2" id="SaveBtn"><i class="bx bxs-save pe-2"></i>Add Opening Balance</button>
        </div>
    
    </div>

    <div class="table-responsive">
     <table class="table table-bordered table-striped table-hover" id="LedgerEntry">
    <thead class="table-primary text-center">
        <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Explanation</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Balance</th>
        </tr>
    </thead>
    <tbody></tbody>
</table>
    </div>
`;

$(document).ready(function () {
    $('#Purchaseform form').append(_html);
    GetCategoryData();
    updateDateTime(); // initial call
    setInterval(updateDateTime, 1000); // update every second
});
function GetCategoryData() {
    
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetMapCategory'), 'GET', '', true).FETCH((result, error) => {
                if (result && result.data != null) {
                    // Populate only the target dropdown
                    $("#Categorydata").empty().append('<option value="">-- Select Category --</option>');
                    $.each(result.data, function (i, option) {
                        $("#Categorydata").append(
                            '<option value="' + option.ID + '">' + option.CategoryName + '</option>'
                        );
                    });

                    if ($.fn.select2 && $("#Categorydata").hasClass("select2-hidden-accessible")) {
                        $("#Categorydata").select2('destroy');
                    }

                    $("#Categorydata").select2({
                        placeholder: "-- Select Category --",
                        allowClear: true,
                        width: 'resolve',
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
        }
    });

}
function updateDateTime() {
    var now = new Date();
    var options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    var formattedDate = now.toLocaleString('en-US', options);
    $('#currentDateTime').text(formattedDate); // ✅ jQuery version
}
$(document).on('click', '#SaveBtn', function () {

    // Get form values
    var Dates = $('#Date').val();
    var CategoryID = $('#Categorydata').val();
    var ProductID = $('#ProductID').val();
    var ProductSku = $('#productsku').val();
    var Qty = $('.qty').val();
    var Price = $('.price').val();
    var Total = $('.Total').val();

    // Validation check
    if (!Dates || !CategoryID || !ProductID || !ProductSku || !Qty || !Price) {
        Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: 'Please fill all required fields.',
        });
        return;
    }

    // Prepare object for API
    var obj = {
        param1: Dates,
        param2: CategoryID,
        param3: ProductID,
        param4: ProductSku,
        param5: Qty,
        param6: Price,
        param7: Total
    };

    var SaveModel = JSON.stringify(obj);

    // API Call
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'SaveStockOpeningBalance'), 'POST', SaveModel, true).FETCH((result, error) => {
                if (result && result.data != null) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Saved',
                        text: 'Opening balance added successfully.'
                    });

                    // Reset fields after save
                    $('#Date').val('');
                    $('#Categorydata').val('');
                    $('#ProductID').val('');
                    $('#productsku').val('');
                    $('.qty').val(1);
                    $('.price').val(1);
                    $('.Total').val(1);
                    
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

});

$(document).on('change', '#Categorydata', function () {
    /*if (isEditingRow) return;*/
    var categoryID = $(this).val();
    GetProductByCategoryID(categoryID);


});
function GetProductByCategoryID(categoryID) {
    var targetDropdown = $("#ProductID");
    if (!categoryID) {

        targetDropdown.empty().append('<option value="">-- Select Product --</option>');
        
        return;
    }


    var dt = {
        Param1: categoryID
    }
    var CategoryModel = JSON.stringify(dt); // Send array directly

    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetProductByCategoryID'), 'POST', CategoryModel, true).FETCH((result, error) => {
                if (result && result.data != null) {
                    targetDropdown.empty().append('<option value="">-- Select Product --</option>');
                    $.each(result.data, function (i, option) {
                        targetDropdown.append('<option value="' + option.ID + '">' + option.ProductName + '</option>');
                    });

                    if ($.fn.select2 && targetDropdown.hasClass("select2-hidden-accessible")) {
                        targetDropdown.select2('destroy');
                    }

                    targetDropdown.select2({
                        placeholder: "-- Select Product --",
                        allowClear: true,
                        width: 'resolve',
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
        }
    });
}
$(document).on('change', '#ProductID', function () {
    var productID = $(this).val();
    GetProductskuByProductID(productID);
});
function GetProductskuByProductID(productID) {
    
    if (!productID) {
        $("#productsku").empty().append('<option value="">-- Select Sku --</option>');
        HideLoader2("purchase-row");
        return;
    }


    var dt = {
        Param1: productID
    }
    var productModel = JSON.stringify(dt);

    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetProductskuByProductID'), 'POST', productModel, true).FETCH((result, error) => {
                if (result && result.data != null) {
                    $("#productsku").empty().append('<option value="">-- Select ProductSku --</option>');
                    $.each(result.data, function (i, option) {
                        $("#productsku").append('<option value="' + option.ID + '">' + option.ProductName + '</option>');
                    });

                    if ($.fn.select2 && $("#productsku").hasClass("select2-hidden-accessible")) {
                        $("#productsku").select2('destroy');
                    }

                    $("#productsku").select2({
                        placeholder: "-- Select Product --",
                        allowClear: true,
                        width: 'resolve',
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
        }
    });
}

$(document).on('keyup', '.qty, .price', function () {
    var qty = $(".qty").val() || 0;
    var price = $(".price").val() || 0;
    var total = qty * price;
    $(".Total").val(total);
});