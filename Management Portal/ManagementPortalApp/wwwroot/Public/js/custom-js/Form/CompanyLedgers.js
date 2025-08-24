var _html = `
    <div class="row mb-3">
        <div class="col-md-3">
            <label>Start Date</label>
            <small class="text-muted">*</small>
            <input type="date" id="SPurchaseDate" validate-required class="form-control" required>
        </div>
        <div class="col-md-3">
            <label>End Date</label>
            <small class="text-muted">*</small>
            <input type="date" id="EPurchaseDate" validate-required class="form-control" required>
        </div>
        <div class="col-md-3">
            <label>Supplier</label>
            <small class="text-muted">*</small>
            <select id="SupplierID" validate-required class="form-control searchingenable" required>
                <option value="">-- Select Supplier --</option>
            </select>
        </div>
        
        <div class="col-md-3 mt-3">
              <button type="button" class="btn btn-primary btn-orange me-2" id="SaveBtn"><i class="bx bxs-save pe-2"></i>Generate Report</button>
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
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('EPurchaseDate').value = today;
    document.getElementById('SPurchaseDate').value = today;
    
    GetSupplyActiveData();
    
    GetLegerEntry();
    
    updateDateTime(); // initial call
    setInterval(updateDateTime, 1000); // update every second
});
function GetLegerEntry() {
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetLegerEntry'), 'GET', '', true).FETCH((result, error) => {
                if (result.data != null && result.data.length > 0) {

                    var rows = '';
                    result.data.forEach((item, index) => {

                        // Balance color
                        let balanceClass = parseFloat(item.Balance) >= 0 ? "text-success fw-bold" : "text-danger fw-bold";

                        // Debit / Credit color
                        let debit = item.Debit > 0 ? `<span class="text-success fw-bold">${item.Debit.toFixed(2)}</span>` : "";
                        let credit = item.Credit > 0 ? `<span class="text-danger fw-bold">${item.Credit.toFixed(2)}</span>` : "";

                        rows += `
                            <tr>
                                <td class="text-center">${item.VoucherDate.split('T')[0]}</td>
                                <td class="text-center">${item.CompanyName}</td>
                                <td>
                                    <div><b>${item.Particulars}</b></div>
                                    <small class="text-muted">${item.Remarks ?? ''}</small>
                                </td>
                                <td class="text-end">${debit}</td>
                                <td class="text-end">${credit}</td>
                                <td class="text-end ${balanceClass}">${item.Balance.toFixed(2)}</td>
                            </tr>
                        `;
                    });

                    $('#LedgerEntry tbody').html(rows);
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




$(document).on('click', '#SaveBtn', function () {

    var SPurchaseDate = $('#SPurchaseDate').val();
    var EPurchaseDate = $('#EPurchaseDate').val();
    var SupplierID = $('#SupplierID').val();
        var obj = {
            param1: SPurchaseDate,
            param2: EPurchaseDate,
            param3: SupplierID
        };

        
        var CategoryModel = JSON.stringify(obj); // Send array directly

        UTILITY.CheckSession((data_) => {
            if (data_) {
                new APICALL(GetGlobalURL('Base', 'GetSupplierLedgers'), 'POST', CategoryModel, true).FETCH((result, error) => {
                    if (result && result.data != null) {
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
      
    

   


});



