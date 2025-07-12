using ManagementPortalApi.Extensions;
using ManagementPortalApi.Logging;
using ManagementPortalApi.Models.Authentication;
using ManagementPortalApi.Repository;
using ManagementPortalApi.Utility;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers().AddNewtonsoftJson(o => o.UseMemberCasing());
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMemoryCache();
builder.Services.AddSingleton<IJWTManagerRepository, JWTManagerRepository>();
builder.Services.AddSingleton<UserDAL>();
builder.Services.AddSingleton<ManagementPortalApi.Context.DataAccessLayer>();
builder.Services.AddSingleton<SendEmail>();
builder.Services.AddSingleton<DataEncryptor>();
builder.Services.AddSingleton<RandomStringGenerator>();
builder.Services.AddHttpContextAccessor();

// Logging
builder.Host.ConfigureLogging((context, logging) =>
{
    logging.FileLogger(options =>
    {
        context.Configuration.GetSection("Logging").GetSection("FileLoggerProvider").Bind(options);
    });
});

// Authentication
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(o =>
{
    var key = Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("AM_JWT_KEY"));
    o.SaveToken = true;
    o.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = "UserID",
        SaveSigninToken = true,
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero
    };
    o.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            if (context.Exception is SecurityTokenExpiredException)
            {
                context.Response.Headers.Add("IS-TOKEN-EXPIRED", "true");
            }
            return Task.CompletedTask;
        }
    };
});

// Session
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromDays(365);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.MaxAge = TimeSpan.FromDays(365);
});

// CORS
builder.Services.AddCors(o =>
{
    o.AddPolicy("_AllowedWebAPI", policy =>
    {
        policy
            .WithOrigins(Environment.GetEnvironmentVariable("AM_VIEWURL"))
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Middleware
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1"));

//app.UseHttpsRedirection();
app.UseRouting();

app.UseSession(); // Important: session before authentication
app.UseCors("_AllowedWebAPI");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
