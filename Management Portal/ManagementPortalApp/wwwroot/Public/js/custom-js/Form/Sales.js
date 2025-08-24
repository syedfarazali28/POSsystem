var DataScreen = true;
var isEditingRow = false;
$(document).ready(function () {

    $('#tabs').tabs({
        activate: function (event, ui) {

            if (ui.newPanel.attr("id") == "DataScreen") {
                if (DataScreen) {

                    GetPurchase();
                }
            }
        }
    });
    //$('#Purchaseform form').append(_html);
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('SaleDate').value = today;
    GetInvoiceno();
    GetCustomerActiveData();
    GetPaymentModeData();
    GetStockLocationTypeData();
    updateDateTime();
    GetCategoryData();
    GetactiveProductData();
    GetactiveProductskuData();
    setInterval(updateDateTime, 1000); // update every second
});

function GetInvoiceno() {


    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetInvoiceno'), 'GET', '', true).FETCH((result, error) => {

                if (result) {


                    if (result.data != null) {

                        $("#InvoiceNumber").val(result.data[0].INV);
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
function GetCustomerActiveData() {


    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetCustomerActiveData'), 'GET', '', true).FETCH((result, error) => {

                if (result.data != null) {


                    $('#CustomerID').empty().append('<option value="">-- Select Customer --</option>');
                    $.each(result.data, function (i, option) {
                        $('#CompanyID').append(
                            '<option value="' + option.ID + '">' + option.CompanyName + '</option>'
                        );
                    });

                    if ($.fn.select2 && $('#CustomerID').hasClass("select2-hidden-accessible")) {
                        $('#CustomerID').select2('destroy');
                    }

                }

                $('#CustomerID').select2({
                    placeholder: "-- Select Customer --",
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

function GetStatusData() {


    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetStatusData'), 'GET', '', true).FETCH((result, error) => {

                if (result.data != null) {


                    $('#StatusID').empty().append('<option value="">-- Select Status --</option>');
                    $.each(result.data, function (i, option) {
                        $('#StatusID').append(
                            '<option value="' + option.ID + '">' + option.Status + '</option>'
                        );
                    });

                    if ($.fn.select2 && $('#StatusID').hasClass("select2-hidden-accessible")) {
                        $('#StatusID').select2('destroy');
                    }

                }

                $('#StatusID').select2({
                    placeholder: "-- Select Status --",
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
function GetCategoryData() {
    ShowLoader2("purchase-row");
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetMapCategory'), 'GET', '', true).FETCH((result, error) => {
                if (result && result.data != null) {
                    // Populate only the target dropdown
                    $("#category").empty().append('<option value="">-- Select Category --</option>');
                    $.each(result.data, function (i, option) {
                        $("#category").append(
                            '<option value="' + option.ID + '">' + option.CategoryName + '</option>'
                        );
                    });

                    if ($.fn.select2 && $("#category").hasClass("select2-hidden-accessible")) {
                        $("#category").select2('destroy');
                    }

                    $("#category").select2({
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
$(document).on('change', '#category', function () {
    if (isEditingRow) return;
    ShowLoader2("purchase-row");
    var categoryID = $(this).val();
    GetProductByCategoryID(categoryID);

    
});
function GetProductByCategoryID(categoryID) {
    var targetDropdown = $("#product");
    if (!categoryID) {

        targetDropdown.empty().append('<option value="">-- Select Product --</option>');
        HideLoader2("purchase-row");
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
                    HideLoader2("purchase-row");
                }

                if (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: error.data.responseText,
                        footer: ''
                    });
                }
                HideLoader2("purchase-row");
            });
        }
    });
}
function GetactiveProductData() {
    ShowLoader2("purchase-row");
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetactiveProductData'), 'GET', '', true).FETCH((result, error) => {
                if (result && result.data != null) {
                    // Populate only the target dropdown
                    $("#product").empty().append('<option value="">-- Select Product --</option>');
                    $.each(result.data, function (i, option) {
                        $("#product").append(
                            '<option value="' + option.ID + '">' + option.CategoryName + '</option>'
                        );
                    });

                    if ($.fn.select2 && $("#product").hasClass("select2-hidden-accessible")) {
                        $("#product").select2('destroy');
                    }

                    $("#product").select2({
                        placeholder: "-- Select Product --",
                        allowClear: true,
                        width: 'resolve',
                        minimumResultsForSearch: 0
                    });
                    HideLoader2("purchase-row");
                }

                if (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: error.data.responseText,
                        footer: ''
                    });
                }
                HideLoader2("purchase-row");
            });
        }
    });
}
$(document).on('change', '#product', function () {
    if (isEditingRow) return;
    var productID = $(this).val();
    GetProductskuByProductID(productID);
});
function GetProductskuByProductID(productID) {
    ShowLoader2("purchase-row");
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
                    HideLoader2("purchase-row");
                }

                if (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: error.data.responseText,
                        footer: ''
                    });
                }
                HideLoader2("purchase-row");
            });
        }
    });
}
function GetactiveProductskuData() {
    ShowLoader2("purchase-row");
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetproductskuData'), 'GET', '', true).FETCH((result, error) => {
                if (result && result.data != null) {
                    // Populate only the target dropdown
                    $("#productsku").empty().append('<option value="">-- Select Product Sku --</option>');
                    $.each(result.data, function (i, option) {
                        $("#productsku").append(
                            '<option value="' + option.SkuID + '">' + option.SkuName + '</option>'
                        );
                    });

                    if ($.fn.select2 && $("#productsku").hasClass("select2-hidden-accessible")) {
                        $("#productsku").select2('destroy');
                    }

                    $("#productsku").select2({
                        placeholder: "-- Select Product Sku --",
                        allowClear: true,
                        width: 'resolve',
                        minimumResultsForSearch: 0
                    });
                    HideLoader2("purchase-row");
                }

                if (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: error.data.responseText,
                        footer: ''
                    });
                }
                HideLoader2("purchase-row");
            });
        }
    });
}
$(document).on('change', '.sku', function () {
    if (isEditingRow) return;
    var skuID = $(this).val();
    GetPriceBysku(skuID);
});
function GetPriceBysku(skuID) {
    ShowLoader2("purchase-row");
    if (!skuID) {
        HideLoader2("purchase-row");
        return;
    }
    var dt = {
        Param1: skuID
    }
    var CategoryModel = JSON.stringify(dt); // Send array directly

    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetPriceByskuID'), 'POST', CategoryModel, true).FETCH((result, error) => {
                if (result && result.data != null) {
                    $('#price').val(result.data[0].Amount);
                    var qty = parseFloat($('.qty').val()) || 0;
                    var price = parseFloat($('.price').val()) || 0;
                    $('#total').val((qty * price).toFixed(2));
                    
                    HideLoader2("purchase-row");
                }

                if (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: error.data.responseText,
                        footer: ''
                    });
                }
                HideLoader2("purchase-row");
            });
        }
    });
}
$(document).on("click", "#AddEntry", function () {
    var CompanyID = $('#CompanyID').val();
    if (CompanyID == null || CompanyID == undefined || CompanyID == "") {
        alert("please select Company");
        return;
    }
    var type = $(".transaction-type:checked").val();
    var category = $("#category").val();
    var categoryText = $("#category option:selected").text();

    var product = $("#product").val();
    var productText = $("#product option:selected").text();

    var sku = $("#productsku").val();
    var skuText = $("#productsku option:selected").text();

    var barcode = $(".barcode").val();
    var expiry = $(".expirydate").val();
    var qty = $(".qty").val();
    var price = $(".price").val();
    var total = (parseFloat(qty) * parseFloat(price)).toFixed(2);
    var isBonus = $(".isBonus").is(":checked") ? "Yes" : "No";

    if (!product || !sku || qty <= 0 || !expiry ){
        alert("Please select valid Product, SKU , expiry and Quantity.");
        return;
    }

    var row = '<tr>' +
        '<td>' + type + '</td>' +
        '<td data-id="' + category + '">' + categoryText + '</td>' +
        '<td data-id="' + product + '">' + productText + '</td>' +
        '<td data-id="' + sku + '">' + skuText + '</td>' +
        '<td>' + barcode + '</td>' +
        '<td>' + expiry + '</td>' +
        '<td>' + qty + '</td>' +
        '<td>' + price + '</td>' +
        '<td class="Total">' + total + '</td>' +
        '<td class="isBonus">' + isBonus + '</td>' +
        '<td>' +
        '<button class="btn btn-sm btn-orange btn-block edit-row" type="button"><i class="bx bxs-edit"></i></button>' +
        '</td>' +
        '<td>' +
        '<button class="btn btn-sm btn-gray btn-block delete-row" type="button"><i class="bx bxs-trash"></i></button>' +
        '</td>' +
        '</tr>';


    $("#purchaseTable tbody").append(row);
    recalculateTotal();
    
});
$(document).on("click", ".delete-row", function () {
    $(this).closest("tr").remove();
    recalculateTotal();
});
$(document).on("click", ".edit-row", function () {
    isEditingRow = true; // prevent change handlers from firing 
    var row = $(this).closest("tr");

    // Set back values into inputs
    $(".transaction-type[value='" + row.find("td:eq(0)").text() + "']").prop("checked", true);
    $("#category").val(row.find("td:eq(1)").data("id")).trigger("change");
    $("#product").val(row.find("td:eq(2)").data("id")).trigger("change");
    $("#productsku").val(row.find("td:eq(3)").data("id")).trigger("change");
    $(".barcode").val(row.find("td:eq(4)").text());
    $(".expirydate").val(row.find("td:eq(5)").text());
    $(".qty").val(row.find("td:eq(6)").text());
    $(".price").val(row.find("td:eq(7)").text());
    $(".isBonus").prop("checked", row.find("td:eq(9)").text() === "Yes");

    // Remove old row to replace on next add
    row.remove();
    recalculateTotal();
    var qty = parseFloat($('.qty').val()) || 0;
    var price = parseFloat($('.price').val()) || 0;
    $('#total').val((qty * price).toFixed(2));
    setTimeout(() => isEditingRow = false, 100);
});
$(document).on('input', '.qty, .price', function () {
    
    var qty = parseFloat($('.qty').val()) || 0;
    var price = parseFloat($('.price').val()) || 0;
    var total = qty * price;
    $('#total').val(total.toFixed(2));
    
});
function recalculateTotal() {
    var sum = 0;
    $("#purchaseTable tbody tr").each(function () {
        var val = parseFloat($(this).find(".Total").text()) || 0;
        sum += val;
    });
    $("#totalAmount").text(sum.toFixed(2));
}
function HideLoader2() {
    $('.loader-wrapper').addClass('d-none');
    $('.purchase-row').find('input, select, button').prop('disabled', false);
}
function ShowLoader2(targetClass) {
    const $target = $('.' + targetClass);
    const $loaderWrapper = $('.loader-wrapper');

    // Show loader and position it
    $loaderWrapper.removeClass('d-none');

    // Optional: disable inputs while loading
    $target.find('input, select, button').prop('disabled', true);
}
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
$(document).on("click", "#refresh", function () {


    var len = 20;
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var randomStr = "";
    for (var i = 0; i < len; i++) {
        var randIndex = Math.floor(Math.random() * charset.length);
        randomStr += charset[randIndex];
    }

    var now = new Date();
    var min = now.getMinutes().toString().padStart(2, '0');
    var sec = now.getSeconds().toString().padStart(2, '0');

    var barcode = randomStr + min + sec;

    $('.barcode').val(barcode);
});
$(document).on("click", "#ClearForm", function () {
    Clear();
});
function Clear() {
    
    $('#purchaseTable tbody').html('');
    $('#category').val('').trigger('change');
    $('#product').val('').trigger('change');
    $('#productsku').val('').trigger('change');
    $('.barcode').val('');
    $('#price').val('');
    $('#total').val('');
    $('.qty').val(1);
    $('.qty').val(1);
    $('#PurchaseDate').val('');
    $('#InvoiceNumber').val('');
    $('#CompanyID').val('');
    $('#stocklocID').val('');
    $('#PaymentModeID').val('');
    $('#Remarks').val('');
    $('#totalAmount').text('');
    $('#BillImage')[0].files[0] = Null;
}
function GetPurchase() {


    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetPurchase'), 'GET', '', true).FETCH((result, error) => {

                if (result) {

                    $('#purchase-master tbody').html('');
                    if (result.data != null) {

                        $.each(result.data, function (i, option) {
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-orange btn-block Editpurchase" data-value="' + option.PurchaseID + '" type="button"><i class="bx bxs-edit"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-gray btn-block Deletepurchase"  data-value="' + option.PurchaseID + '" type="button"><i class="bx bxs-trash"></i></button></td>' : '';

                            $('#purchase-master tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.InvoiceNumber + '</td>' +
                                '<td>' + option.PurchaseDate + '</td>' +
                                '<td>' + option.CompanyName + '</td>' +
                                '<td>' + option.TotalAmount + '</td>' +
                                '<td>' + option.PaymentModeName + '</td>' +
                                '<td>' + option.Remarks + '</td>' +
                                '<td><img class="phyimg" src="' + option.Base64Image + '" /></td>' +
                                '<td>' + option.CreatedDate + '</td>' +
                                '<td><button class="btn btn-sm btn-orange btn-block detailspurchase" data-value="' + option.PurchaseID + '" type="button"><i class="bx bx-detail"></i></button></td>' +

                                UpdateBtn +
                                DeleteBtn +
                                '</tr>'
                            );
                        });
                        $('.Editpurchase').on('click', function () {
                            Editpurchase(this.attributes["data-value"].value);
                        });

                        $('.Deletepurchase').on('click', function () {
                            //Deletecategory(this.attributes["data-value"].value);
                        });

                    }

                }
            });


        }
    });
}
$(document).on('click', '#SaveBtn', function () {
    var rowsData = [];

    $('#purchaseTable tbody tr').each(function () {
        var $row = $(this);

        var transactionType = $row.find('td:eq(0)').text().trim(); // "Purchase"
        var categoryId = $row.find('td:eq(1)').data('id');         // from data-id
        var productId = $row.find('td:eq(2)').data('id');
        var skuId = $row.find('td:eq(3)').data('id');
        var barcode = $row.find('td:eq(4)').text().trim();
        var expiryDate = $row.find('td:eq(5)').text().trim();
        var qty = parseFloat($row.find('td:eq(6)').text()) || 0;
        var price = parseFloat($row.find('td:eq(7)').text()) || 0;
        var total = parseFloat($row.find('td:eq(8)').text()) || 0;
        var isBonus = $row.find('td:eq(9)').text().trim().toLowerCase() === "yes";

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
    var CompanyID = $('#CompanyID').val();
    var stocklocID = $('#stocklocID').val();
    var PaymentModeID = $('#PaymentModeID').val();
    var Remarks = $('#Remarks').val();
    var totalAmount = $('#totalAmount').text();
    var file = $('#BillImage')[0].files[0];

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
            param3: CompanyID,
            param4: PaymentModeID,
            param5: base64String || "",
            param6: totalAmount,
            param7: Remarks,
            param8: stocklocID,
            List: rowsData
        };

        var CategoryModel = JSON.stringify(obj);

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
                        Swal.fire({
                            icon: "success",
                            title: "Success...",
                            text: "Purchase saved successfully!",
                        });
                      
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
function Editpurchase(id) {
    var purchaseId = id;

    UTILITY.CheckSession((data_) => {
        if (data_) {
            var dt = { Param1: purchaseId }
            var productModel = JSON.stringify(dt);

            new APICALL(GetGlobalURL('Base', 'GetPurchaseWithDataisById'), 'POST', productModel, true)
                .FETCH((result, error) => {

                    if (result) {
                        // Purchase header data
                        if (result.data.Table.length > 0) {
                            var PurchaseDate = new Date(result.data.Table[0].PurchaseDate);
                            $("#PurchaseDate").val(UTILITY.toLocaleDateString(PurchaseDate));
                            $("#PurchaseId").val(result.data.Table[0].PurchaseID);
                            $("#InvoiceNumber").val(result.data.Table[0].InvoiceNumber);
                            $("#Remarks").val(result.data.Table[0].Remarks);
                            $("#CompanyID").val(result.data.Table[0].CompanyID).trigger("change");
                            $("#PaymentModeID").val(result.data.Table[0].PaymentModeID).trigger("change");
                            $("#stocklocID").val(result.data.Table[0].LocationID).trigger("change");
                            $("#BillImagesrc").attr("src", result.data.Table[0].Base64Image);

                            // Tab switch
                            var index = $("a[href='#FormScreen']").closest("li").index();
                            $("#tabs").tabs("option", "active", index);
                            $(':focus').blur();
                            $("#tabs").tabs("option", "active", 0);

                            // Buttons
                            $("#UpdateBtn").removeClass("d-none");
                            $("#SaveBtn").addClass("d-none");
                        }

                        // Purchase detail rows
                        if (result.data.Table1.length > 0) {
                            $('#purchaseTable tbody').html('');

                            result.data.Table1.forEach(function (item) {
                                var type = "Purchase"; // agar API se type nahi aa raha to fixed
                                var category = item.CategoryID;
                                var categoryText = item.CategoryName;

                                var product = item.ProductID;
                                var productText = item.ProductName;

                                var sku = item.ProductSkuID;
                                var skuText = item.ProductName1;

                                var barcode = item.Barcode;
                                var expiry = UTILITY.toLocaleDateString(new Date(item.ExpiryDate));
                                var qty = item.Quantity;
                                var price = item.UnitPrice;
                                var total = parseFloat(item.Total).toFixed(2);
                                var isBonus = (item.IsBonus === "true" || item.IsBonus === true) ? "Yes" : "No";

                                var row = '<tr>' +
                                    '<td>' + type + '</td>' +
                                    '<td data-id="' + category + '">' + categoryText + '</td>' +
                                    '<td data-id="' + product + '">' + productText + '</td>' +
                                    '<td data-id="' + sku + '">' + skuText + '</td>' +
                                    '<td>' + barcode + '</td>' +
                                    '<td>' + expiry + '</td>' +
                                    '<td>' + qty + '</td>' +
                                    '<td>' + price + '</td>' +
                                    '<td class="Total">' + total + '</td>' +
                                    '<td class="isBonus">' + isBonus + '</td>' +
                                    '<td>' +
                                    '<button class="btn btn-sm btn-orange btn-block edit-row" type="button"><i class="bx bxs-edit"></i></button>' +
                                    '</td>' +
                                    '<td>' +
                                    '<button class="btn btn-sm btn-gray btn-block delete-row" type="button"><i class="bx bxs-trash"></i></button>' +
                                    '</td>' +
                                    '</tr>';

                                $("#purchaseTable tbody").append(row);
                            });

                            recalculateTotal();
                        }
                       
                    }
                });
        }
    });
}

$(document).on('change', '#CompanyID', function () {
    var id = $('#CompanyID').val();
    if (id == '') {
        return;
    }
    var dt = {
        Param1: id
    }

    var supplierModel = JSON.stringify(dt); // Send array directly

    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetCompanyBalance'), 'POST', supplierModel, true).FETCH((result, error) => {

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

$(document).on("click", ".detailspurchase", function () {
    var purchaseId = $(this).data("value");

    UTILITY.CheckSession((data_) => {

        if (data_) {
            var dt = {
                Param1: purchaseId
            }
            var productModel = JSON.stringify(dt); // Send array directly
            new APICALL(GetGlobalURL('Base', 'GetPurchaseDatais'), 'POST', productModel, true).FETCH((result, error) => {

                if (result) {

                    $('#purchasedatails-master tbody').html('');
                    if (result.data != null) {

                        $.each(result.data, function (i, option) {
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-orange btn-block Editpurchase" data-value="' + option.ID + '" type="button"><i class="bx bxs-edit"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-gray btn-block Deletepurchase"  data-value="' + option.ID + '" type="button"><i class="bx bxs-trash"></i></button></td>' : '';

                            $('#purchasedatails-master tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.SKU + '</td>' +
                                '<td>' + option.Barcode + '</td>' +
                                '<td>' + option.ExpiryDate + '</td>' +
                                '<td>' + option.IsBonus + '</td>' +
                                '<td>' + option.Quantity + '</td>' +
                                '<td>' + option.UnitPrice + '</td>' +
                                '<td>' + option.Total + '</td>' +
                                '</tr>'
                            );
                        });



                        $('.Editpurchase').on('click', function () {
                            //Editcategory(this.attributes["data-value"].value);
                        });

                        $('.Deletepurchase').on('click', function () {
                            //Deletecategory(this.attributes["data-value"].value);
                        });

                        // Modal show karo
                        $("#ModalActivepurchasedetails").modal("show");

                    }

                }
            });


        }
    });

});
$("#CloseModalBtn").click(function () {
    $("#ModalActivepurchasedetails").modal("hide");
});

$(document).on('click', '#UpdateBtn', function () {
    var rowsData = [];

    $('#purchaseTable tbody tr').each(function () {
        var $row = $(this);

        var transactionType = $row.find('td:eq(0)').text().trim(); // "Purchase"
        var categoryId = $row.find('td:eq(1)').data('id');         // from data-id
        var productId = $row.find('td:eq(2)').data('id');
        var skuId = $row.find('td:eq(3)').data('id');
        var barcode = $row.find('td:eq(4)').text().trim();
        var expiryDate = $row.find('td:eq(5)').text().trim();
        var qty = parseFloat($row.find('td:eq(6)').text()) || 0;
        var price = parseFloat($row.find('td:eq(7)').text()) || 0;
        var total = parseFloat($row.find('td:eq(8)').text()) || 0;
        var isBonus = $row.find('td:eq(9)').text().trim().toLowerCase() === "yes";

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
    var CompanyID = $('#CompanyID').val();
    var stocklocID = $('#stocklocID').val();
    var PaymentModeID = $('#PaymentModeID').val();
    var Remarks = $('#Remarks').val();
    var purchaseId = $("#PurchaseId").val()
    var totalAmount = $('#totalAmount').text();
    var file = $('#BillImage')[0].files[0];

    if (file) {
        var reader = new FileReader();
        reader.onload = function (event) {
            prepareAndLog(event.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        var src = $("#BillImagesrc").attr("src");
        prepareAndLog(src); // No file
    }

    function prepareAndLog(base64String) {
        var obj = {
            param1: PurchaseDate,
            param2: InvoiceNumber,
            param3: CompanyID,
            param4: PaymentModeID,
            param5: base64String || "",
            param6: totalAmount,
            param7: Remarks,
            param8: stocklocID,
            param10: purchaseId,
            List: rowsData
        };

        var CategoryModel = JSON.stringify(obj);

        UTILITY.CheckSession((data_) => {
            if (data_) {
                new APICALL(GetGlobalURL('Base', 'UpdatePurchaseWithDetails'), 'POST', CategoryModel, true).FETCH((result, error) => {
                    if (result.data == false) {
                        Swal.fire({
                            icon: "info",
                            title: "Retry Again...",
                            text: "Purchase was not saved. Please create it again!",
                        });
                    }
                    else if (result && result.data != null) {
                        
                        Swal.fire({
                            icon: "success",
                            title: "Success...",
                            text: "Purchase Updated successfully!",
                        });
                        Clear();
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