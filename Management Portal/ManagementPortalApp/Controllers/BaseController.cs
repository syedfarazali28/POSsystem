using ManagementPortalApp.Models.Base;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using ManagementPortalApp.Utility;
using System.Data;
using ManagementPortalApp.Models.Authentication;
using ManagementPortalApp.Models.Session;
using Microsoft.AspNetCore.Authorization;
using System.Net;
using System.Dynamic;
using ManagementPortalApp.Extensions;
using ManagementPortalApp.Models.Classes;

namespace ManagementPortalApp.Controllers
{
    [Authorize(AuthenticationSchemes = "ASPXAUTH")]
    public class BaseController : Controller
    {
        private readonly Sessions _sessions;
        private readonly DataEncryptor _dataEncryptor;
        private readonly IConfiguration _config;
        private readonly ILogger<BaseController> _logger;

        public BaseController(Sessions sessions, IConfiguration config, ILogger<BaseController> logger, DataEncryptor dataEncryptor)
        {
            _sessions = sessions;
            _config = config;
            _logger = logger;
            _dataEncryptor = dataEncryptor;
        }

        #region Get Session

        private SessionItems GetSessionItems(HttpContext httpContext)
        {
            ClaimsPrincipal claimsPrincipal = httpContext.User;
            string HostName = Dns.GetHostName();
            IPHostEntry HostIPs = Dns.GetHostEntry(HostName);
            string IPAddress = HostIPs.AddressList[0].ToString();
            var UniqueKey = (from c in claimsPrincipal.Claims where c.Type == "Guid" select c.Value).FirstOrDefault();
            var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();
            var ClientID = (from c in claimsPrincipal.Claims where c.Type == "ClientID" select c.Value).FirstOrDefault();
            SessionItems session = _sessions.GetSession(UniqueKey, UserID);
            session.IpAddress = IPAddress;
            return session;
        }
        
        public UserInfo GetUserInformation()
        {
            UserInfo tlistFiltered = new UserInfo();

            try
            {
                SessionItems session = GetSessionItems(HttpContext);
                _logger.LogInformation("{0} {1} UserID : {2} IPAddress : {4}", "BaseController", "GetUserInformation", session.userInfo.UserID, session.IpAddress);
                tlistFiltered = session.userInfo;

            }
            catch (Exception ex)
            {
                _logger.LogCritical("BaseController/GetUserInformation {1}", ex.Message);
            }

            return tlistFiltered;
        }
        #endregion

        #region Get Token
        private string GetAuthToken()
        {
            SessionItems sessionItems = GetSessionItems(HttpContext);
            string authToken = sessionItems.authToken.access_token;
            _logger.LogInformation("{0} {1} UserID : {2} AuthToken :{3} IPAddress : {4}", "BaseController", "GetAuthToken", sessionItems.userInfo.UserID, authToken, sessionItems.IpAddress);
            return authToken;
        }
        #endregion

        [HttpGet]
        public List<RolesMapping> GetSessionForHtml(string RouteValues)
        {
            List<RolesMapping> tlistFiltered = new List<RolesMapping>();

            try
            {
                SessionItems session = GetSessionItems(HttpContext);
                List<RolesMapping> permissionList = session.rolesMapping;
                tlistFiltered = permissionList.Where(item => "/" + item.FormName == RouteValues).ToList();
                _logger.LogInformation("{0} {1} UserID : {2} {3} IPAddress : {4}", "BaseController", "GetSession", session.userInfo.UserID, RouteValues, session.IpAddress);
            }
            catch (Exception ex)
            {
                _logger.LogCritical("BaseController/GetSession {1}", ex.Message);
            }

            return tlistFiltered;
        }

        #region HttpClient GET
        private HttpResponseMessage UseHttpClientGet(string? QueryString, string ApiName, string ControllerName)
        {
            HttpResponseMessage Result_ = new HttpResponseMessage();
            try
            {
                using (var client = new HttpClient())
                {
                    string authtoken = GetAuthToken();
                    client.BaseAddress = new Uri(Environment.GetEnvironmentVariable("AM_SERVICE_URL"));
                    client.DefaultRequestHeaders.Clear();
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authtoken);
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var getTask = client.GetAsync(ControllerName + "/" + ApiName + ((QueryString == null) ? "" : QueryString));
                    getTask.Wait();
                    Result_ = getTask.Result;
                    _logger.LogInformation("{0} {1} APIName: {2} StatusCode :{3}", "BaseController", "GET", ControllerName + "/" + ApiName, getTask.Result.StatusCode);
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical("BaseController/UseHttpClientGet {1} {2}", ex.Message, ApiName);
            }
            return Result_;
        }
        #endregion

        #region HttpClient POST
        private HttpResponseMessage UseHttpClientPost(string Data, string ApiName, string ControllerName)
        {
            HttpResponseMessage Result_ = new HttpResponseMessage();
            try
            {
                using (var client = new HttpClient())
                {
                    string authtoken = GetAuthToken();
                    client.BaseAddress = new Uri(Environment.GetEnvironmentVariable("AM_SERVICE_URL") + ControllerName + "/" + ApiName);
                    client.DefaultRequestHeaders.Clear();
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authtoken);
                    var stringContent = new StringContent(Data, Encoding.UTF8, "application/json");
                    var postTask = client.PostAsync(ApiName, stringContent);
                    postTask.Wait();
                    Result_ = postTask.Result;
                    _logger.LogInformation("{0} {1} APIName: {2} StatusCode :{3}", "BaseController", "POST", ControllerName + "/" + ApiName, postTask.Result.StatusCode);
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical("BaseController/UseHttpClientPost {1} {2}", ex.Message, ApiName);
            }
            return Result_;
        }
        #endregion

        #region Settings

        #region UserMaster

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetUserType()
        {
            UserInfo _info = GetUserInformation();

            HttpResponseMessage response = UseHttpClientGet("?TypeID=" + _info.UserTypeID, "GetUserType", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetUsers()
        {
            UserInfo _info = GetUserInformation();

            HttpResponseMessage response = UseHttpClientGet("?TypeID=" + _info.UserTypeID + "&UserID=" + _info.UserID, "GetUsersByType", "Settings");
            return new HttpResponseMessageResult(response);
        }
        

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetForms()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetForms", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetUserRoles()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetRoles", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetMapping(string RoleId)
        {
            HttpResponseMessage response = UseHttpClientGet("?RoleId=" + RoleId, "GetMapping", "Settings");
            return new HttpResponseMessageResult(response);
        }


        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult FetchAdUsers()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "FetchAdUsers", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult EditUsers([FromForm] User Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.EditUserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "EditUsers", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveUsers([FromForm] User Data)
        {
            UserInfo userinfo = GetUserInformation();
            if (userinfo.UserTypeID.ToString() == Data.UserTypeID) return BadRequest("Cannot Create Account For Type " + userinfo.UserType);
            
            Data.EditUserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveUsers", "Settings");
            
            return new HttpResponseMessageResult(response);

        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteUsers([FromBody] DeleteFromDB Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.EditUserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteUsers", "Settings");
            return new HttpResponseMessageResult(response);
        }

        #endregion
        #region Db Backup

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult CreateBackup()
        {
            
            HttpResponseMessage response = UseHttpClientGet(null, "CreateBackup", "Settings");
            return new HttpResponseMessageResult(response);
        }
        #endregion
        #region RoleMaster

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetRoles()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetRoles", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetRolesByID(string RoleID)
        {
            HttpResponseMessage response = UseHttpClientGet("?RoleID=" + RoleID, "GetRolesByID", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult EditRoles([FromForm] Role Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "EditRoles", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SaveRoles([FromForm] Role Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveRoles", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult DeleteRoles([FromBody] DeleteFromDB Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteRoles", "Settings");
            return new HttpResponseMessageResult(response);
        }
        #endregion

        #region SystemPriviliges

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult GetMapping_2(string RoleId)
        {
            HttpResponseMessage response = UseHttpClientGet("?RoleId=" + RoleId, "GetMapping_2", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult UpdateRolesMapping([FromBody] RoleMapping Data)
        {
            UserInfo userinfo = GetUserInformation();
            Data.UserID = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "UpdateRolesMapping", "Settings");
            return new HttpResponseMessageResult(response);
        }

        #endregion

        #region SmtpSetting
        [HttpPost]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SmtpSettingUpdate([FromBody] SMTPSettings smtpSetting)
        {
            UserInfo userinfo = GetUserInformation();
            
            string encryptpassword = _dataEncryptor.EncryptPassword(smtpSetting.SmtpPassword);
            smtpSetting.SmtpPassword = encryptpassword;
            string jsonString = JsonConvert.SerializeObject(smtpSetting);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "SmtpSettingUpdate", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult SmtpSettingGet()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "SmtpSettingGet", "Settings");
            return new HttpResponseMessageResult(response);
        }
        #endregion


        #region Unassign api

        [HttpGet]
        [TypeFilter(typeof(AllowedApiAccess))]
        public IActionResult Getformsmaster()
        {
            UserInfo _info = GetUserInformation();

            HttpResponseMessage response = UseHttpClientGet("?TypeID=" + _info.UserTypeID + "&UserID=" + _info.UserID, "Getformsmaster", "Settings");
            return new HttpResponseMessageResult(response);
        }

        #endregion
        #endregion


        #region masterform

       
        #region Category
        [HttpPost]
        public IActionResult SaveCategoryData([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveCategoryData", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpGet]
        public IActionResult GetCategoryData()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetCategory", "Settings");
            return new HttpResponseMessageResult(response);
        }
   
 
        [HttpGet]
        public IActionResult GetactiveCategory()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetactiveCategory", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult GetCategoryDataByid([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "GetCategoryDataByid", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult DeleteCategoryDataByid([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteCategoryDataByid", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpPost]
        public IActionResult UpdateCategoryData([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "UpdateCategoryData", "Settings");
            return new HttpResponseMessageResult(response);
        }

        #endregion

        #region Product
        [HttpGet]
        public IActionResult GetProductData()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetProductData", "Settings");
            return new HttpResponseMessageResult(response);
        }

        [HttpGet]
        public IActionResult GetactiveProductData()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetactiveProductData", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult SaveProductData([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveProductData", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult GetProductDataByid([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "GetProductDataByid", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult DeleteProductDataByid([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteProductDataByid", "Settings");
            return new HttpResponseMessageResult(response);
        }

        #endregion

        #region Supplier's
        [HttpGet]
        public IActionResult GetSupplyData()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetSupplyData", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpGet]
        public IActionResult GetSupplyActiveData()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetSupplyActiveData", "Settings");
            return new HttpResponseMessageResult(response);
        }
     
        [HttpPost]
        public IActionResult SaveSuppliersData([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveSuppliersData", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult GetSuppliersDataByid([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "GetSuppliersDataByid", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult DeleteSuppliersDataByid([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteSuppliersDataByid", "Settings");
            return new HttpResponseMessageResult(response);
        }
        #endregion

        #region Distributor's
        [HttpGet]
        public IActionResult GetDistributorData()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetDistributorData", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult SaveDistributorData([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveDistributorData", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult GetDistributorDataByid([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "GetDistributorDataByid", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult DeleteDistributorDataByid([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteDistributorDataByid", "Settings");
            return new HttpResponseMessageResult(response);
        }
        #endregion

        #region SalesPerson
        [HttpGet]
        public IActionResult GetSalesPersonData()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetSalesPersonData", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult SaveSalesPersonData([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveSalesPersonData", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult GetSalesPersonByid([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "GetSalesPersonByid", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult DeleteSalesPersonByid([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteSalesPersonByid", "Settings");
            return new HttpResponseMessageResult(response);
        }
        #endregion





        #endregion



        #region productsku's
        [HttpGet]
        public IActionResult GetproductskuData()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetproductskuData", "Settings");
            return new HttpResponseMessageResult(response);
        }


        [HttpPost]
        public IActionResult SaveproductskuData([FromBody] List<Parameters> Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "SaveproductskuData", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult GetproductskuDataByid([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "GetproductskuDataByid", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult DeleteproductskuDataByid([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "DeleteproductskuDataByid", "Settings");
            return new HttpResponseMessageResult(response);
        }
        #endregion

        #region Purchase
        [HttpGet]
        public IActionResult GetMapCategory()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetMapCategory", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult GetProductByCategoryID([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);
            HttpResponseMessage response = UseHttpClientPost(jsonString, "GetProductByCategoryID", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult GetProductskuByProductID([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "GetProductskuByProductID", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult GetSupplierBalance([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "GetSupplierBalance", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpGet]
        public IActionResult GetInvoiceno()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetInvoiceno", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpGet]
        public IActionResult GetPaymentModeData()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetPaymentModeData", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult GetPriceByskuID([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "GetPriceByskuID", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult CheckBarcodeDuplication([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            Data.Param9 = userid;
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "CheckBarcodeDuplication", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpPost]
        public IActionResult SavePurchaseWithDetails([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            Data.Param9 = userid;
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "SavePurchaseWithDetails", "Settings");
            return new HttpResponseMessageResult(response);
        }
        [HttpGet]
        public IActionResult GetStockLocationTypeData()
        {
            HttpResponseMessage response = UseHttpClientGet(null, "GetStockLocationTypeData", "Settings");
            return new HttpResponseMessageResult(response);
        }
        #endregion
        #region Reports
        [HttpPost]
        public IActionResult GetSupplierLedgers([FromBody] Parameters Data)
        {
            UserInfo userinfo = GetUserInformation();
            var userid = userinfo.UserID.ToString();
            string jsonString = JsonConvert.SerializeObject(Data);

            HttpResponseMessage response = UseHttpClientPost(jsonString, "GetSupplierLedgers", "Settings");
            return new HttpResponseMessageResult(response);
        }
       
        #endregion
    }

}
