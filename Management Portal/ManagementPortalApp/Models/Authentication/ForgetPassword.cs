using System.ComponentModel.DataAnnotations;

namespace ManagementPortalApp.Models.Authentication
{
    public class ForgetPassword
    {
        [Required]
        public string UserEmail { get; set; }
    }
}