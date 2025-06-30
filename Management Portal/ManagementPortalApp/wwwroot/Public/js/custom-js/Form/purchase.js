var _html = ` <form id="purchaseForm" method="post" autocomplete="off">
                    <div class="row mb-3">
                        <div class="col-md-3">
                            <label>Purchase Date</label>
                            <input type="date" id="PurchaseDate" class="form-control" required>
                        </div>
                        <div class="col-md-3">
                            <label>Invoice Number</label>
                            <input type="text" disabled  id="InvoiceNumber" class="form-control" placeholder="INV-001" required>
                        </div>
                        <div class="col-md-3">
                            <label>Supplier</label>
                            <select id="SupplierID" class="form-control" required>
                                <option value="">-- Select Supplier --</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label>Payment Mode</label>
                            <select id="PaymentModeID" class="form-control">
                                <option value="">-- Select Payment Mode --</option>
                            </select>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-bordered" id="purchaseTable">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th>Barcode</th>
                                    <th>Expiry Date</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th>Total</th>
                                    <th><button type="button" class="btn btn-sm btn-success" id="addRow"><i class="bx bx-plus"></i></button></th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- JS will insert rows here -->
                            </tbody>
                        </table>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-12 text-end">
                            <h5>Total Amount: <span id="totalAmount">0</span></h5>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-12">
                            <label>Remarks</label>
                            <textarea id="Remarks" class="form-control" rows="2" placeholder="Optional remarks"></textarea>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 d-flex justify-content-end">
                            <button type="button" class="btn btn-primary btn-orange me-2" id="SavePurchase"><i class="bx bxs-save pe-2"></i>Save</button>
                            <button type="reset" class="btn btn-secondary" id="ClearForm"><i class="bx bx-refresh pe-2"></i>Clear</button>
                        </div>
                    </div>
                </form>`;
$(document).ready(function () {
    $('#Purchaseform').append(_html);
    GetInvoiceno();
    updateDateTime(); // initial call
    setInterval(updateDateTime, 1000); // update every second
});

function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    const formattedDate = now.toLocaleString('en-US', options);
    $('#currentDateTime').text(formattedDate); // ✅ jQuery version
}

function GetInvoiceno() {
    

    UTILITY.CheckSession((data_) => {

        if (data_) {

            new APICALL(GetGlobalURL('Base', 'GetInvoiceno'), 'GET', '', true).FETCH((result, error) => {

                if (result) {

                  
                    if (result.data != null) {
                        
                        $("#InvoiceNumber").val();
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
$(document).on('click', '#addRow', function () {
    let rowHtml = `
        <tr>
            <td><select id="category" class="form-control category"></select></td>
            <td><select id="product" class="form-control product"></select></td>
            <td><select id="sku"  class="form-control sku"></select></td>
            <td><input type="text" class="form-control barcode" placeholder="Scan or enter" /></td>
            <td><input type="date" class="form-control expirydate" /></td>
            <td><input type="number" class="form-control qty" min="1" value="1" /></td>
            <td><input type="number" class="form-control price" min="1" value="0" /></td>
            <td class="total">0</td>
            <td><button type="button" class="btn btn-sm btn-danger removeRow"><i class="bx bx-minus"></i></button></td>
        </tr>`;
    $('#purchaseTable tbody').append(rowHtml);
    recalculateTotal();
});

$(document).on('click', '.removeRow', function () {
    $(this).closest('tr').remove();
    recalculateTotal();
});

$(document).on('input', '.qty, .price', function () {
    let row = $(this).closest('tr');
    let qty = parseFloat(row.find('.qty').val()) || 0;
    let price = parseFloat(row.find('.price').val()) || 0;
    row.find('.total').text((qty * price).toFixed(2));
    recalculateTotal();
});

function recalculateTotal() {
    let total = 0;
    $('#purchaseTable tbody tr').each(function () {
        total += parseFloat($(this).find('.total').text()) || 0;
    });
    $('#totalAmount').text(total.toFixed(2));
}
