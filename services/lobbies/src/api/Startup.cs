using lobbies.api.Hubs;
using lobbies.api.Models;
using lobbies.api.Repositories;
using lobbies.api.ServiceClients;
using lobbies.api.Services;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.OpenApi.Models;

namespace lobbies.api;

public class Startup(IConfiguration configuration, IWebHostEnvironment env)
{
    public IConfiguration Configuration { get; } = configuration;
    public IWebHostEnvironment Env { get; } = env;

    private static readonly string[] tags = ["ready"];

    public void ConfigureServices(IServiceCollection services)
    {
        if (Env.IsDevelopment())
        {
            services.AddDistributedMemoryCache();
        }
        else
        {
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = GetRedisConnectionString();
            });
        }
        services.AddControllers();
        services.AddGrpcClient<protos.GamesService.GamesServiceClient>(o =>
        {
            o.Address = Configuration.GetValue<Uri>("GAMES_HOST");
        });
        services.AddHealthChecks()
            .AddRedis(GetRedisConnectionString(), tags: tags);
        services.AddHttpClient<IPlayerServiceClient, PlayerServiceClient>(c =>
        {
            c.BaseAddress = Configuration.GetValue<Uri>("PLAYERS_HOST")
                ?? new Uri("http://localhost/api/players");
        });
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Lobbies Service",
                Version = "v1"
            });
        });
        services.AddTransient<LobbyService>();
        services.AddTransient<ILobbyRepository, RedisLobbyRepository>();
        services.Configure<RouteOptions>(options =>
        {
            options.LowercaseUrls = true;
        });
        services.AddSignalR()
            .AddStackExchangeRedis(GetRedisConnectionString());
    }

    public void Configure(IApplicationBuilder app)
    {
        if (Env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        app.UseSwagger(c =>
        {
            c.PreSerializeFilters.Add((swaggerDoc, httpReq) =>
            {
                swaggerDoc.Servers = new List<OpenApiServer>
                {
                    new() {
                        Url = Configuration.GetValue<string>("HOST_PREFIX")
                            ?? "/"
                    }
                };
            });
            c.RouteTemplate = "docs/{documentName}/openapi.json";
        });
        app.UseSwaggerUI(c =>
        {
            c.RoutePrefix = "docs";
            c.SwaggerEndpoint("v1/openapi.json", "lobbies v1");
        });

        app.UseRouting();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapHealthChecks("/health/live", new HealthCheckOptions
            {
                Predicate = _ => false
            });
            endpoints.MapHealthChecks("/health/ready", new HealthCheckOptions
            {
                Predicate = (check) => check.Tags.Contains("ready"),
            });
            endpoints.MapHub<LobbyHub>("/session", options =>
            {
                options.Transports = HttpTransportType.WebSockets;
            });
        });
    }

    private string GetRedisConnectionString()
        => Configuration.GetValue<string>("REDIS_HOST")
            + ":6379,abortConnect=False,password="
            + Configuration.GetValue<string>("REDIS_PASSWORD");
}
