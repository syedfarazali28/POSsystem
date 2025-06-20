$(document).on("click", "#SaveBtn", function (e) {
    let isValid = true;

    // Email Validation
    $("[validate-email]").each(function () {
        let val = $(this).val().trim();
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
        let val = $(this).val().trim();
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
        let val = $(this).val().trim();
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
        let val = $(this).val().trim();
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
        let val = $(this).val().trim();
        if (val === "" || !/^\d+$/.test(val)) {
            Swal.fire("Only numbers are allowed.");
            $(this).focus();
            isValid = false;
            return false;
        }
    });
    if (!isValid) { e.stopImmediatePropagation(); return false; }

    
});


$(document).on("click", "#UpdateBtn", function (e) {
    let isValid = true;

    $("[validate-email]").each(function () {
        let val = $(this).val().trim();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (val !== "" && !emailRegex.test(val)) {
            Swal.fire({
                title: 'Invalid email address.',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Ok'
            });

            $(this).focus();
            isValid = false;
            return false; // break loop
        }
        if (val == "") {
            Swal.fire({
                title: 'Invalid email address.',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Ok'
            });
            $(this).focus();
            isValid = false;
            return false; // break loop
        }
    });

    if (!isValid) { e.stopImmediatePropagation(); return false; }

    $("[validate-phone]").each(function () {
        let val = $(this).val().trim();
        let phoneRegex = /^[0-9]{10,15}$/;
        if (val !== "" && !phoneRegex.test(val)) {
            Swal.fire({
                title: "Invalid phone number.",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Ok'
            });

            $(this).focus();
            isValid = false;
            return false;
        }
        if (val == "") {
            Swal.fire({
                title: "Invalid phone number.",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Ok'
            });
            $(this).focus();
            isValid = false;
            return false; // break loop
        }
    });

    if (!isValid) { e.stopImmediatePropagation(); return false; }

    $("[validate-cnic]").each(function () {
        let val = $(this).val().trim();
        let cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
        if (val !== "" && !cnicRegex.test(val)) {
            Swal.fire({
                title: "Invalid CNIC format. Use 12345-1234567-1",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Ok'
            });

            $(this).focus();
            isValid = false;
            return false;
        }
        if (val == "") {
            Swal.fire({
                title: "Invalid CNIC format. Use 12345-1234567-1",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Ok'
            });

            $(this).focus();
            isValid = false;
            return false; // break loop
        }
    });

    if (!isValid) { e.stopImmediatePropagation(); return false; }

    $("[validate-required]").each(function () {
        let val = $(this).val().trim();
        if (val === "") {
            Swal.fire({
                title: "This field is required.",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Ok'
            });
            $(this).focus();
            isValid = false;
            return false;
        }
    });

    if (!isValid) { e.stopImmediatePropagation(); return false; }

    $("[validate-number]").each(function () {
        let val = $(this).val().trim();
        if (val !== "" && !/^\d+$/.test(val)) {
            Swal.fire({
                title: "Only numbers are allowed.",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Ok'
            });
            $(this).focus();
            isValid = false;
            return false;
        }
        if (val == "") {
            Swal.fire({
                title: "Only numbers are allowed.",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Ok'
            });
            $(this).focus();
            isValid = false;
            return false; // break loop
        }
    });

    if (!isValid) { e.stopImmediatePropagation(); return false; }


});



document.addEventListener("DOMContentLoaded", function (event) {

    const showNavbar = (toggleId, navId, bodyId, headerId) => {
        const toggle = document.getElementById(toggleId),
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
function savebackup() {

    UTILITY.CheckSession((data_) => {


            new APICALL(GetGlobalURL('Base', 'CreateBackup'), 'GET', '', true).FETCH((result, error) => {

                if (result) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'DB Backup Create Successfully!',
                        footer: ''
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
    });
}
