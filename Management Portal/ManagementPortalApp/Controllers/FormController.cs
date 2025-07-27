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
        public IActionResult DistributorMaster()
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
        public IActionResult SupplierLedgers()
        {
            return View();
        }
        public IActionResult CompanyMaster()
        {
            return View();
        }
    }
}
