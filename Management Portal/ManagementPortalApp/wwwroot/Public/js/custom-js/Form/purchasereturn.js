
var DataScreen = true;

$(document).ready(function () {
    GetPurchase();
    GetCompanyActiveData();
    GetPaymentModeData();
    GetStockLocationTypeData();
    updateDateTime();
    setInterval(updateDateTime, 1000); // update every second
    var prefix = "PO-";

    // Ensure prefix is always there
    $(document).on("input", "#InvoiceNumber", function () {
        if (!$(this).val().startsWith(prefix)) {
            $(this).val(prefix);
        }
    });

    // Prevent deleting/moving before prefix
    $(document).on("keydown", "#InvoiceNumber", function (e) {
        if (this.selectionStart < prefix.length &&
            e.key !== "ArrowRight" &&
            e.key !== "Tab") {
            e.preventDefault();
            this.setSelectionRange(prefix.length, prefix.length);
        }
    });

    // Your change event
    $(document).on('change', '#InvoiceNumber', function () {
        
        ShowLoader2("purchase-row");

        var InvoiceNumber = $(this).val();
        var numberPart = InvoiceNumber.replace(/^PO-/, ""); // Sirf number part nikalo
        Editpurchase(numberPart);
    });
  
    $('#tabs').tabs({
        activate: function (event, ui) {
        }
    });
    //$('#Purchaseform form').append(_html);
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('PurchaseDate').value = today;
    
  
});
function GetCompanyActiveData() {


    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetCompanyActiveData'), 'GET', '', true).FETCH((result, error) => {

                if (result.data != null) {


                    $('#CompanyID').empty().append('<option value="">-- Select Company --</option>');
                    $.each(result.data, function (i, option) {
                        $('#CompanyID').append(
                            '<option value="' + option.ID + '">' + option.CompanyName + '</option>'
                        );
                    });

                    if ($.fn.select2 && $('#CompanyID').hasClass("select2-hidden-accessible")) {
                        $('#CompanyID').select2('destroy');
                    }

                }

                $('#CompanyID').select2({
                    placeholder: "-- Select Company --",
                    allowClear: true,
                    width: '100%',
                    minimumResultsForSearch: 0
                });
                $("#CompanyID").prop("disabled", true);
                
                $("#stocklocID").prop("disabled", true);
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
                    width: '100%',
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
                    width: '100%',
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
function clearshortform() {
    $("#category").val("").trigger("change");
    $("#product").val("").trigger("change");
    $("#productsku").val("").trigger("change");
    $(".barcode").val("");
    $(".expirydate").val("");
    $(".qty").val("1");
    $(".price").val("");
    $(".total").val("0.00");
    $(".isBonus").prop("checked", false);

}
$(document).on("click", ".delete-row", function () {
    $(this).closest("tr").remove();
    recalculateTotal();
});
function recalculateTotal() {
    var sum = 0;
    $("#purchaseTable tbody tr").each(function () {
        var isBonus = $(this).find(".isBonus").text().trim().toLowerCase();
        if (isBonus === "no") { // Only include non-bonus items
            var val = parseFloat($(this).find(".Total").text()) || 0;
            sum += val;
        }
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
    $('#BillImage').val('');
    
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
                            //var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-gray btn-block Deletepurchase"  data-value="' + option.PurchaseID + '" type="button"><i class="bx bxs-trash"></i></button></td>' : '';

                            $('#purchase-master tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.PO + '</td>' +
                                '<td>' + option.PurchaseDate + '</td>' +
                                '<td>' + option.CompanyName + '</td>' +
                                '<td>' + option.TotalAmount + '</td>' +
                                '<td>' + option.PaymentModeName + '</td>' +
                                '<td>' + option.Remarks + '</td>' +
                                '<td><img class="phyimg" src="' + option.Base64Image + '" /></td>' +
                                '<td>' + option.CreatedDate + '</td>' +
                                '<td><button class="btn btn-sm btn-orange btn-block detailspurchase" data-value="' + option.PurchaseID + '" type="button"><i class="bx bx-detail"></i></button></td>' +

                                UpdateBtn +
                                //DeleteBtn +
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
    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            var rowsData = [];

            if ($('#purchaseTable tbody tr').length > 0) {
                $('#purchaseTable tbody tr').each(function () {
                    var $row = $(this);

                    var categoryId = $row.find('td:eq(0)').data('id'); // CategoryId
                    var productId = $row.find('td:eq(1)').data('id');
                    var skuId = $row.find('td:eq(2)').data('id');
                    var barcode = $row.find('td:eq(3)').text().trim();
                    var expiryDate = $row.find('td:eq(4)').text().trim();
                    var qty = parseFloat($row.find('.qty').val()) || 0;  // Qty from input
                    var price = parseFloat($row.find('.price').text()) || 0;
                    var total = parseFloat($row.find('.Total').text()) || 0;
                    var isBonus = $row.find('td:eq(8)').text().trim().toLowerCase() === "yes";

                    rowsData.push({
                        param2: productId,
                        param3: skuId,
                        param4: qty,
                        param5: price,
                        param6: total,
                        param7: barcode,
                        param8: expiryDate,
                        param9: isBonus
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
                    var existingSrc = $("#BillImagesrc").attr("src") || ""; // agar src na ho toh empty string
                    prepareAndLog(existingSrc);
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
                            new APICALL(GetGlobalURL('Base', 'SavePurchaseReturnWithDetails'), 'POST', CategoryModel, true).FETCH((result, error) => {
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
                                    Clear();
                                }
                                if (error) {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error...',
                                        text: error.data.responseText,
                                    });
                                }
                            });
                        }
                    });
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: 'Please add a returning item.',
                });
            }
        }
    });
});
// Function: Editpurchase
function Editpurchase(id) {
    var purchaseId = id;

    UTILITY.CheckSession((data_) => {
        if (data_) {
            var dt = { Param1: purchaseId }
            var productModel = JSON.stringify(dt);

            new APICALL(GetGlobalURL('Base', 'GetPurchaseWithDataisById'), 'POST', productModel, true)
                .FETCH((result, error) => {
                    if (result) {
                        var index = $("a[href='#FormScreen']").closest("li").index();
                        $("#tabs").tabs("option", "active", index);

                        // Purchase header data
                        if (result.data.Table.length > 0) {
                            var PurchaseDate = new Date(result.data.Table[0].PurchaseDate);
                            $("#PurchaseDate").val(UTILITY.toLocaleDateString(PurchaseDate));
                            $("#PurchaseId").val(result.data.Table[0].PurchaseID);
                            $("#InvoiceNumber").val(result.data.Table[0].PO);
                            $("#Remarks").val(result.data.Table[0].Remarks);
                            $("#CompanyID").val(result.data.Table[0].CompanyID).trigger("change");
                            $("#PaymentModeID").val(result.data.Table[0].PaymentModeID).trigger("change");
                            $("#stocklocID").val(result.data.Table[0].LocationID).trigger("change");
                            $("#BillImagesrc").attr("src", result.data.Table[0].Base64Image);
                        }

                        // Purchase detail rows
                        if (result.data.Table1.length > 0) {
                            $('#purchaseTable tbody').html('');

                            result.data.Table1.forEach(function (item) {
                                var category = item.CategoryID;
                                var categoryText = item.CategoryName;

                                var product = item.ProductID;
                                var productText = item.ProductName;

                                var sku = item.ProductSkuID;
                                var skuText = item.SKUName;

                                var barcode = item.Barcode;
                                var expiry = UTILITY.toLocaleDateString(new Date(item.ExpiryDate));
                                var qty = item.Quantity;
                                var price = item.UnitPrice;
                                var total = parseFloat(item.Total).toFixed(2);
                                var isBonus = (item.IsBonus === "true" || item.IsBonus === true) ? "Yes" : "No";

                                // ✅ Row with editable qty
                                var row = '<tr>' +
                                    '<td data-id="' + category + '">' + categoryText + '</td>' +
                                    '<td data-id="' + product + '">' + productText + '</td>' +
                                    '<td data-id="' + sku + '">' + skuText + '</td>' +
                                    '<td>' + barcode + '</td>' +
                                    '<td>' + expiry + '</td>' +
                                    '<td><input type="number" class="form-control qty" value="' + qty + '" data-old-qty="' + qty + '"></td>' +
                                    '<td class="price">' + price + '</td>' +
                                    '<td class="Total">' + total + '</td>' +
                                    '<td class="isBonus">' + isBonus + '</td>' +
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
        HideLoader2("purchase-row");
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
                            //var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-gray btn-block Deletepurchase"  data-value="' + option.ID + '" type="button"><i class="bx bxs-trash"></i></button></td>' : '';

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
    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            var rowsData = [];

            $('#purchaseTable tbody tr').each(function () {
                var $row = $(this);

                rowsData.push({
                    param2: $row.find('td:eq(1)').data('id'),   // ProductID
                    param3: $row.find('td:eq(2)').data('id'),   // SKUId
                    param4: parseFloat($row.find('.qty').val()) || 0, // Qty (from input)
                    param5: parseFloat($row.find('.price').text()) || 0, // Price
                    param6: parseFloat($row.find('.Total').text()) || 0, // Total
                    param7: $row.find('td:eq(3)').text().trim(), // Barcode
                    param8: $row.find('td:eq(4)').text().trim(), // ExpiryDate
                    param9: $row.find('td:eq(8)').text().trim().toLowerCase() === "yes" // IsBonus
                });
            });

            var PurchaseDate = $('#PurchaseDate').val();
            var InvoiceNumber = $('#InvoiceNumber').val();
            var CompanyID = $('#CompanyID').val();
            var stocklocID = $('#stocklocID').val();
            var PaymentModeID = $('#PaymentModeID').val();
            var Remarks = $('#Remarks').val();
            var purchaseId = $("#PurchaseId").val();
            var totalAmount = $('#totalAmount').text();
            var file = $('#BillImage')[0].files[0];

            function prepareAndSend(base64String) {
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

                var payload = JSON.stringify(obj);

                UTILITY.CheckSession((data_) => {
                    if (data_) {
                        new APICALL(GetGlobalURL('Base', 'UpdatePurchaseWithDetails'), 'POST', payload, true)
                            .FETCH((result, error) => {
                                if (result && result.data) {
                                    Swal.fire({
                                        icon: "success",
                                        title: "Success...",
                                        text: "Purchase Updated successfully!",
                                    });
                                    Clear();
                                } else {
                                    Swal.fire({
                                        icon: "info",
                                        title: "Retry Again...",
                                        text: "Purchase was not updated. Please try again!",
                                    });
                                }

                                if (error) {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error...',
                                        text: error.data.responseText,
                                    });
                                }
                            });
                    }
                });
            }

            if (file) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    prepareAndSend(event.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                var existingSrc = $("#BillImagesrc").attr("src") || ""; // agar src na ho toh empty string
                prepareAndLog(existingSrc);
            }
        }
    });
});


// Qty change handler
$(document).on('change', '.qty', function () {
    var $row = $(this).closest('tr');
    var oldQty = parseFloat($(this).data("old-qty")) || 0; // purani qty (from attribute)
    var newQty = parseFloat($(this).val()) || 0;

    // Agar user increase kare
    if (newQty > oldQty) {
        $(this).val(oldQty); // reset to old value
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Not allowed to increase quantity.',
        });
        newQty = oldQty; // reset ke baad newQty bhi update karo
    }

    // Price aur total calculate karo
    var price = parseFloat($row.find("td:eq(6)").text()) || 0; // 7th column = price
    var total = newQty * price;

    $row.find(".Total").text(total.toFixed(2)); // total column update

    recalculateTotal(); // overall total update
});

$(document).on('input', '.qty, .price', function () {

var qty = parseFloat($('.qty').val()) || 0;
var price = parseFloat($('.price').val()) || 0;
var total = qty * price;
$('#total').val(total.toFixed(2));

});