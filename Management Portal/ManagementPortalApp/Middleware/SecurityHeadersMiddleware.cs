using Microsoft.Extensions.Primitives;

namespace ManagementPortalApp.Middleware
{
    public sealed class SecurityHeadersMiddleware
    {
        private readonly RequestDelegate _next;

        public SecurityHeadersMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        //public Task Invoke(HttpContext context)
        //{
        //    string style_src_elem = "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'sha256-UQBytKn0DQWyDg5/YC+FaQxonSsbQk4k0ErDHqBuhfw='";
        //    context.Response.Headers.Add("x-content-type-options", new StringValues("nosniff"));
        //    context.Response.Headers.Add("x-frame-options", new StringValues("DENY"));
        //    context.Response.Headers.Add("x-xss-protection", new StringValues("1; mode=block"));
        //    context.Response.Headers.Add("Permissions-Policy", "geolocation=(self)");
        //    context.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
        //    context.Response.Headers["Pragma"] = "no-cache";
        //    context.Response.Headers["Expires"] = "0";

        //    context.Response.Headers.Add("Content-Security-Policy", new StringValues(
        //        "base-uri 'self';" +
        //        "block-all-mixed-content;" +
        //        "child-src 'self';" +
        //        "connect-src 'self' " + Environment.GetEnvironmentVariable("AM_CONNECT_SRC") + ";" +
        //        "default-src 'self';" +
        //        "font-src 'self';" +
        //        "form-action 'self';" +
        //        "frame-ancestors 'self';" +
        //        "frame-src 'self';" +
        //        "img-src 'self';" +
        //        "manifest-src 'self';" +
        //        "media-src 'self';" +
        //        "object-src 'self';" +
        //        "script-src 'self';" +
        //        "script-src-attr 'self';" +
        //        "script-src-elem 'self';" +
        //        "style-src 'self';" +
        //        "style-src-attr 'self';" +
        //        "style-src-elem 'self' "+ style_src_elem + ";" +
        //        "upgrade-insecure-requests;" +
        //        "worker-src 'self';"
        //        ));

        //    context.Response.Headers.Add("referrer-policy", new StringValues("strict-origin-when-cross-origin"));
        //    return _next(context);
        //}

        public Task Invoke(HttpContext context)
        {
            string style_src_elem = "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'sha256-UQBytKn0DQWyDg5/YC+FaQxonSsbQk4k0ErDHqBuhfw='";
            context.Response.Headers.Append("x-content-type-options", new StringValues("nosniff"));
            context.Response.Headers.Append("x-frame-options", new StringValues("DENY"));
            context.Response.Headers.Append("x-xss-protection", new StringValues("1; mode=block"));
            context.Response.Headers.Append("Permissions-Policy", "geolocation=(self)");
            context.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
            context.Response.Headers["Pragma"] = "no-cache";
            context.Response.Headers["Expires"] = "0";

            context.Response.Headers.Append("Content-Security-Policy", new StringValues(
                "base-uri 'self';" +
                "block-all-mixed-content;" +
                "child-src 'self';" +
                "connect-src 'self' " + Environment.GetEnvironmentVariable("AM_CONNECT_SRC") + ";" +
                "default-src 'self';" +
                "font-src 'self';" +
                "form-action 'self';" +
                "frame-ancestors 'none';" +
                "frame-src 'self';" +
                "img-src 'self';" +
                "manifest-src 'self';" +
                "media-src 'self';" +
                "object-src 'self';" +
                "script-src 'self';" +
                "script-src-attr 'self';" +
                "script-src-elem 'self';" +
                "style-src 'self';" +
                "style-src-attr 'self';" +
                "style-src-elem 'self' " + style_src_elem + ";" +
                "upgrade-insecure-requests;" +
                "worker-src 'self';"
                ));

            context.Response.Headers.Append("referrer-policy", new StringValues("strict-origin-when-cross-origin"));
            return _next(context);
        }
    }

}
