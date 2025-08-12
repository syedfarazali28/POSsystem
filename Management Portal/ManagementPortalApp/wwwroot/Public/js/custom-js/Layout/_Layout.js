
$(document).on("click", "#SaveBtn", function (e) {
    var isValid = true;
    $(".form-select").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]"; console.log(currentFieldId);

        if (val === "") {
            Swal.fire("Selection Required.");
            $(currentFieldId).focus();
            isValid = false;
            return false;
        }
    });
    // Email Validation
    $("[validate-email]").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        if (val === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            Swal.fire("Invalid email address.");
            $(this).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    // Phone Validation
    $("[validate-phone]").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        if (val === "" || !/^[0-9]{10,15}$/.test(val)) {
            Swal.fire("Invalid phone number.");
            $(this).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    // CNIC Validation
    $("[validate-cnic]").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        if (val === "" || !/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/.test(val)) {
            Swal.fire("Invalid CNIC. Format: 12345-1234567-1");
            $(this).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    // Required Field
    $("[validate-required]").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        if (val === "") {
              Swal.fire("This field is required.");
            $(this).focus();
        

        
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    // Number Field
    $("[validate-number]").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        if (val === "" || !/^\d+$/.test(val)) {
            Swal.fire("Only numbers are allowed.");
            $(this).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    // File Field
    $("[validate-file]").each(function () {
        var fileInput = $(this)[0];
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);

        // Check if a file is selected
        if (!fileInput.files || fileInput.files.length === 0) {
            Swal.fire("Please select a file.");
            $(this).focus();
            isValid = false;
            return false;
        }

        // Optional: Check file type (e.g., only allow images)
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
        var fileName = fileInput.files[0].name;
        if (!allowedExtensions.exec(fileName)) {
            Swal.fire("Only JPG, JPEG, PNG, or PDF files are allowed.");
            $(this).val(""); // Clear the input
            $(this).focus();
            isValid = false;
            return false;
        }

        // Optional: Check file size (e.g., max 2MB)
        var maxSize = 2 * 1024 * 1024; // 2MB
        if (fileInput.files[0].size > maxSize) {
            Swal.fire("File size must be less than 2MB.");
            $(this).val(""); // Clear the input
            $(this).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    
});
$(document).on("click", "#UpdateBtn", function (e) {
    var isValid = true;

    // Email Validation
    $("[validate-email]").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        if (val === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            Swal.fire("Invalid email address.");
            $(this).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    // Phone Validation
    $("[validate-phone]").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        if (val === "" || !/^[0-9]{10,15}$/.test(val)) {
            Swal.fire("Invalid phone number.");
            $(this).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    // CNIC Validation
    $("[validate-cnic]").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        if (val === "" || !/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/.test(val)) {
            Swal.fire("Invalid CNIC. Format: 12345-1234567-1");
            $(this).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    // Required Field
    $("[validate-required]").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        if (val === "") {
            Swal.fire("This field is required.");
            $(this).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    // Number Field
    $("[validate-number]").each(function () {
        var val = $(this).val().trim();
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);
        if (val === "" || !/^\d+$/.test(val)) {
            Swal.fire("Only numbers are allowed.");
            $(this).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    // File Field
    $("[validate-file]").each(function () {
        var fileInput = $(this)[0];
        var currentFieldId = $(this).attr("id") || "[No ID]";  console.log(currentFieldId);

        // Check if a file is selected
        if (!fileInput.files || fileInput.files.length === 0) {
            Swal.fire("Please select a file.");
            $(this).focus();
            isValid = false;
            return false;
        }

        // Optional: Check file type (e.g., only allow images)
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
        var fileName = fileInput.files[0].name;
        if (!allowedExtensions.exec(fileName)) {
            Swal.fire("Only JPG, JPEG, PNG, or PDF files are allowed.");
            $(this).val(""); // Clear the input
            $(this).focus();
            isValid = false;
            return false;
        }

        // Optional: Check file size (e.g., max 2MB)
        var maxSize = 2 * 1024 * 1024; // 2MB
        if (fileInput.files[0].size > maxSize) {
            Swal.fire("File size must be less than 2MB.");
            $(this).val(""); // Clear the input
            $(this).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }


});






document.addEventListener("DOMContentLoaded", function (event) {

    var showNavbar = (toggleId, navId, bodyId, headerId) => {
        var toggle = document.getElementById(toggleId),
            nav = document.getElementById(navId),
            bodypd = document.getElementById(bodyId),
            headerpd = document.getElementById(headerId)

        if (localStorage.getItem('nav') == 'show') {
            if (!nav.classList.contains('show')) {
                nav.classList.add('show');
            }
        }

        if (localStorage.getItem('toggle') == "") {
            toggle.classList.add('bx-toggle-left');
        }
        else if (localStorage.getItem('toggle') == 'bx-toggle-right') {
            toggle.classList.add('bx-toggle-left');
            toggle.classList.remove('bx-toggle-right');
        }
        else if(localStorage.getItem('toggle') == 'bx-toggle-left') {
            toggle.classList.remove('bx-toggle-left');
            toggle.classList.add('bx-toggle-right');

        }

        if (localStorage.getItem('bodypd') == 'body-pd') {
            if (!bodypd.classList.contains('body-pd')) {
                bodypd.classList.add('body-pd');
            }
        }
        // Validate that all variables exist
        if (toggle && nav && bodypd && headerpd) {
            toggle.addEventListener('click', () => {
                // show navbar
                nav.classList.toggle('show');

                // change icon
                toggle.classList.toggle('bx-toggle-right');
                toggle.classList.toggle('bx-toggle-left');

                // add padding to body
                bodypd.classList.toggle('body-pd')
                // add padding to header

                if (nav.classList.contains('show')) {
                    window.localStorage.setItem('nav', 'show');
                }
                else {
                    window.localStorage.setItem('nav', '');
                }

                if (toggle.classList.contains('bx-toggle-right')) {
                    window.localStorage.setItem('toggle', 'bx-toggle-right');
                }
                else {
                    window.localStorage.setItem('toggle', 'bx-toggle-left');
                }

                if (bodypd.classList.contains('body-pd')) {
                    window.localStorage.setItem('bodypd', 'body-pd');
                }
                else {
                    window.localStorage.setItem('bodypd', '');
                }
            });
        }
    }

    showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')

});

function GetGlobalSignalRURL() {

    var LocalUrl = 'localhost:7201'; //view

    FinalUrl = GetProtocolURL() + LocalUrl + "/signalr";

    return FinalUrl;
}

function GetGlobalServiceURL(pServiceName, pMethodName) {

    var LocalUrl = 'localhost:7163'; // apiurl

    FinalUrl = GetProtocolURL() + LocalUrl + "/api/" + pServiceName + "/" + pMethodName;

    return FinalUrl;
}

function GetGlobalURL(pControllerName, pMethodName) {

    var LocalUrl = 'localhost:7201';

    FinalUrl = GetProtocolURL() + LocalUrl + "/" + pControllerName + "/" + pMethodName;

    return FinalUrl;
}

function GetProtocolURL() {

    var FinalProtocol = "";

    if (document.location.protocol === 'https:') {
        FinalProtocol = 'https://';
    }
    else {
        FinalProtocol = 'http://';
    }

    return FinalProtocol;
}
function ShowLoader(divid) {
    $('#' + divid + ' .loader-wrapper').removeClass('d-none');
}

function HideLoader(divid) {
    $('#' + divid + ' .loader-wrapper').addClass('d-none');
}
function removeToast(id) {
    $('.c_toast_' + id).remove();
}
$(document).on("click", "#BackupBtn", function () {
    ShowLoader('body-pd');

    UTILITY.CheckSession((data_) => {


        new APICALL(GetGlobalURL('Base', 'CreateBackup'), 'GET', '', true).FETCH((result, error) => {

            if (result) {
                HideLoader('body-pd');
                Swal.fire({
                    icon: 'success',
                    title: 'Success...',
                    text: 'DB Backup Create Successfully!',
                    footer: ''
                });

            }

            if (error) {
                HideLoader('body-pd');
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: error.data.responseText,
                    footer: ''
                });
            }
        });
    });
    

});


function fileToBase64(file, callback) {
    let reader = new FileReader();
    reader.onload = e => callback(e.target.result.split(",")[1]);
    reader.onerror = () => callback("");
    reader.readAsDataURL(file);
}
