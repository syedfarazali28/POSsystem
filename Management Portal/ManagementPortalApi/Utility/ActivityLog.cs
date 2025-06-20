namespace ManagementPortalApi.Utility
{
    public class ActivityLog
    {
        public static readonly int ActivityID_Login = 1;
        public static readonly int ActivityID_LogOut = 2;
        public static readonly int ActivityID_Get = 3;
        public static readonly int ActivityID_Insert = 4;
        public static readonly int ActivityID_Update = 5;
        public static readonly int ActivityID_Delete = 6;
        public static readonly int ActivityID_View = 7;
        public static readonly int ActivityID_Search = 8;
        public static readonly int ActivityID_Error = 9;

        public static readonly string ActivityDetails_Login = "Logged In";
        public static readonly string ActivityDetails_LogOut = "Logged Out";
        public static readonly string ActivityDetails_Get = "Data Is Retrived By Using " ;
        public static readonly string ActivityDetails_Insert = "Data Is Inserted By Using ";
        public static readonly string ActivityDetails_Update = "Data Is Updated By Using ";
        public static readonly string ActivityDetails_Delete = "Data Is Deleted By Using ";
        public static readonly string ActivityDetails_View = "User Visited This Page ";
        public static readonly string ActivityDetails_Search = "Data Is Searched By Using ";
        public static readonly string ActivityDetails_Get2 = "Data Is Not Retrived By Using ";
        public static readonly string ActivityDetails_Insert2 = "Data Is Not Inserted By Using ";
        public static readonly string ActivityDetails_Update2 = "Data Is Not Updated By Using ";
        public static readonly string ActivityDetails_Delete2 = "Data Is Not Deleted By Using ";
        public static readonly string ActivityDetails_Search2 = "Data Is Not Searched By Using ";

        public static string EmailSubject = "Your Randomly Generated Password";
        public static readonly string EmailBody = "Dear User,\r\n\r\nWe hope this email finds you well. " +
                             "As part of our security protocols, we have generated a random password for your account. " +
                             "Please find your new password below:\r\n\r\n" +
                             "\r\n\r\nFor security reasons, we recommend changing this password to something memorable as soon as possible. " +
                             "Should you have any questions or concerns, please don't hesitate to reach out to our support team." +
                             "\r\n\r\nThank you for your attention to this matter.";
    }
}
