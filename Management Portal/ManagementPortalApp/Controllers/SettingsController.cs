using ManagementPortalApp.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ManagementPortalApp.Controllers
{
    [Authorize(AuthenticationSchemes = "ASPXAUTH")]
    [TypeFilter(typeof(AuthenticationAccess))]
    public class SettingsController : Controller
    {
        public IActionResult UserMaster()
        {
            return View();
        }
        public IActionResult RolesMaster()
        {
            return View();
        }
        public IActionResult SystemPriviliges()
        {
            return View();
        }
        public IActionResult SmtpSetting()
        {
            return View();
        }
        public IActionResult Formsmaster()
        {
            return View();
        }
        public IActionResult Apismaster()
        {
            return View();
        }
        
    }
}
