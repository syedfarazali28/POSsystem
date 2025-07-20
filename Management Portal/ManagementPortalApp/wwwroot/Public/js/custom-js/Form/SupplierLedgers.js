var _html = `
    <div class="row mb-3">
        <div class="col-md-3">
            <label>Purchase Date</label>
            <small class="text-muted">*</small>
            <input type="date" id="SPurchaseDate" validate-required class="form-control" required>
        </div>
        <div class="col-md-3">
            <label>Purchase Date</label>
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
        <table class="table table-bordered" id="purchaseTable">
         
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
    
    
    
    updateDateTime(); // initial call
    setInterval(updateDateTime, 1000); // update every second
});
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



