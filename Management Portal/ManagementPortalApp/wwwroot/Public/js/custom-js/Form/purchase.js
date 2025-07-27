var _html = `
    <div class="row mb-3">
        <input type="hidden" id="PurchaseId" class="form-control">
        <div class="col-md-3">
            <label>Purchase Date</label>
            <small class="text-muted">*</small>
            <input type="date" id="PurchaseDate" validate-required class="form-control" required>
        </div>
        <div class="col-md-3">
            <label>Invoice Number <small class="text-muted">(Auto-generated)</small></label>
            <input type="text" readonly validate-required id="InvoiceNumber" class="form-control" placeholder="" required>
        </div>
        <div class="col-md-3">
            <label>Supplier</label>
            <small class="text-muted">*</small>
            <select id="SupplierID" validate-required class="form-control searchingenable" required>
                <option value="">-- Select Supplier --</option>
            </select>
        </div>
        <div class="col-md-3">
            <label>Payment Mode</label>
            <small class="text-muted">*</small>
            <select id="PaymentModeID" validate-required class="form-control searchingenable">
                <option value="">-- Select Payment Mode --</option>
            </select>
        </div>
         <div class="col-md-3">
            <label>Stock Location</label>
            <small class="text-muted">*</small>
            <select id="stocklocID" validate-required class="form-control searchingenable">
                <option value="">-- Select Stock Location --</option>
            </select>
        </div>
    </div>

    <div class="row mb-3">
        <div class="col-md-3">
            <label>Upload Physical Bill Image</label>
            <input type="file" id="BillImage" class="form-control" accept="image/*">
        </div>
    </div>

    <div class="table-responsive">
        <table class="table table-bordered" id="purchaseTable">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Barcode</th>
                    <th>Expiry Date</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Bonus</th>
                    <th><button type="button" class="btn btn-sm btn-success" id="addRow"><i class="bx bx-plus"></i></button></th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <div class="row mb-3">
        <div class="col-md-12 text-end">
            <h5>Total Amount: <span id="totalAmount">0</span></h5>
        </div>
    </div>
    <div class="row mb-3">
        <div class="col-md-12 text-end">
            <h5 disable>Supplier Balance: <span id="Balance">0</span></h5>
        </div>
    </div>

    <div class="row mb-3">
        <div class="col-md-12">
            <label>Remarks</label>
            <textarea id="Remarks" class="form-control" rows="2" placeholder="Optional remarks"></textarea>
        </div>
    </div>

    
`;
var DataScreen = true;
$(document).ready(function () {
    $('#tabs').tabs({
        activate: function (event, ui) {

            if (ui.newPanel.attr("id") == "DataScreen") {
                if (DataScreen) {
                    Getproductsku();

                }
            }
        }
    });
    $('#Purchaseform form').append(_html);
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('PurchaseDate').value = today;
    GetInvoiceno();
    GetSupplyActiveData();
    GetPaymentModeData();
    GetStockLocationTypeData();
    updateDateTime(); // initial call
    setInterval(updateDateTime, 1000); // update every second
});
function GetCategoryData(targetDropdown) {
    ShowLoader('CategoryMasterDiv');

    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetMapCategory'), 'GET', '', true).FETCH((result, error) => {
                if (result && result.data != null) {
                    // Populate only the target dropdown
                    targetDropdown.empty().append('<option value="">-- Select Category --</option>');
                    $.each(result.data, function (i, option) {
                        targetDropdown.append(
                            '<option value="' + option.ID + '">' + option.CategoryName + '</option>'
                        );
                    });

                    if ($.fn.select2 && targetDropdown.hasClass("select2-hidden-accessible")) {
                        targetDropdown.select2('destroy');
                    }

                    targetDropdown.select2({
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

                HideLoader('CategoryMasterDiv');
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
$(document).on('click', '#addRow', function () {
    var val = $('#SupplierID').val().trim();
    var currentFieldId = $('#SupplierID').attr("id") || "[No ID]";
    if (val === "") {
        Swal.fire("Supplier field is required.");
        $("#" + currentFieldId).focus();
        return false;
    }

    // Generate a unique row ID or index for radio name
    var uniqueId = Date.now(); // You can also use a counter variable

    var rowHtml = `
    <tr>
         <td>
            <div class="form-check form-check-inline">
                <input class="form-check-input transaction-type" name="type_${uniqueId}" type="radio" value="Purchase" checked>
                <label class="form-check-label">Purchase</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input transaction-type" name="type_${uniqueId}" type="radio" value="Return">
                <label class="form-check-label">Return</label>
            </div>
        </td>

        <td><select class="form-control category"></select></td>
        <td><select class="form-control product"></select></td>
        <td><select class="form-control sku"></select></td>
        <td><input type="text" class="form-control barcode" placeholder="Scan or enter" /></td>
        <td><input type="date" class="form-control expirydate" /></td>
        <td><input type="number" class="form-control qty" min="1" value="1" /></td>
        <td><input type="number" class="form-control price" min="0" value="0" /></td>
        <td class="total">0.00</td>
        <td><input type="checkbox" class="form-check-input isBonus" title="Bonus Product" /></td>
        <td><button type="button" class="btn btn-sm btn-danger removeRow"><i class="bx bx-minus"></i></button></td>
    </tr>`;

    var $newRow = $(rowHtml);
    $('#purchaseTable tbody').append($newRow);

    var $categoryDropdown = $newRow.find('.category');
    GetCategoryData($categoryDropdown);

    $newRow.find('.product').select2({
        placeholder: "-- Select Product--",
        allowClear: true,
        width: 'resolve',
        minimumResultsForSearch: 0
    });

    $newRow.find('.sku').select2({
        placeholder: "-- Select Productsku--",
        allowClear: true,
        width: 'resolve',
        minimumResultsForSearch: 0
    });

    recalculateTotal();
});

$(document).on('click', '.removeRow', function () {
    $(this).closest('tr').remove();
    recalculateTotal();
});

$(document).on('input', '.qty, .price', function () {
    var row = $(this).closest('tr');
    var qty = parseFloat(row.find('.qty').val()) || 0;
    var price = parseFloat(row.find('.price').val()) || 0;
    row.find('.total').text((qty * price).toFixed(2));
    recalculateTotal();
});

$(document).on('click', '.removeRow', function () {
    $(this).closest('tr').remove();
    recalculateTotal();
});


$(document).on('input change', '.qty, .price, .transaction-type, .isBonus', function () {
    recalculateTotal();
});
function recalculateTotal() {
    var total = 0;
    $('#purchaseTable tbody tr').each(function () {
        var row = $(this);
        var qty = parseFloat(row.find('.qty').val()) || 0;
        var price = parseFloat(row.find('.price').val()) || 0;
        var isBonus = row.find('.isBonus').is(':checked');
        var type = row.find('.transaction-type:checked').map(function () {
            return $(this).val();
        }).get();


        var rowTotal = qty * price;

        if (isBonus) {
            rowTotal = 0;
            row.find('.price').val(); // Optional force
        }
        if (type.includes("Return")) {
            rowTotal = -rowTotal;
        }

        row.find('.total').text(rowTotal.toFixed(2));
        total += rowTotal;
    });

    $('#totalAmount').text(total.toFixed(2));
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
    $('#currentDateTime').text(formattedDate);
}
function GetInvoiceno() {


    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetInvoiceno'), 'GET', '', true).FETCH((result, error) => {

                if (result) {


                    if (result.data != null) {

                        $("#InvoiceNumber").val(result.data[0].PO);
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
function GetSupplyActiveData() {


    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetSupplyActiveData'), 'GET', '', true).FETCH((result, error) => {

                if (result.data != null) {


                    $('#SupplierID').empty().append('<option value="">-- Select Supplies --</option>');
                    $.each(result.data, function (i, option) {
                        $('#SupplierID').append(
                            '<option value="' + option.ID + '">' + option.SupplierName + '</option>'
                        );
                    });

                    if ($.fn.select2 && $('#SupplierID').hasClass("select2-hidden-accessible")) {
                        $('#SupplierID').select2('destroy');
                    }

                }

                $('#SupplierID').select2({
                    placeholder: "-- Select Supplies --",
                    allowClear: true,
                    width: 'resolve',
                    minimumResultsForSearch: 0
                });

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
function GetPaymentModeData() {


    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetPaymentModeData'), 'GET', '', true).FETCH((result, error) => {

                if (result.data != null) {


                    $('#PaymentModeID').empty().append('<option value="">-- Select PaymentMode --</option>');
                    $.each(result.data, function (i, option) {
                        $('#PaymentModeID').append(
                            '<option value="' + option.ID + '">' + option.PaymentModeName + '</option>'
                        );
                    });

                    if ($.fn.select2 && $('#PaymentModeID').hasClass("select2-hidden-accessible")) {
                        $('#PaymentModeID').select2('destroy');
                    }

                }

                $('#PaymentModeID').select2({
                    placeholder: "-- Select Payment Mode --",
                    allowClear: true,
                    width: 'resolve',
                    minimumResultsForSearch: 0
                });

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
function GetStockLocationTypeData() {


    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetStockLocationTypeData'), 'GET', '', true).FETCH((result, error) => {

                if (result.data != null) {


                    $('#stocklocID').empty().append('<option value="">-- Select PaymentMode --</option>');
                    $.each(result.data, function (i, option) {
                        $('#stocklocID').append(
                            '<option value="' + option.Id + '">' + option.StockName + '</option>'
                        );
                    });

                    if ($.fn.select2 && $('#stocklocID').hasClass("select2-hidden-accessible")) {
                        $('#stocklocID').select2('destroy');
                    }

                }

                $('#stocklocID').select2({
                    placeholder: "-- Select Stock Location --",
                    allowClear: true,
                    width: 'resolve',
                    minimumResultsForSearch: 0
                });
                if ($('#stocklocID option[value="1"]').length > 0) {
                    $('#stocklocID').val(1).trigger('change');
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
$(document).on('change', '.category', function () {
    var categoryID = $(this).val();
    var $row = $(this).closest('tr');
    var $productDropdown = $row.find('.product');
    GetProductByCategoryID(categoryID, $productDropdown);
});
function GetProductByCategoryID(categoryID, targetDropdown) {
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
$(document).on('change', '.product', function () {
    var productID = $(this).val();
    var $row = $(this).closest('tr');
    var $skuDropdown = $row.find('.sku');
    GetProductskuByProductID(productID, $skuDropdown);
});
function GetProductskuByProductID(productID, targetDropdown) {
    if (!productID) {
        targetDropdown.empty().append('<option value="">-- Select Sku --</option>');
        return;
    }


    var dt = {
        Param1: productID
    }
    var productModel = JSON.stringify(dt); // Send array directly

    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetProductskuByProductID'), 'POST', productModel, true).FETCH((result, error) => {
                if (result && result.data != null) {
                    targetDropdown.empty().append('<option value="">-- Select ProductSku --</option>');
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
$(document).on('change', '#SupplierID', function () {
    var id = $('#SupplierID').val();
    if (id == '') {
        return;
    }
    var dt = {
        Param1: id
    }

    var supplierModel = JSON.stringify(dt); // Send array directly

    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetSupplierBalance'), 'POST', supplierModel, true).FETCH((result, error) => {

                if (result) {


                    if (result.data != null) {

                        $("#Balance").text(result.data[0].Balance);
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
});
$(document).on('change', '#SupplierID', function () {
    var id = $('#SupplierID').val();
    if (id == '') {
        return;
    }
    var dt = {
        Param1: id
    }

    var supplierModel = JSON.stringify(dt); // Send array directly

    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetSupplierBalance'), 'POST', supplierModel, true).FETCH((result, error) => {

                if (result) {


                    if (result.data != null) {

                        $("#Balance").text(result.data[0].Balance);
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
});


$(document).on('click', '#ClearForm', function () {
    Clear();
});
function Clear() {
    $('#Purchaseform form').html('');
    $('#Purchaseform form').append(_html);
    
    recalculateTotal();
    GetSupplyActiveData();
    GetPaymentModeData();
    GetInvoiceno();
    GetStockLocationTypeData();
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('PurchaseDate').value = today;
}
$(document).on('change', '.sku', function () {
    var skuID = $(this).val();
    var $row = $(this).closest('tr');
    var $price = $row.find('.price');
    GetPriceBysku(skuID, $price);
});

function GetPriceBysku(skuID, targetDropdown) {

    var dt = {
        Param1: skuID
    }
    var CategoryModel = JSON.stringify(dt); // Send array directly

    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetPriceByskuID'), 'POST', CategoryModel, true).FETCH((result, error) => {
                if (result && result.data != null) {
                    targetDropdown.val(result.data[0].Amount);
                    recalculateTotal();
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
$(document).on('click', '#SaveBtn', function () {
    var rowsData = [];

    $('#purchaseTable tbody tr').each(function () {
        var $row = $(this);

        var transactionType = $row.find('.transaction-type:checked').val();
        var categoryId = $row.find('.category').val();
        var productId = $row.find('.product').val();
        var skuId = $row.find('.sku').val();
        var barcode = $row.find('.barcode').val().trim();
        var expiryDate = $row.find('.expirydate').val();
        var qty = parseFloat($row.find('.qty').val()) || 0;
        var price = parseFloat($row.find('.price').val()) || 0;
        var isBonus = $row.find('.isBonus').is(':checked') ? true : false;
        var total = parseFloat($row.find('.total').text()) || 0;

        rowsData.push({
            param1: transactionType,
            param2: categoryId,
            param3: productId,
            param4: skuId,
            param5: barcode,
            param6: expiryDate,
            param7: qty,
            param8: price,
            param9: total,
            param10: isBonus
        });
    });

    var PurchaseDate = $('#PurchaseDate').val();
    var InvoiceNumber = $('#InvoiceNumber').val();
    var SupplierID = $('#SupplierID').val();
    var stocklocID = $('#stocklocID').val();
    var PaymentModeID = $('#PaymentModeID').val();
    var Remarks = $('#Remarks').val();
    var totalAmount = $('#totalAmount').text();
    var file = $('#BillImage')[0].files[0];

    // If file exists, read it as base64
    if (file) {
        var reader = new FileReader();
        reader.onload = function (event) {
            prepareAndLog(event.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        prepareAndLog(""); // No file
    }
    function prepareAndLog(base64String) {
        var obj = {
            param1: PurchaseDate,
            param2: InvoiceNumber,
            param3: SupplierID,
            param4: PaymentModeID,
            param5: base64String || "",
            param6: totalAmount,
            param7: Remarks,
            param8: stocklocID,
            List: rowsData
        };

        
        var CategoryModel = JSON.stringify(obj); // Send array directly

        UTILITY.CheckSession((data_) => {
            if (data_) {
                new APICALL(GetGlobalURL('Base', 'SavePurchaseWithDetails'), 'POST', CategoryModel, true).FETCH((result, error) => {
             
                    if (result.data == false) {
                        Swal.fire({
                            icon: "info",
                            title: "Retry Again...",
                            text: "Purchase was not saved. Please create it again!",
                        });
                    }
                    else if (result && result.data != null) {
                        Clear()
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

   


});

$(document).on('blur', '.barcode', function () {
    var barcode = $(this).val();

    if (!barcode) return; // Skip if empty

    var dt = {
        Param1: barcode
    };

    var productskuModel = JSON.stringify(dt);

    new APICALL(GetGlobalURL('Base', 'CheckBarcodeDuplication'), 'POST', productskuModel, true).FETCH((result, error) => {
        if (result) {
            if (result && result.data.length > 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Duplicate Barcode',
                    text: 'This barcode already exists. Please enter a unique barcode.',
                });
                $(this).val('').focus(); // Clear and focus again
            }
        }

        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: error.data?.responseText || 'Something went wrong.',
            });
        }
    });
});
