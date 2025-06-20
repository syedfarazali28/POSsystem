namespace ManagementPortalApi.Models.Sessions
{
    public class FormMaster
    {
        public string formid { get; set; }
        public string formcontroller { get; set; }
        public string formaction { get; set; }
        public string FormDisplayName { get; set; }
        public string ParentFormID { get; set; }
        public string Icon { get; set; }
        public string IsActive { get; set; }
    }
}
