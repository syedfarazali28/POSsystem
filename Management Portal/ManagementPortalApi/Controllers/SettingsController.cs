using ManagementPortalApi.Context;
using ManagementPortalApi.Extensions;
using ManagementPortalApi.Models.Authentication;
using ManagementPortalApi.Models.Classes;
using ManagementPortalApi.Models.Settings;
using ManagementPortalApi.RateLimiting;
using ManagementPortalApi.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Specialized;
using System.Data;
using System.DirectoryServices;
using System.Net;
using System.Reflection;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Security.Cryptography;
using System.Text;
using Newtonsoft.Json;
namespace ManagementPortalApi.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/{controller}/{action}/{id:int?}")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;


        private readonly DataAccessLayer _DAL;
        private readonly SendEmail _sendemail;
        private readonly ILogger<SettingsController> _logger;
        private readonly DataEncryptor _dataencryptor;
        private readonly RandomStringGenerator _randomstringgenerator;

        public SettingsController(DataAccessLayer DAL, ILogger<SettingsController> logger, SendEmail sendemail, DataEncryptor dataencryptor, RandomStringGenerator randomstringgenerator, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _DAL = DAL;
            _logger = logger;
            _sendemail = sendemail;
            _dataencryptor = dataencryptor;
            _randomstringgenerator = randomstringgenerator;
        }

        #region Activity Log
        public void SystemActivityLog(int? ActivityID, string? ActivityDetails)
        {
            bool Result = false;

            ClaimsPrincipal claimsPrincipal = HttpContext.User;
            string HostName = Dns.GetHostName();
            IPHostEntry HostIPs = Dns.GetHostEntry(HostName);
            string IPAddress = HostIPs.AddressList[0].ToString();
            string UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();
            var routeData = HttpContext.Request.RouteValues;
            string controllerName = routeData["controller"].ToString();
            string actionName = routeData["action"].ToString();
            string FormName = controllerName + "/" + actionName;
            string ActivityDetailsComplete = IPAddress + " " + ActivityDetails + " " + FormName;

            try
            {
                NameValueCollection nv = new NameValueCollection();
                nv.Clear();
                nv.Add("FormID-INT", "0");
                nv.Add("ActivityID-INT", ActivityID.ToString());
                nv.Add("UserID-INT", UserID);
                nv.Add("ActivityDetails-VARCHAR", ActivityDetailsComplete);
                Result = _DAL.InsertData("sp_insert_activitylog", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                _logger.LogInformation("{0} {1} {2}", controllerName, MethodBase.GetCurrentMethod().Name, ActivityDetailsComplete);
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2} {3}", controllerName, MethodBase.GetCurrentMethod().Name, ActivityDetailsComplete, ex.Message);
            }
        }
        #endregion

        #region RolesMaster
        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetRoles()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_select_roles", null, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_roles");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_roles");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetRolesByID(string RoleID)
        {
            DataTable dt = new DataTable();
            string methodName = MethodBase.GetCurrentMethod().Name;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("RoleID-INT", RoleID);
                dt = _DAL.GetData("sp_select_roles_byid", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_roles_byid");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_roles_byid");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(50, 5)]
        [HttpPost]
        public IActionResult EditRoles([FromBody] Role role)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("RoleID-INT", role.RoleID);
                nv.Add("RoleName-VARCHAR", HttpUtility.HtmlEncode(role.RoleName));
                nv.Add("IsActive-BIT", role.IsActive == null ? "0" : "1");
                nv.Add("UserID-INT", role.UserID);
                Result = _DAL.InsertData("sp_update_role", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Update, ActivityLog.ActivityDetails_Update + "sp_update_role");

                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Update, ActivityLog.ActivityDetails_Update2 + "sp_update_role");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            if (Result)
            {
                return Ok(Result);
            }
            else
            {
                return BadRequest(Result);
            }
        }

        [RateLimitMiddleware(50, 5)]
        [HttpPost]
        public IActionResult SaveRoles([FromBody] Role role)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("RoleName-VARCHAR", HttpUtility.HtmlEncode(role.RoleName));
                nv.Add("IsActive-BIT", role.IsActive == null ? "0" : "1");
                nv.Add("UserID-INT", role.UserID);
                Result = _DAL.InsertData("sp_insert_role", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_insert_role");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_insert_role");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            if (Result)
            {
                return Ok(Result);
            }
            else
            {
                return BadRequest(Result);
            }
        }

        [RateLimitMiddleware(50, 5)]
        [HttpPost]
        public IActionResult DeleteRoles([FromBody] DeleteFromDB deleteFromDB_)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("RoleID-INT", deleteFromDB_.RoleID);
                nv.Add("UserID-INT", deleteFromDB_.UserID);
                Result = _DAL.InsertData("sp_delete_role", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Delete, ActivityLog.ActivityDetails_Delete + "sp_delete_role");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Delete, ActivityLog.ActivityDetails_Delete2 + "sp_delete_role");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            return Ok(Result);
        }
        #endregion

        #region UserMaster
        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetUserType(string TypeID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("TypeID-INT", TypeID);
                dt = _DAL.GetData("sp_select_usertype", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_usertype");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_usertype");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            return Ok(dt);

        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetUsersByType(string TypeID, string UserID)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("TypeID-INT", TypeID);
                nv.Add("UserID-INT", UserID);
                dt = _DAL.GetData("sp_select_users", nv, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_users");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_users");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " sp_select_users" + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetForms()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_select_forms", null, _DAL.CSManagementPortalDatabase);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_forms");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_forms");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                BadRequest(ex.Message);
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(50, 5)]
        [HttpPost]
        public IActionResult EditUsers([FromBody] User user)
        {
            bool Result = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("UserID-INT", user.UserID);
                nv.Add("UserName-VARCHAR", HttpUtility.HtmlEncode(user.UserName));
                nv.Add("UserEmail-VARCHAR", HttpUtility.HtmlEncode(user.UserEmail));
                nv.Add("RoleID-INT", user.RoleID);
                nv.Add("DefaultFormID-INT", user.FormID);
                nv.Add("UserTypeID-INT", user.UserTypeID);
                nv.Add("MobileNumber-VARCHAR", HttpUtility.HtmlEncode(user.MobileNumber));
                nv.Add("IsActive-BIT", user.IsActive == null ? "0" : "1");
                nv.Add("EditUserID-INT", user.EditUserID);
                nv.Add("IsAdUser-BIT", user.IsAdUser == null ? "0" : "1");
                nv.Add("Designation-VARCHAR", user.Designation == null ? "NULL" : HttpUtility.HtmlEncode(user.Designation));
                nv.Add("Department-VARCHAR", user.Department == null ? "NULL" : HttpUtility.HtmlEncode(user.Department));
                nv.Add("DomainName-VARCHAR", user.DomainName == null ? "NULL" : HttpUtility.HtmlEncode(user.DomainName));
                nv.Add("LoginName-VARCHAR", HttpUtility.HtmlEncode(user.LoginName));
                Result = _DAL.InsertData("sp_update_user", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Update, ActivityLog.ActivityDetails_Update + "sp_update_user");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Update, ActivityLog.ActivityDetails_Update2 + "sp_update_user");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            if (Result)
            {
                return Ok(Result);
            }
            else
            {
                return BadRequest(Result);
            }
        }

        [RateLimitMiddleware(50, 5)]
        [HttpPost]
        public IActionResult SaveUsers([FromBody] User user)
        {
            bool Result = false;
            DataTable dt;
            try
            {

                string encrypted_password = string.Empty;
                string isAdUser = user.IsAdUser == null ? "0" : "1";
                if (isAdUser == "0")
                {
                    string RandomStrings = _randomstringgenerator.GetRandomString();
                    string EmailBody = ActivityLog.EmailBody + " RandomPassword : " + RandomStrings;
                    bool SendMail = _sendemail.SendEmailToUsers(new List<string> { user.UserEmail }, EmailBody, ActivityLog.EmailSubject, _DAL);

                    if (SendMail)
                    {
                        encrypted_password = _dataencryptor.HashPassword(RandomStrings);
                    }
                }

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("UserID-INT", (user.UserID == null ? "NULL" : user.UserID));
                nv.Add("UserName-VARCHAR", HttpUtility.HtmlEncode(user.UserName));
                nv.Add("UserEmail-VARCHAR", (user.UserEmail == null ? "NULL" : HttpUtility.HtmlEncode(user.UserEmail)));
                nv.Add("UserPassword-VARCHAR", encrypted_password);
                nv.Add("RoleID-INT", user.RoleID);
                nv.Add("DefaultFormID-INT", user.FormID);
                nv.Add("UserTypeID-INT", user.UserTypeID);
                nv.Add("MobileNumber-VARCHAR", HttpUtility.HtmlEncode(user.MobileNumber));
                nv.Add("IsActive-INT", user.IsActive == null ? "0" : "1");
                nv.Add("CreateUserID-INT", user.EditUserID);
                nv.Add("IsAdUser-BIT", user.IsAdUser == null ? "0" : "1");
                nv.Add("Designation-VARCHAR", user.Designation == null ? "NULL" : HttpUtility.HtmlEncode(user.Designation));
                nv.Add("Department-VARCHAR", user.Department == null ? "NULL" : HttpUtility.HtmlEncode(user.Department));
                nv.Add("DomainName-VARCHAR", user.DomainName == null ? "NULL" : HttpUtility.HtmlEncode(user.DomainName));
                nv.Add("LoginName-VARCHAR", HttpUtility.HtmlEncode(user.LoginName));
                dt = _DAL.GetData("sp_insert_user", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_insert_user");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_insert_user");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            if (dt != null)
            {
                return Ok(dt);
            }
            else
            {
                return BadRequest(dt);
            }
        }

        [RateLimitMiddleware(50, 5)]
        [HttpPost]
        public IActionResult DeleteUsers([FromBody] DeleteFromDB deleteFromDB_)
        {
            bool Result = false;

            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("UserID-INT", deleteFromDB_.UserID);
                nv.Add("EditUserID-INT", deleteFromDB_.EditUserID);
                Result = _DAL.InsertData("sp_delete_user", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Delete, ActivityLog.ActivityDetails_Delete + "sp_delete_user");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Delete, ActivityLog.ActivityDetails_Delete2 + "sp_delete_user");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            return Ok(Result);
        }

        #endregion

        #region RolesMapping

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetMapping(string RoleId)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();

                nv.Clear();
                nv.Add("RoleID-INT", RoleId);
                dt = _DAL.GetData("sp_select_rolesmapping", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_rolesmapping");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_rolesmapping");
                }

            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult GetMapping_2(string RoleId)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();

                nv.Clear();
                nv.Add("RoleID-INT", RoleId);
                dt = _DAL.GetData("sp_select_rolesmapping_2", nv, _DAL.CSManagementPortalDatabase);
                nv = null;
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_rolesmapping_2");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_rolesmapping_2");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }

        [RateLimitMiddleware(50, 5)]
        [HttpPost]
        public IActionResult UpdateRolesMapping([FromBody] RoleMapping mapping)
        {
            bool Result = false;
            bool Result2 = false;
            try
            {
                NameValueCollection? nv = new NameValueCollection();

                nv.Clear();
                nv.Add("RoleID-INT", mapping.RoleID);
                Result = _DAL.InsertData("sp_delete_rolemapping", nv, _DAL.CSManagementPortalDatabase);

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Delete, ActivityLog.ActivityDetails_Delete + "sp_delete_rolemapping");

                    foreach (RoleMappingCollection item in mapping.RoleMappingCollection)
                    {
                        nv.Clear();
                        nv.Add("RoleID-INT", mapping.RoleID);
                        nv.Add("UserID-INT", mapping.UserID);
                        nv.Add("FormsID-INT", item.FormsID);
                        nv.Add("AllowInsert-BIT", item.AllowInsert);
                        nv.Add("AllowUpdate-BIT", item.AllowUpdate);
                        nv.Add("AllowDelete-BIT", item.AllowDelete);
                        Result2 = _DAL.InsertData("sp_update_rolesmapping", nv, _DAL.CSManagementPortalDatabase);

                        if (Result2)
                        {
                            SystemActivityLog(ActivityLog.ActivityID_Update, ActivityLog.ActivityDetails_Update + "sp_update_rolesmapping");
                        }
                        else
                        {
                            SystemActivityLog(ActivityLog.ActivityID_Update, ActivityLog.ActivityDetails_Update2 + "sp_update_rolesmapping");
                        }
                    }
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Delete, ActivityLog.ActivityDetails_Delete2 + "sp_delete_rolemapping");
                }
                nv = null;
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }

            if (Result)
            {
                return Ok(Result);
            }
            else
            {
                return BadRequest(Result);
            }
        }

        #endregion

        #region API Acess
        [HttpGet]
        public IActionResult GetAllowedApiByRole(string RoleID)
        {
            DataTable dt = new DataTable();
            string methodName = MethodBase.GetCurrentMethod().Name;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("RoleID-INT", RoleID);
                dt = _DAL.GetData("sp_select_roles_byid", nv, _DAL.CSManagementPortalDatabase);
                nv = null;

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_roles_byid");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_roles_byid");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " sp_select_roles_byid" + ex.Message);
                return BadRequest("Something Went Wrong Please Contact Your Sysmtem Adminsitrator");
            }
            return Ok(dt);
        }
        #endregion

        #region AdUsers

        [RateLimitMiddleware(100, 5)]
        [HttpGet]
        public IActionResult FetchAdUsers()
        {
            DataTable dt = new DataTable();
            DataTable dtUsers = new DataTable();
            try
            {

                dt = _DAL.GetData("sp_select_ldapsettings2", null, _DAL.CSManagementPortalDatabase);
                string Ldap = dt.Rows[0]["LdapPath"].ToString();
                string userid = dt.Rows[0]["LdapUser"].ToString();
                string password = dt.Rows[0]["LdapPassword"].ToString();

                dtUsers = LoadAdUsers(Ldap, userid, password);

                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_ldapsettings2");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_ldapsettings2");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dtUsers);

        }

        private DataTable LoadAdUsers(string Ldap, string userid, string password)
        {

            DirectoryEntry myLdapConnection = new DirectoryEntry(Ldap, userid, _dataencryptor.DecryptPassword(password));
            DirectorySearcher search = new DirectorySearcher(myLdapConnection) { Filter = ("(objectClass=user)") };
            search.CacheResults = true;

            SearchResultCollection allResults = search.FindAll();
            string varStr = myLdapConnection.Name.ToString();
            string[] varDomain = varStr.Split('=');

            DataTable table = new DataTable();
            table.TableName = "AdUsers";
            table.Columns.Add("UserName");
            table.Columns.Add("UserID");
            table.Columns.Add("EmailID");
            table.Columns.Add("Designation");
            table.Columns.Add("Department");
            table.Columns.Add("TelephoneNo");
            table.Columns.Add("DomainName");
            foreach (SearchResult searchResult in allResults)
            {
                string UserName = "";
                string UserID = "";
                string EmailID = "";
                string Department = "";
                string Designation = "";
                string TelephoneNo = "";
                string DomainName = varDomain[1];
                if (searchResult.Properties["name"] != null && searchResult.Properties["name"].Count > 0)
                {
                    UserName = searchResult.Properties["name"][0].ToString();
                }
                if (UserName == "MettisDev2")
                {

                }
                if (searchResult.Properties["department"] != null && searchResult.Properties["department"].Count > 0)
                {
                    Department = searchResult.Properties["department"][0].ToString();
                }
                if (searchResult.Properties["title"] != null && searchResult.Properties["title"].Count > 0)
                {
                    Designation = searchResult.Properties["title"][0].ToString();
                }
                if (searchResult.Properties["samAccountName"] != null && searchResult.Properties["samAccountName"].Count > 0)
                {
                    UserID = searchResult.Properties["samAccountName"][0].ToString();
                }
                if (searchResult.Properties["mail"] != null && searchResult.Properties["mail"].Count > 0)
                {
                    EmailID = searchResult.Properties["mail"][0].ToString();
                }
                if (searchResult.Properties["telephonenumber"] != null && searchResult.Properties["telephonenumber"].Count > 0)
                {
                    TelephoneNo = searchResult.Properties["telephonenumber"][0].ToString();
                }

                DataRow NewRow = table.NewRow();
                NewRow["UserName"] = UserName; ;
                NewRow["UserID"] = UserID;
                NewRow["EmailID"] = EmailID;
                NewRow["Designation"] = Designation;
                NewRow["Department"] = Department;
                NewRow["TelephoneNo"] = TelephoneNo;
                NewRow["DomainName"] = DomainName;
                table.Rows.Add(NewRow);
            }
            return table;
        }
        #endregion

        #region SmtpSetting

        [RateLimitMiddleware(50, 5)]
        [HttpPost]
        public IActionResult SmtpSettingUpdate([FromBody] SMTPSettings smtpSetting)
        {

            bool Result = false;

            DataTable dt;
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("Smtp-VARCHAR", HttpUtility.HtmlEncode(smtpSetting.Smtp));
                nv.Add("SenderEmailID-VARCHAR", HttpUtility.HtmlEncode(smtpSetting.SenderEmailID));
                nv.Add("SmtpPassword-VARCHAR", smtpSetting.SmtpPassword);
                nv.Add("SmtpPort-VARCHAR", HttpUtility.HtmlEncode(smtpSetting.SmtpPort));
                nv.Add("DisplayName-VARCHAR", HttpUtility.HtmlEncode(smtpSetting.DisplayName));
                nv.Add("EnableSSL-BIT", smtpSetting.EnableSSL.ToString());

                Result = _DAL.InsertData("sp_insert_smtpsetting", nv, _DAL.CSManagementPortalDatabase);

                nv = null;

                if (Result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert + "sp_insert_smtpsetting");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Insert, ActivityLog.ActivityDetails_Insert2 + "sp_insert_smtpsetting");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(Result);


        }

        [HttpGet]
        public IActionResult SmtpSettingGet()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = _DAL.GetData("sp_select_SmtpSettings", null, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_SmtpSettings");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_SmtpSettings");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }

        #endregion

        #region Db Backup

        [RateLimitMiddleware(10, 5)]
        [HttpGet]
        public IActionResult CreateBackup()
        {
            DataTable dt = new DataTable();
            DataTable dtUsers = new DataTable();
            try
            {

                dt = _DAL.GetData("sp_cratedatabsebackup", null, _DAL.CSManagementPortalDatabase);





                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_ldapsettings2");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_ldapsettings2");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);

        }

        #endregion

        #region forms


        [HttpGet]
        public IActionResult Getformsmaster()
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                dt = _DAL.GetData("sp_select_formsmaster", null, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_category");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_category");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpPost]
        public IActionResult SaveFormsmasterData([FromBody] Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                nv.Add("Id-INT", p.Param1);
                nv.Add("Category-VARCHAR", p.Param2);
                nv.Add("isactive-BIT", p.Param3);
                var isInserted = _DAL.InsertData("sp_update_category", nv, _DAL.CSManagementPortalDatabase);
                if (!isInserted)
                {
                    return BadRequest("Failed to Updated categories.");
                }

                return Ok("Categories Updated successfully.");

            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        #endregion

        #region GetCategory

        [HttpPost]
        public IActionResult SaveCategoryData(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {



                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                nv.Add("CategoryID-INT", p.Param1 == null ? "0" : p.Param1);
                nv.Add("Category-VARCHAR", p.Param2);
                nv.Add("isactive-INT", (p.Param3 == "true" ? 1 : 0).ToString());

                var isInserted = _DAL.InsertData("sp_insert_Category", nv, _DAL.CSManagementPortalDatabase);
                if (!isInserted)
                {
                    return BadRequest("Failed to Updated categories.");
                }

                return Ok("Categories Updated successfully.");

            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }



        [HttpGet]
        public IActionResult GetCategory()
        {
            DataTable dt = new DataTable();
            try
            {

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                dt = _DAL.GetData("sp_select_category", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_category");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_category");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }

        [HttpGet]
        public IActionResult GetactiveCategory()
        {
            DataTable dt = new DataTable();
            try
            {

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                dt = _DAL.GetData("sp_select_activecategory", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_category");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_category");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }



        [HttpPost]
        public IActionResult GetCategoryDataByid(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("Id-INT", p.Param1);

                dt = _DAL.GetData("sp_select_categorybyid", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_categorybyid");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_categorybyid");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpPost]
        public IActionResult DeleteCategoryDataByid(Parameters p)
        {
            var result = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("Id-INT", p.Param1);

                result = _DAL.GetData("sp_delete_Category", nv, _DAL.CSManagementPortalDatabase);
                if (result.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_categorybyid");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_categorybyid");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(result);
        }

        #endregion

        #region Product
        [HttpGet]
        public IActionResult GetProductData()
        {
            DataTable dt = new DataTable();
            try
            {

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                dt = _DAL.GetData("sp_select_Product", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_Product");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_Product");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }

        [HttpGet]
        public IActionResult GetactiveProductData()
        {
            DataTable dt = new DataTable();
            try
            {

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                dt = _DAL.GetData("sp_select_activeProduct", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_Product");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_Product");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpPost]
        public IActionResult SaveProductData(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {



                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                nv.Add("ProductID-INT", p.Param1 == null ? "0" : p.Param1);
                nv.Add("CategoryID-INT", p.Param2);
                nv.Add("ProductName-VARCHAR", p.Param3);

                nv.Add("IsActive-INT", (p.Param4 == "true" ? 1 : 0).ToString());

                var isInserted = _DAL.InsertData("sp_insert_Product", nv, _DAL.CSManagementPortalDatabase);
                if (!isInserted)
                {
                    return BadRequest("Failed to Updated Product.");
                }

                return Ok("Product Updated successfully.");

            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpPost]
        public IActionResult GetProductDataByid(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("Id-INT", p.Param1);

                dt = _DAL.GetData("sp_select_productbyid", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_categorybyid");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_categorybyid");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpPost]
        public IActionResult DeleteProductDataByid(Parameters p)
        {
            var result = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("Id-INT", p.Param1);

                result = _DAL.GetData("sp_delete_Product", nv, _DAL.CSManagementPortalDatabase);
                if (result.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_delete_Product");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_delete_Product");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(result);
        }

        #endregion

        #region Supply Data
        [HttpPost]
        public IActionResult GetSuppliersDataByid(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("Id-INT", p.Param1);

                dt = _DAL.GetData("sp_select_Supplierbyid", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_categorybyid");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_categorybyid");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }

        [HttpGet]
        public IActionResult GetSupplyData()
        {
            DataTable dt = new DataTable();
            try
            {

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                dt = _DAL.GetData("sp_select_Supplier", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_Product");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_Product");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpGet]
        public IActionResult GetSupplyActiveData()
        {
            DataTable dt = new DataTable();
            try
            {

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                dt = _DAL.GetData("sp_select_ActiveSupplier", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_Product");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_Product");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpPost]
        public IActionResult SaveSuppliersData(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {



                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("SupplierID-INT", p.Param1 == null ? "0" : p.Param1);
                nv.Add("SupplierName-VARCHAR", p.Param2);
                nv.Add("Address-VARCHAR", p.Param3);
                nv.Add("ContactNumber-VARCHAR", p.Param4);
                nv.Add("Email-VARCHAR", p.Param5);
                nv.Add("IsActive-INT", (p.Param6 == "true" ? "1" : "0"));
                var isInserted = _DAL.InsertData("sp_insert_Supplier", nv, _DAL.CSManagementPortalDatabase);
                if (!isInserted)
                {
                    return BadRequest("Failed to Updated Product.");
                }

                return Ok("Product Updated successfully.");

            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpPost]
        public IActionResult DeleteSuppliersDataByid(Parameters p)
        {
            var result = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("SupplierID-INT", p.Param1);

                result = _DAL.GetData("sp_delete_Supplier", nv, _DAL.CSManagementPortalDatabase);
                if (result.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_delete_Product");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_delete_Product");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(result);
        }
        #endregion

        #region Distributor Data
        [HttpPost]
        public IActionResult GetDistributorDataByid(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("Id-INT", p.Param1);

                dt = _DAL.GetData("sp_select_distributorbyid", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_categorybyid");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_categorybyid");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpGet]
        public IActionResult GetDistributorData()
        {
            DataTable dt = new DataTable();
            try
            {

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                dt = _DAL.GetData("sp_select_distributor", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_Product");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_Product");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpPost]
        public IActionResult SaveDistributorData(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {



                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("ID-INT", p.Param1 == null ? "0" : p.Param1);
                nv.Add("DistributorName-VARCHAR", p.Param2);
                nv.Add("Address-VARCHAR", p.Param3);
                nv.Add("ContactNumber-VARCHAR", p.Param4);
                nv.Add("Email-VARCHAR", p.Param5);
                nv.Add("IsActive-INT", (p.Param6 == "true" ? "1" : "0"));
                var isInserted = _DAL.InsertData("sp_insert_distributor", nv, _DAL.CSManagementPortalDatabase);
                if (!isInserted)
                {
                    return BadRequest("Failed to Updated Product.");
                }

                return Ok("Product Updated successfully.");

            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpPost]
        public IActionResult DeleteDistributorDataByid(Parameters p)
        {
            var result = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("ID-INT", p.Param1);

                result = _DAL.GetData("sp_delete_distributor", nv, _DAL.CSManagementPortalDatabase);
                if (result.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_delete_Product");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_delete_Product");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(result);
        }
        #endregion

        #region ProductSku Data

        [HttpPost]
        public IActionResult GetProductSkuDataByid(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("Id-INT", p.Param1);

                dt = _DAL.GetData("sp_select_ProductSkubyid", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_categorybyid");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_categorybyid");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpGet]
        public IActionResult GetProductSkuData()
        {
            DataTable dt = new DataTable();
            try
            {

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                dt = _DAL.GetData("sp_select_ProductSku", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_Product");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_Product");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }

        [HttpPost]
        public IActionResult SaveProductSkuData([FromBody] List<Parameters> Data)
        {
            DataTable dt = new DataTable();
            try
            {
                for (int i = 0; i < Data.Count; i++)
                {


                    string barcode = GeneratorBarCode();


                    NameValueCollection? nv = new NameValueCollection();
                    nv.Clear();
                    nv.Add("SkuID-INT", Data[i].Param1 == null ? "0" : Data[i].Param1);
                    nv.Add("ProductID-INT", Data[i].Param2);
                    nv.Add("ProductName-VARCHAR", Data[i].Param4);
                    nv.Add("Base64Image-VARCHAR", Data[i].Param5);
                    nv.Add("Amount-DECIMAL", Data[i].Param6);
                    nv.Add("IsActive-INT", (Data[i].Param7 == "true" ? "1" : "0"));
                    nv.Add("ImageName-VARCHAR", Data[i].Param8);
                    nv.Add("Barcode-VARCHAR", barcode);
                    //nv.Add("ExpiryDate-DATETIME", Data[i].Param5);




                    var isInserted = _DAL.InsertData("sp_insert_productSku", nv, _DAL.CSManagementPortalDatabase);

                }
                //if (!isInserted)
                //{
                //    return BadRequest("Failed to Updated Product.");
                //}
                return Ok("Product Updated successfully.");

            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        public string GeneratorBarCode()
        {

            string? Param;
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            var result = new StringBuilder();
            int length = 10; // Or any desired length

            for (int i = 0; i < length; i++)
            {
                result.Append(chars[random.Next(chars.Length)]);
            }
            string datetimePart = DateTime.Now.ToString("yyyy-MM-dd HH-mm-ss");

            Param = result.ToString() + datetimePart;
            return Param;


        }
        [HttpPost]
        public IActionResult DeleteProductSkuDataByid(Parameters p)
        {
            var result = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("ID-INT", p.Param1);

                result = _DAL.GetData("sp_delete_productsku", nv, _DAL.CSManagementPortalDatabase);
                if (result.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_delete_Product");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_delete_Product");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(result);
        }
        #endregion

        #region SalesPerson
        [HttpGet]
        public IActionResult GetSalesPersonData()
        {
            DataTable dt = new DataTable();
            try
            {

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                dt = _DAL.GetData("sp_select_salesperson", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_Product");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_Product");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpPost]
        public IActionResult GetsalespersonByid(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("Id-INT", p.Param1);

                dt = _DAL.GetData("sp_select_salespersonbyid", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_categorybyid");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_categorybyid");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }

        [HttpPost]
        public IActionResult SavesalespersonData(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {



                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("ID-INT", p.Param1 == null ? "0" : p.Param1);
                nv.Add("salespersonName-VARCHAR", p.Param2);
                nv.Add("Address-VARCHAR", p.Param3);
                nv.Add("ContactNumber-VARCHAR", p.Param4);
                nv.Add("Email-VARCHAR", p.Param5);
                nv.Add("IsActive-INT", (p.Param6 == "true" ? "1" : "0"));
                var isInserted = _DAL.InsertData("sp_insert_salesperson", nv, _DAL.CSManagementPortalDatabase);
                if (!isInserted)
                {
                    return BadRequest("Failed to Updated Product.");
                }

                return Ok("Product Updated successfully.");

            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpPost]
        public IActionResult DeletesalespersonByid(Parameters p)
        {
            var result = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("ID-INT", p.Param1);

                result = _DAL.GetData("sp_delete_salesperson", nv, _DAL.CSManagementPortalDatabase);
                if (result.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_delete_Product");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_delete_Product");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(result);
        }
        #endregion

        #region Purchase


        [HttpPost]
        public IActionResult CheckBarcodeDuplication(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {



                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                nv.Add("barcode-varchar", p.Param1);

                 dt = _DAL.GetData("sp_select_barcode", nv, _DAL.CSManagementPortalDatabase);


                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_category");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_category");
                }

            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }


        [HttpGet]
        public IActionResult GetMapCategory()
        {
            DataTable dt = new DataTable();
            try
            {

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                dt = _DAL.GetData("sp_select_mapcategory", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_category");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_category");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpPost]
        public IActionResult SavePurchaseWithDetails(Parameters p)
        {
            var result = false;
            try
            {

                DataTable purchaseDetailTable = new DataTable();

                purchaseDetailTable.Columns.Add("ProductID", typeof(int));         
                purchaseDetailTable.Columns.Add("ProductSkuID", typeof(int));      
                purchaseDetailTable.Columns.Add("Quantity", typeof(int));          
                purchaseDetailTable.Columns.Add("UnitPrice", typeof(decimal));     
                purchaseDetailTable.Columns.Add("Total", typeof(decimal));         
                purchaseDetailTable.Columns.Add("Barcode", typeof(string));        
                purchaseDetailTable.Columns.Add("ExpiryDate", typeof(DateTime));   
                purchaseDetailTable.Columns.Add("IsBonus", typeof(string));
                purchaseDetailTable.Columns.Add("TransactionType", typeof(string));

                foreach (var item in p.List)
                {
                    purchaseDetailTable.Rows.Add(
                    item.Param3,   
                    item.Param4,   
                    item.Param7,   
                    item.Param8,   
                    item.Param9,   
                    item.Param5,   
                    item.Param6,   
                    item.Param10,
                    item.Param1      // 👈 NEW: 'Purchase' or 'Return'
                    );
                }



                NameValueCollection nvc = new NameValueCollection();
                nvc.Add("PurchaseDate-VarChar", p.Param1);
                nvc.Add("InvoiceNumber-VarChar", p.Param2);
                nvc.Add("SupplierID-Int", p.Param3);
                nvc.Add("TotalAmount-Decimal", p.Param6);
                nvc.Add("PaymentModeID-Int", p.Param4);
                nvc.Add("Base64-VARCHAR", p.Param5);
                nvc.Add("Remarks-VarChar", p.Param7);
                nvc.Add("LocationID-Int", p.Param8);
                nvc.Add("CreatedBy-Int", p.Param9);




                DataSet ds = new DataSet();
                ds.Tables.Add(purchaseDetailTable);

                string[] typeParams = { "@PurchaseDetails" };

                result = _DAL.InsertDataWithType("sp_insert_purchase", nvc, typeParams, ds, _DAL.CSManagementPortalDatabase);



                if (result)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_delete_Product");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_delete_Product");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(result);
        }
        [HttpPost]
        public IActionResult GetProductByCategoryID(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("CategoryID-INT", p.Param1 == null ? "0" : p.Param1);
                dt = _DAL.GetData("sp_select_ProductByCategoryID", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_Product");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_Product");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpPost]
        public IActionResult GetProductskuByProductID(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("Id-INT", p.Param1);

                dt = _DAL.GetData("sp_select_ProductskuByProductID", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_categorybyid");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_categorybyid");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpPost]
        public IActionResult GetSupplierBalance(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("ID-INT", p.Param1);

                dt = _DAL.GetData("sp_select_supplierpaymentrealateinfo", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_categorybyid");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_categorybyid");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpGet]
        public IActionResult GetInvoiceno()
        {
            DataTable dt = new DataTable();
            try
            {

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                dt = _DAL.GetData("sp_select_invoiceno", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_Product");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_Product");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpGet]
        public IActionResult GetStockLocationTypeData()
        {
            DataTable dt = new DataTable();
            try
            {

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                dt = _DAL.GetData("sp_select_StockLocation", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_StockLocation");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_StockLocation");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpGet]
        public IActionResult GetPaymentModeData()
        {
            DataTable dt = new DataTable();
            try
            {

                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();

                dt = _DAL.GetData("sp_select_PaymentModeData", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_Product");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_Product");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
        [HttpPost]
        public IActionResult GetPriceByskuID(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("Id-INT", p.Param1);

                dt = _DAL.GetData("sp_select_PriceByskuID", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_categorybyid");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_categorybyid");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }
    
        [HttpPost]
        public IActionResult GetSupplierLedgers(Parameters p)
        {
            DataTable dt = new DataTable();
            try
            {
                NameValueCollection? nv = new NameValueCollection();
                nv.Clear();
                nv.Add("sdate-DateTime", p.Param1);
                nv.Add("edate-DateTime", p.Param2);
                nv.Add("SupplierID-INT", p.Param3);
                dt = _DAL.GetData("sp_select_suppliersedgers", nv, _DAL.CSManagementPortalDatabase);
                if (dt != null && dt.Rows.Count > 0)
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get + "sp_select_suppliersedgers");
                }
                else
                {
                    SystemActivityLog(ActivityLog.ActivityID_Get, ActivityLog.ActivityDetails_Get2 + "sp_select_suppliersedgers");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("{0} {1} {2}", "FormsController", MethodBase.GetCurrentMethod().Name, ex.Message);
                SystemActivityLog(ActivityLog.ActivityID_Error, MethodBase.GetCurrentMethod().Name + " " + ex.Message);
                return BadRequest(ex.Message);
            }

            return Ok(dt);
        }


        #endregion
    }
}
