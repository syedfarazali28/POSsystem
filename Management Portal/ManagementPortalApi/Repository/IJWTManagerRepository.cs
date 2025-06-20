using ManagementPortalApi.Models.Authentication;
using System.Security.Claims;

namespace ManagementPortalApi.Repository
{
    public interface IJWTManagerRepository
    {
        Tokens Authenticate(UserDTO users);
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }
}
