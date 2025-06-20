using System.Data;

namespace ManagementPortalApi.Models.Authentication
{
    public class BulkParameterInfo
    {
        public string ParameterName { get; set; } = string.Empty;
        public object? ParameterValue { get; set; }
        public Tuple<string, DataTable>? ParameterTable { get; set; }
    }
}
