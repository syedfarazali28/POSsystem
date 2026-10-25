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
  <table class="table table-striped table-bordered" id="stockTable">
    <thead >
      <tr>
        <th style="width: 50px;">#</th>
        <th>Product Name</th>
        <th class="text-end">Opening Qty</th>
        <th>Date</th>
        <th class="text-end">Debit Amount</th>
        <th class="text-end">Credit Amount</th>
        <th>Narration</th>
        <th>Voucher Type</th>
      </tr>
    </thead>
    <tbody></tbody>
    <tfoot>
      <tr>
        <th colspan="4" class="text-dark">Total:</th>
        <th id="totalDebit" class="text-dark"></th>
        <th id="totalCredit" class="text-dark"></th>
        <th colspan="2"></th>
      </tr>
    </tfoot>
  </table>
</div>


`;
function ClearStockOpeningBalance() {

    // Clear input fields
    $("#Date").val("");
    $(".qty").val("1");
    $(".price").val("1");
    $(".Total").val("1");

    // Reset dropdowns
    $("#Categorydata").val("").trigger("change"); // Reset the value
    $("#ProductID").val("").trigger("change"); // Reset the value
    $("#productsku").val("").trigger("change"); // Reset the value

    // Remove validation border (if you're using it)
    $("[validate-required]").removeClass("input-error");

}

$(document).ready(function () {
    //$('#Purchaseform form').append(_html);
    GetCategoryData();
    GetStockOpeningBalance();
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
    var Category = $('#Categorydata').val();
    var ProductID = $('#ProductID').val();
    var productsku = $('#productsku').val();
    var qty = $('.qty').val();
    var price = $('.price').val();
    var Total = $('.Total').val();
    
    // Prepare object for API
    var obj = {
        param1: Dates,
        param2: Category,
        param3: ProductID,
        param4: productsku,
        param5: qty,
        param6: price,
        param7: Total
        
    };

    var SaveModel = JSON.stringify(obj);

    // API Call
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'SaveStockOpeningBalance'), 'POST', SaveModel, true).FETCH((result, error) => {
                if (result && result.data != null) {
                    GetStockOpeningBalance();
                    Swal.fire({
                        icon: 'success',
                        title: 'Saved',
                        text: 'Opening balance added successfully.'
                    });
                   
                    // Reset fields after save
                    ClearStockOpeningBalance();

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
        }
    });
}

$(document).on('keyup', '.qty, .price', function () {
    var qty = $(".qty").val() || 0;
    var price = $(".price").val() || 0;
    var total = qty * price;
    $(".Total").val(total);
});


function GetStockOpeningBalance() {
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetStockOpeningBalance'), 'GET', '', true)
                .FETCH((result, error) => {
                    if (result && result.data) {
                        var tbody = $("#stockTable tbody");
                        tbody.empty();

                        var totalDebit = 0, totalCredit = 0;

                        $.each(result.data, function (i, row) {
                            // Safe parsing
                            var qty = row.OpeningQty || 0;
                            var debitAmount = row.DebitAmount || 0;
                            var creditAmount = row.CreditAmount || 0;

                            // Format date (dd/MM/yyyy)
                            var date = row.OpeningDate ? new Date(row.OpeningDate) : null;
                            var formattedDate = date ? date.toLocaleDateString("en-GB") : "";

                            // Format numbers with commas
                            var debit = debitAmount.toLocaleString("en-US", { minimumFractionDigits: 2 });
                            var credit = creditAmount.toLocaleString("en-US", { minimumFractionDigits: 2 });

                            // Running totals
                            totalDebit += debitAmount;
                            totalCredit += creditAmount;

                            // Append row
                            tbody.append(`
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${row.ProductName || ''}</td>
                                    <td class="text-end">${qty}</td>
                                    <td>${formattedDate}</td>
                                    <td class="text-end text-danger">${debit}</td>
                                    <td class="text-end text-success">${credit}</td>
                                    <td>${row.Narration || ''}</td>
                                    <td>${row.VoucherType || ''}</td>
                                </tr>
                            `);
                        });

                        // Set totals
                        $("#totalDebit").text(totalDebit.toLocaleString("en-US", { minimumFractionDigits: 2 }));
                        $("#totalCredit").text(totalCredit.toLocaleString("en-US", { minimumFractionDigits: 2 }));

                    } else {
                        $("#stockTable tbody").html(`
                            <tr>
                                <td colspan="8" class="text-center text-muted">No records found</td>
                            </tr>
                        `);
                        $("#totalDebit").text("0.00");
                        $("#totalCredit").text("0.00");
                    }

                    // Handle API error
                    if (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error...',
                            text: error.data?.responseText || 'Something went wrong',
                        });
                    }
                });
        }
    });
}

