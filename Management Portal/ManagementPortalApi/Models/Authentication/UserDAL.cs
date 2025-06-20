using System.Data.SqlClient;
using System.Data;

namespace ManagementPortalApi.Models.Authentication
{
    public class UserDAL
    {
        public UserDTO ValidateUser(string pLogin, string pPassword, IConfiguration config)
        {
            UserDTO userDTO = new UserDTO();
            
            using (SqlConnection connection = new SqlConnection(Environment.GetEnvironmentVariable("AM_DATABASE")))//DataEncryptor.DecryptPassword(Environment.GetEnvironmentVariable("AM_AUTHENTICATION")))
            {
                using (SqlCommand sqlCommand = new SqlCommand("sp_select_user", connection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.AddWithValue("@LoginName", pLogin);
                    sqlCommand.Parameters.AddWithValue("@UserPassword", pPassword == "NULL" ? "NULL" : pPassword);
                    if (connection.State == ConnectionState.Closed)
                    {
                        connection.Open();
                    }
                    using (SqlDataReader dataReader = sqlCommand.ExecuteReader())
                    {
                        using (DataTable dataTable = new DataTable())
                        {
                            dataTable.Load(dataReader);

                            bool containsusername = dataTable.AsEnumerable().Any(row => pLogin.ToLower() == row.Field<string>("LoginName").ToLower());

                            if (dataTable.Rows.Count == 1 && containsusername == true)
                            {

                                bool active = (bool)dataTable.Rows[0]["IsActive"];

                                if (active)
                                {
                                    userDTO.UserID = (int)dataTable.Rows[0]["UserID"];
                                    userDTO.UserName = dataTable.Rows[0]["UserName"].ToString();
                                    userDTO.UserEmail = dataTable.Rows[0]["UserEmail"].ToString();
                                    return userDTO;
                                }
                                else
                                {
                                    return null;
                                }
                            }
                            else
                            {
                                return null;
                            }
                        }
                    }
                }
            }
        }
    }
}