using ManagementPortalApp.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ManagementPortalApp.Controllers
{
    [Authorize(AuthenticationSchemes = "ASPXAUTH")]
    [TypeFilter(typeof(AuthenticationAccess))]
    public class FormController : Controller
    {
        public IActionResult Category()
        {
            return View();
        }
        public IActionResult Product()
        {
            return View();
        }
        public IActionResult SuppliersMaster()
        {
            return View();
        }
        public IActionResult CustomerMaster()
        {
            return View();
        }
        public IActionResult ProductskuMaster()
        {
            return View();
        }

        public IActionResult SalesPersonMaster()
        {
            return View();
        }

        public IActionResult Purchase()
        {
            return View();
        }
        public IActionResult PurchaseReturn()
        {
            return View();
        }
        public IActionResult CompanyLedgers()
        {
            return View();
        }
        public IActionResult CompanyMaster()
        {
            return View();
        }

        public IActionResult Sales()
        {
            return View();
        }  
        public IActionResult OpeningStock()
        {
            return View();
        }
        public IActionResult OpeningCompanyBills()
        {
            return View();
        }    
        public IActionResult OpeningCustomerBills()
        {
            return View();
        }

        public IActionResult SupplierPayment()
        {
            return View();
        }

        public IActionResult CustomerReceipt()
        {
            return View();
        }

        public IActionResult CustomerLedger()
        {
            return View();
        }
    }
}
