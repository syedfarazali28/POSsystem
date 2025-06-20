using ManagementPortalApp.Models.Session;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Data;

namespace ManagementPortalApp.Models.Authentication
{
    public class AllowedApiAccess : ActionFilterAttribute
    {
        private string[]? _extensions;
        private readonly Sessions _sessions;
        public AllowedApiAccess(Sessions sessions)
        {
            _sessions = sessions;
        }


        public override void OnActionExecuting(ActionExecutingContext validationContext)
        {

            bool Result = true;
            var request = validationContext.HttpContext.Request;
            string? RouteValues = ((object[])validationContext.HttpContext.Request.RouteValues.Values)[1].ToString();
            ClaimsPrincipal claimsPrincipal = validationContext.HttpContext.User;
            var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();
            var UniqueKey = (from c in claimsPrincipal.Claims where c.Type == "Guid" select c.Value).FirstOrDefault();
            SessionItems sessionItems = _sessions.GetSession(UniqueKey, UserID);
            List<RolesMapping> rolesMapping = sessionItems.rolesMapping;


            try
            {


                //var _apimaster = rolesMapping.SelectMany(x => x.ApiMaster).Where(y => y.ApiAction == RouteValues).Where(z => z.IsAllowed).FirstOrDefault();

                //if (_apimaster != null)
                //{

                //    if (!_apimaster.IsAllowed)
                //    {
                //        Result = false;
                //    }
                //}
                //else
                //{
                //    Result = false;
                //}


                //if (!Result)
                //{
                //    validationContext.Result = new BadRequestObjectResult(GetErrorMessage());
                //}

            }
            catch (Exception)
            {

                throw;
            }
        }

        public string GetErrorMessage()
        {
            return $"This Api is not allowed! Please Contact System Adminstrator";
        }
    }
}
