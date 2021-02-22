using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using lobbies.api.Services;
using Microsoft.AspNetCore.Routing;
using lobbies.api.Repositories;
using lobbies.api.Models;
using lobbies.api.Hubs;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;

namespace lobbies.api
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Env { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Env = env;
        }

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
                .AddRedis(GetRedisConnectionString(), tags: new string[]{"ready"});
            services.AddHttpClient<PlayerService>();
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
                        new OpenApiServer
                        {
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
}
