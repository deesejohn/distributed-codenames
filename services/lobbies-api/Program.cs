using Lobbies.Hubs;
using Lobbies.Models;
using Lobbies.Repositories;
using Lobbies.ServiceClients;
using Lobbies.Services;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
var REDIS_CONNECTION_STRING =
    builder.Configuration.GetValue<string>("REDIS_HOST")
    + ":6379,abortConnect=False,password="
    + builder.Configuration.GetValue<string>("REDIS_PASSWORD");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Lobbies Service",
        Version = "v1"
    });
});
builder.Services.AddGrpcClient<protos.GamesService.GamesServiceClient>(o =>
{
    o.Address = builder.Configuration.GetValue<Uri>("GAMES_HOST");
});
builder.Services.AddHealthChecks()
    .AddRedis(REDIS_CONNECTION_STRING, tags: ["ready"]);
builder.Services.AddHttpClient<IPlayerServiceClient, PlayerServiceClient>(c =>
{
    c.BaseAddress = builder.Configuration.GetValue<Uri>("PLAYERS_HOST")
        ?? new Uri("http://localhost/api/players");
});
builder.Services.AddSignalR().AddStackExchangeRedis(REDIS_CONNECTION_STRING);
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = REDIS_CONNECTION_STRING;
});
builder.Services.AddTransient<LobbyService>();
builder.Services.AddTransient<ILobbyRepository, RedisLobbyRepository>();
builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
});

var app = builder.Build();

app.MapControllers();
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false
});
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = (check) => check.Tags.Contains("ready"),
});
app.MapHub<LobbyHub>("/session", options =>
{
    options.Transports = HttpTransportType.WebSockets;
});
app.UseSwagger(c =>
{
    c.PreSerializeFilters.Add((swaggerDoc, httpReq) =>
    {
        swaggerDoc.Servers =
        [
            new() {
                Url = builder.Configuration.GetValue<string>("HOST_PREFIX")
                    ?? "/"
            }
        ];
    });
    c.RouteTemplate = "docs/{documentName}/openapi.json";
});
app.UseSwaggerUI(c =>
{
    c.RoutePrefix = "docs";
    c.SwaggerEndpoint("v1/openapi.json", "lobbies v1");
});

app.Run();
