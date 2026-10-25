var DataScreen = true;
var isEditingRow = false;
var id ;

$(document).ready(function () {

    $('#tabs').tabs({
        activate: function (event, ui) {

            if (ui.newPanel.attr("id") == "DataScreen") {
                if (DataScreen) {

                    GetSale();
                }
            }
        }
    });
    //$('#Saleform form').append(_html);
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
    GetStatusData();
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
                        $('#CustomerID').append(
                            '<option value="' + option.ID + '">' + option.CustomerName + '</option>'
                        );
                    });

                    if ($.fn.select2 && $('#CustomerID').hasClass("select2-hidden-accessible")) {
                        $('#CustomerID').select2('destroy');
                    }

                }

                $('#CustomerID').select2({
                    placeholder: "-- Select Customer --",
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

function GetStatusData() {
    
    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetStatusData'), 'GET', '', true).FETCH((result, error) => {

                if (result.data != null) {
                    

                    $('#StatusID').empty().append('<option value="">-- Select Status --</option>');
                    $.each(result.data, function (i, option) {
                        id = result.data[0].StatusID;
                        $('#StatusID').append(
                            '<option value="' + option.StatusID + '">' + option.StatusName + '</option>'
                        );
                    });

                    if ($.fn.select2 && $('#StatusID').hasClass("select2-hidden-accessible")) {
                        $('#StatusID').select2('destroy');
                    }

                }

                $('#StatusID').select2({
                    placeholder: "-- Select Status --",
                    allowClear: true,
                    width: '100%',
                    minimumResultsForSearch: 0
                });
                $('#StatusID').val(id).change();
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

function GetStatusDataForEdit() {

    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetStatusDataForEdit'), 'GET', '', true).FETCH((result, error) => {

                if (result.data != null) {


                    $('#StatusID').empty().append('<option value="">-- Select Status --</option>');
                    $.each(result.data, function (i, option) {
                        
                        $('#StatusID').append(
                            '<option value="' + option.StatusID + '">' + option.StatusName + '</option>'
                        );
                    });

                    if ($.fn.select2 && $('#StatusID').hasClass("select2-hidden-accessible")) {
                        $('#StatusID').select2('destroy');
                    }

                }

                $('#StatusID').select2({
                    placeholder: "-- Select Status --",
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
function GetCategoryData() {
    ShowLoader2("Sale-row");
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

                HideLoader('CategoryMasterDiv');
            });
        }
    });

}
$(document).on('change', '#category', function () {
    if (isEditingRow) return;
    ShowLoader2("Sale-row");
    var categoryID = $(this).val();
    GetProductByCategoryID(categoryID);

    
});
function GetProductByCategoryID(categoryID) {
    var targetDropdown = $("#product");
    if (!categoryID) {

        targetDropdown.empty().append('<option value="">-- Select Product --</option>');
        HideLoader2("Sale-row");
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
                    HideLoader2("Sale-row");
                }

                if (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: error.data.responseText,
                        footer: ''
                    });
                }
                HideLoader2("Sale-row");
            });
        }
    });
}
function GetactiveProductData() {
    ShowLoader2("Sale-row");
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
                        width: '100%',
                        minimumResultsForSearch: 0
                    });
                    HideLoader2("Sale-row");
                }

                if (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: error.data.responseText,
                        footer: ''
                    });
                }
                HideLoader2("Sale-row");
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
    ShowLoader2("Sale-row");
    if (!productID) {
        $("#productsku").empty().append('<option value="">-- Select Sku --</option>');
        HideLoader2("Sale-row");
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
                    HideLoader2("Sale-row");
                }

                if (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: error.data.responseText,
                        footer: ''
                    });
                }
                HideLoader2("Sale-row");
            });
        }
    });
}
function GetactiveProductskuData() {
    ShowLoader2("Sale-row");
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
                        width: '100%',
                        minimumResultsForSearch: 0
                    });
                    HideLoader2("Sale-row");
                }

                if (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: error.data.responseText,
                        footer: ''
                    });
                }
                HideLoader2("Sale-row");
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
    ShowLoader2("Sale-row");
    if (!skuID) {
        HideLoader2("Sale-row");
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
                    $(".expirydate").val(result.data[0].ExpiryDate.split("T")[0]);
                    
                    HideLoader2("Sale-row");
                }

                if (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: error.data.responseText,
                        footer: ''
                    });
                }
                HideLoader2("Sale-row");
            });
        }
    });
}

function ClearSubform() {

    $('#productsku').val('').trigger('change');


    $(".expirydate").val('');
    $(".barcode").val('');
    $(".qty").val(1);
    $(".dqty").val(1);
    $(".price").val(0);
    $(".total").val(0);
    
    
}
$(document).on("click", ".delete-row", function () {
    $(this).closest("tr").remove();
    recalculateTotal();
});
$(document).on("click", ".edit-row", function () {
    isEditingRow = true; 
    var row = $(this).closest("tr");

    // Set back values into inputs

    $("#productsku").val(row.find("td:eq(0)").data("id")).trigger("change");
    $(".expirydate").val(row.find("td:eq(1)").text());
    $(".qty").val(row.find("td:eq(2)").text());
    $(".price").val(row.find("td:eq(3)").text());
    $(".isBonus").prop("checked", row.find("td:eq(4)").text() === "Yes");

    // Remove old row to replace on next add
    row.remove();
    recalculateTotal();
    var qty = parseFloat($('.qty').val()) || 0;
    var price = parseFloat($('.price').val()) || 0;
    $('#total').val((qty * price).toFixed(2));
    setTimeout(() => isEditingRow = false, 100);
});
$(document).on('input', '.qty, .price', function () {
    if ($("#fullDelivered").is(":checked")) {
        $('.dqty').val($('.qty').val());
    }
    var qty = parseFloat($('.qty').val()) || 0;
    var price = parseFloat($('.price').val()) || 0;
    var total = qty * price;
    $('#total').val(total.toFixed(2));
    
});

$(document).on('change', '#fullDelivered', function () {
    if ($(this).is(":checked")) {
        $(".dqty").val($(".qty").val())
        $(".dqty").attr("readonly", true); // disable the checkbox
    } else {
        $(".dqty").attr("readonly", false); // enable the checkbox
    }
});

$(document).on('input', '#totalAmount', function () {
    var totalAmount = parseFloat($("#totalAmount").val()) || 0;
    var PaymentAmount = parseFloat($("#PaymentAmount").val()) || 0;
    var remainingAmount = totalAmount - PaymentAmount;
    $("#remainingAmount").val(remainingAmount);
});

function recalculateTotal() {
    var sum = 0;
    $("#SaleTable tbody tr").each(function () {
        var val = parseFloat($(this).find(".Total").text()) || 0;
        sum += val;
    });
    $("#totalAmount").val(sum.toFixed(2)).trigger("input");
}
$(document).on('input', '#PaymentAmount', function () {
    var sum = parseFloat($("#totalAmount").val()) || 0;
    var DiscountAmount = parseFloat($("#DiscountAmount").val()) || 0;
    var PaymentAmount = parseFloat($(this).val()) || 0;

    var remaining = (sum - DiscountAmount) - PaymentAmount;

    $("#remainingAmount").val(remaining);
});
$(document).on('input', '#DiscountAmount', function () {
    var sum = parseFloat($("#totalAmount").val()) || 0;
    var DiscountAmount = parseFloat($("#DiscountAmount").val()) || 0;
    var PaymentAmount = parseFloat($("#PaymentAmount").val()) || 0;

    var remaining = (sum - DiscountAmount) - PaymentAmount;

    $("#remainingAmount").val(remaining);
});

function HideLoader2() {
    $('.loader-wrapper').addClass('d-none');
    $('.Sale-row').find('input, select, button').prop('disabled', false);
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
    
    $('#SaleTable tbody').html('');
    
    $('#productsku').val('').trigger('change');

    $('#price').val('');
    $('#total').val('');
    $('.qty').val(1);
    $('.qty').val(1);
    $('#SaleDate').val('');
    $('#InvoiceNumber').val('');
    $('#CompanyID').val('');
    $('#stocklocID').val('');
    $('#PaymentModeID').val('');
    $('#Remarks').val('');
    $('#totalAmount').text('');
    $('#BillImage')[0].files[0] = Null;
}
function GetSale() {


    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetSale'), 'GET', '', true).FETCH((result, error) => {

                if (result) {

                    $('#Sale-master tbody').html('');
                    if (result.data != null) {

                        $.each(result.data, function (i, option) {
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-orange btn-block EditSale" data-value="' + option.SaleID + '" type="button"><i class="bx bxs-edit"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-gray btn-block DeleteSale"  data-value="' + option.SaleID + '" type="button"><i class="bx bxs-trash"></i></button></td>' : '';

                            $('#Sale-master tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.InvoiceNumber + '</td>' +
                                '<td>' + option.SaleDate + '</td>' +
                                '<td>' + option.CompanyName + '</td>' +
                                '<td>' + option.TotalAmount + '</td>' +
                                '<td>' + option.PaymentModeName + '</td>' +
                                '<td>' + option.Remarks + '</td>' +
                                '<td><img class="phyimg" src="' + option.Base64Image + '" /></td>' +
                                '<td>' + option.CreatedDate + '</td>' +
                                '<td><button class="btn btn-sm btn-orange btn-block detailsSale" data-value="' + option.SaleID + '" type="button"><i class="bx bx-detail"></i></button></td>' +

                                UpdateBtn +
                                DeleteBtn +
                                '</tr>'
                            );
                        });
                        $('.EditSale').on('click', function () {
                            EditSale(this.attributes["data-value"].value);
                        });

                        $('.DeleteSale').on('click', function () {
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

    // Collect table rows
    $('#SaleTable tbody tr').each(function () {
        var $row = $(this);
        rowsData.push({
            skuId: $row.find('td:eq(0)').data('id'),
            barcode: $row.find('td:eq(1)').text().trim(),
            expiryDate: $row.find('td:eq(2)').text().trim(),
            totalQty: parseFloat($row.find('td:eq(3)').text()) || 0,
            deliveredQty: parseFloat($row.find('td:eq(4)').text()) || 0,
            remainingQty: parseFloat($row.find('td:eq(5)').text()) || 0,
            unitPrice: parseFloat($row.find('td:eq(6)').text()) || 0,
            total: parseFloat($row.find('td:eq(7)').text()) || 0,
            isBonus: $row.find('td:eq(8)').text().trim().toLowerCase() === "yes"
        });
    });

    if (rowsData.length === 0) {
        alert("Please add at least one product.");
        return;
    }

    var SaleDate = $('#SaleDate').val();
    var CustomerID = $('#CustomerID').val();
    if (!CustomerID) {
        alert("Please select Customer");
        return;
    }

    var stocklocID = $('#stocklocID').val();
    var InvoiceNumber = $('#InvoiceNumber').val();
    var totalAmount = $('#totalAmount').val() || "0";
    var PaymentAmount = $('#PaymentAmount').val() || "0";
    var remainingAmount = $('#remainingAmount').val() || "0";
    var discountAmount = $('#DiscountAmount').val() || "0";
    var remarks = $('#Remarks').val() || "";
    var file = $('#BillImage')[0]?.files[0];

    // Function to send API request
    function sendSale(base64File) {
        var payload = {
            param1: SaleDate,
            param2: CustomerID,
            param3: base64File || "",
            param4: totalAmount,
            param5: PaymentAmount,
            param6: remainingAmount,
            param7: discountAmount,
            param8: remarks,
            param9: InvoiceNumber || "",
            param10: stocklocID || "",
            List: rowsData
        };

        UTILITY.CheckSession(function (sessionValid) {
            if (!sessionValid) return;

            new APICALL(GetGlobalURL('Base', 'SaveSaleWithDetails'), 'POST', JSON.stringify(payload), true)
                .FETCH(function (result, error) {
                    if (error) {
                        Swal.fire("Error", error.data?.responseText || "Something went wrong!", "error");
                    } else if (result.data === false) {
                        Swal.fire("Info", "Sale was not saved. Please try again!", "info");
                    } else {
                        Swal.fire("Success", "Sale saved successfully!", "success");
                        $('#ClearForm').click(); // Reset form
                    }
                });
        });
    }

    // If file exists, convert to Base64
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            sendSale(e.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        sendSale("");
    }
});

function EditSale(id) {
    var SaleId = id;

    UTILITY.CheckSession((data_) => {
        if (data_) {
            var dt = { Param1: SaleId }
            var productModel = JSON.stringify(dt);

            new APICALL(GetGlobalURL('Base', 'GetSaleWithDataisById'), 'POST', productModel, true)
                .FETCH((result, error) => {

                    if (result) {
                        // Sale header data
                        if (result.data.Table.length > 0) {
                            var SaleDate = new Date(result.data.Table[0].SaleDate);
                            $("#SaleDate").val(UTILITY.toLocaleDateString(SaleDate));
                            $("#SaleId").val(result.data.Table[0].SaleID);
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

                        // Sale detail rows
                        if (result.data.Table1.length > 0) {
                            $('#SaleTable tbody').html('');

                            result.data.Table1.forEach(function (item) {
                                var type = "Sale"; // agar API se type nahi aa raha to fixed
                                var category = item.CategoryID;
                                var categoryText = item.CategoryName;

                                var product = item.ProductID;
                                var productText = item.ProductName;

                                var sku = item.ProductSkuID;
                                var skuText = item.ProductName1;

              
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

                                $("#SaleTable tbody").append(row);
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

                        $("#companyBalance").val(result.data[0].Balance);
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

$(document).on("click", ".detailsSale", function () {
    var SaleId = $(this).data("value");

    UTILITY.CheckSession((data_) => {

        if (data_) {
            var dt = {
                Param1: SaleId
            }
            var productModel = JSON.stringify(dt); // Send array directly
            new APICALL(GetGlobalURL('Base', 'GetSaleDatais'), 'POST', productModel, true).FETCH((result, error) => {

                if (result) {

                    $('#Saledatails-master tbody').html('');
                    if (result.data != null) {

                        $.each(result.data, function (i, option) {
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-orange btn-block EditSale" data-value="' + option.ID + '" type="button"><i class="bx bxs-edit"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-gray btn-block DeleteSale"  data-value="' + option.ID + '" type="button"><i class="bx bxs-trash"></i></button></td>' : '';

                            $('#Saledatails-master tbody').append(
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



                        $('.EditSale').on('click', function () {
                            //Editcategory(this.attributes["data-value"].value);
                        });

                        $('.DeleteSale').on('click', function () {
                            //Deletecategory(this.attributes["data-value"].value);
                        });

                        // Modal show karo
                        $("#ModalActiveSaledetails").modal("show");

                    }

                }
            });


        }
    });

});
$("#CloseModalBtn").click(function () {
    $("#ModalActiveSaledetails").modal("hide");
});

$(document).on('click', '#UpdateBtn', function () {
    var rowsData = [];

    $('#SaleTable tbody tr').each(function () {
        var $row = $(this);

        var transactionType = $row.find('td:eq(0)').text().trim(); // "Sale"
        var categoryId = $row.find('td:eq(1)').data('id');         // from data-id
        var productId = $row.find('td:eq(2)').data('id');
        var skuId = $row.find('td:eq(3)').data('id');

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
       
            param6: expiryDate,
            param7: qty,
            param8: price,
            param9: total,
            param10: isBonus
        });
    });

    var SaleDate = $('#SaleDate').val();
    var InvoiceNumber = $('#InvoiceNumber').val();
    var CompanyID = $('#CompanyID').val();
    var stocklocID = $('#stocklocID').val();
    var PaymentModeID = $('#PaymentModeID').val();
    var Remarks = $('#Remarks').val();
    var SaleId = $("#SaleId").val()
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
            param1: SaleDate,
            param2: InvoiceNumber,
            param3: CompanyID,
            param4: PaymentModeID,
            param5: base64String || "",
            param6: totalAmount,
            param7: Remarks,
            param8: stocklocID,
            param10: SaleId,
            List: rowsData
        };

        var CategoryModel = JSON.stringify(obj);

        UTILITY.CheckSession((data_) => {
            if (data_) {
                new APICALL(GetGlobalURL('Base', 'UpdateSaleWithDetails'), 'POST', CategoryModel, true).FETCH((result, error) => {
                    if (result.data == false) {
                        Swal.fire({
                            icon: "info",
                            title: "Retry Again...",
                            text: "Sale was not saved. Please create it again!",
                        });
                    }
                    else if (result && result.data != null) {
                        
                        Swal.fire({
                            icon: "success",
                            title: "Success...",
                            text: "Sale Updated successfully!",
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
// ENTER press → blur trigger
$(document).on('keypress', '#barcode', function (e) {
    if (e.which === 13) {

        var barcode = $(this).val().trim();
        if (barcode === "") return;

        var obj = JSON.stringify({ param1: barcode });

        UTILITY.CheckSession((data_) => {
            if (data_) {

                new APICALL(GetGlobalURL('Base', 'GetProductSkubybarcode'), 'POST', obj, true)
                    .FETCH((result, error) => {

                        if (result && result.data) {

                            $(".expirydate").val(result.data[0].ExpiryDate.split("T")[0]);
                            $("#productsku").val(result.data[0].SkuID).trigger("change");

                        }
                        ShowLoader2("Sale-row");
                        if (!result.data[0].SkuID) {
                            HideLoader2("Sale-row");
                            return;
                        }
                        var dt = {
                            Param1: result.data[0].SkuID
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

                                        HideLoader2("Sale-row");
                                        $("#AddEntry").trigger("click");
                                    }

                                    if (error) {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Error...',
                                            text: error.data.responseText,
                                            footer: ''
                                        });
                                    }
                                    HideLoader2("Sale-row");
                                });
                            }
                        });

                        if (error) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error...',
                                text: error.data.responseText
                            });
                        }
                    });
            }
        });
    }
});


$(document).on("click", "#AddEntry", function () {
    if ($("#SaleReturn").is(":checked")) {
        var sku = $("#productsku").val();
        var skuText = $("#productsku option:selected").text();


        var expiry = $(".expirydate").val();
        var barcode = $("#barcode").val();
        var qty = $(".qty").val();

        var price = $(".price").val();
        var total = (parseFloat(qty) * parseFloat(price)).toFixed(2);
        var isBonus = $(".isBonus").is(":checked") ? "Yes" : "No";

        if (!sku || !sku || !expiry) {
            alert("Please select valid Product SKU , expiry and Quantity.");
            return;
        }


      

        var row = '<tr>' +

            '<td data-id="' + sku + '">' + skuText + '</td>' +
            '<td>' + barcode + '</td>' +
            '<td>' + expiry + '</td>' +
            '<td>' + "-" + qty + '</td>' +
            '<td>' + 0 + '</td>' +
            '<td>' + 0 + '</td>' +
            '<td>' + "-"+price + '</td>' +
            '<td class="Total">' + "-" + total + '</td>' +
            '<td class="isBonus">' + isBonus + '</td>' +
            '<td>' +
            '<button class="btn btn-sm btn-orange btn-block edit-row" type="button"><i class="bx bxs-edit"></i></button>' +
            '</td>' +
            '<td>' +
            '<button class="btn btn-sm btn-gray btn-block delete-row" type="button"><i class="bx bxs-trash"></i></button>' +
            '</td>' +
            '</tr>';


        $("#SaleTable tbody").append(row);
        recalculateTotal();
        ClearSubform();
    }
    else {
        var sku = $("#productsku").val();
        var skuText = $("#productsku option:selected").text();


        var expiry = $(".expirydate").val();
        var barcode = $("#barcode").val();
        var qty = $(".qty").val();
        var dqty = $(".dqty").val();
        var remaining = parseFloat(qty) - parseFloat(dqty);
        var price = $(".price").val();
        var total = (parseFloat(qty) * parseFloat(price)).toFixed(2);
        var isBonus = $(".isBonus").is(":checked") ? "Yes" : "No";

        if (!sku || !sku || qty <= 0 || !expiry) {
            alert("Please select valid Product SKU , expiry and Quantity.");
            return;
        }


        if (parseFloat(dqty) > parseFloat(qty)) {
            alert("Delivered quantity cannot be greater than ordered quantity.");
            return;
        }

        var row = '<tr>' +

            '<td data-id="' + sku + '">' + skuText + '</td>' +
            '<td>' + barcode + '</td>' +
            '<td>' + expiry + '</td>' +
            '<td>' + qty + '</td>' +
            '<td>' + dqty + '</td>' +
            '<td>' + remaining + '</td>' +
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


        $("#SaleTable tbody").append(row);
        recalculateTotal();
        ClearSubform();
    }
  
});
$(document).on("change", "#StatusID", function () {
    var id = $("#StatusID").val();
    if (id == '2') {
        $("#Delivered").removeClass("d-none");  // Show by removing d-none
    } else {
        $("#Delivered").addClass("d-none");     // Hide by adding d-none
    }
});


$(document).on("change", "#StatusID", function () {
    var id = $("#StatusID").val();
    if (id == '2') {
        $("#Delivered").removeClass("d-none");  // Show by removing d-none
    } else {
        $("#Delivered").addClass("d-none");     // Hide by adding d-none
    }
});
