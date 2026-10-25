

$(document).ready(function () {
    GetCompanyData();
    OpeningCompanyBills();
    updateDateTime(); // initial call
    setInterval(updateDateTime, 1000); // update every second
});
function GetCompanyData() {

    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetCompanyData'), 'GET', '', true).FETCH((result, error) => {
                if (result && result.data.length >0) {
                    // Populate only the target dropdown
                    $("#Companydata").empty().append('<option value="">-- Select Company --</option>');
                    $.each(result.data, function (i, option) {
                        $("#Companydata").append(
                            '<option value="' + option.CompanyID + '">' + option.CompanyName + '</option>'
                        );
                    });

                    if ($.fn.select2 && $("#Companydata").hasClass("select2-hidden-accessible")) {
                        $("#Companydata").select2('destroy');
                    }

                    $("#Companydata").select2({
                        placeholder: "-- Select Company --",
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

function OpeningCompanyBills() {
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetOpeningBalanceCompanyBills'), 'GET', '', true)
                .FETCH((result, error) => {
                    if (result && result.data) {
                        var tbody = $("#Table tbody");
                        tbody.empty();

                        var totalDebit = 0, totalCredit = 0;

                        $.each(result.data, function (i, row) {

                            var debitAmount = row.DebitAmount || 0;
                            var creditAmount = row.CreditAmount || 0;

                            // Format date (dd/MM/yyyy)
                            var date = row.OpeningDate ? new Date(row.OpeningDate) : null;
                            var formattedDate = date ? date.toLocaleDateString("en-GB") : "";

                            // Format numbers
                            var debit = debitAmount.toLocaleString("en-US", { minimumFractionDigits: 2 });
                            var credit = creditAmount.toLocaleString("en-US", { minimumFractionDigits: 2 });

                            // Totals
                            totalDebit += debitAmount;
                            totalCredit += creditAmount;

                            // Append correct HTML
                            tbody.append(`
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${row.CompanyName || ''}</td>
                                    <td>${formattedDate}</td>
                                    <td class="text-end text-danger">${debit}</td>
                                    <td class="text-end text-success">${credit}</td>
                                    <td>${row.Narration || ''}</td>
                                    <td>${row.VoucherType || ''}</td>
                                </tr>
                            `);
                        });

                        // Totals
                        $("#totalDebit").text(totalDebit.toLocaleString("en-US", { minimumFractionDigits: 2 }));
                        $("#totalCredit").text(totalCredit.toLocaleString("en-US", { minimumFractionDigits: 2 }));

                    } else {
                        $("#Table tbody").html(`
                            <tr>
                                <td colspan="7" class="text-center text-muted">No records found</td>
                            </tr>
                        `);
                        $("#totalDebit").text("0.00");
                        $("#totalCredit").text("0.00");
                    }

                    // API Error
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

$(document).on('click', '#SaveBtn', function () {

    // Get form values
    var Dates = $('#Date').val();
    var Companyid = $('#Companydata').val();
    var Description = $('.Description').val();
    var Amount = $('.Amount').val();

    // Validation check
    if (!Dates || !Companyid || !Description || !Amount) {
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
        param2: Companyid,
        param3: Description,
        param4: Amount
    };

    var SaveModel = JSON.stringify(obj);

    // API Call
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'SaveCompanyOpeningBalance'), 'POST', SaveModel, true).FETCH((result, error) => {
                if (result && result.data != null) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Saved',
                        text: 'Opening balance added successfully.'
                    });

                    $('#purchaseForm')[0].reset();
                    OpeningCompanyBills();
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

