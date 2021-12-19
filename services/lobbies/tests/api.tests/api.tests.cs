using System;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using AutoFixture.Xunit2;
using FluentAssertions;
using Grpc.Core;
using lobbies.api;
using lobbies.api.Hubs;
using lobbies.api.Models;
using lobbies.api.ServiceClients;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Moq;
using Xunit;
using static protos.GamesService;

namespace api.tests
{
    public class ApiTests
    {
        private readonly Mock<CallInvoker> _gameServiceInvoker;
        private readonly IHostBuilder _host;
        private readonly Mock<IHubContext<LobbyHub>> _lobbyHub;
        private readonly Mock<ILobbyRepository> _lobbyRepo;
        private readonly Mock<IPlayerServiceClient> _players;

        public ApiTests()
        {
            _gameServiceInvoker = new Mock<CallInvoker>();
            _lobbyHub = new Mock<IHubContext<LobbyHub>>();
            _lobbyRepo = new Mock<ILobbyRepository>();
            _players = new Mock<IPlayerServiceClient>();
            var clientProxy = Mock.Of<IClientProxy>(
                p => p.SendCoreAsync(It.IsAny<string>(), It.IsAny<object[]>(), CancellationToken.None) == Task.CompletedTask
            );
            var clients = Mock.Of<IHubClients>(
                h => h.Group(It.IsAny<string>()) == clientProxy
            );
            _lobbyHub.Setup(h => h.Clients).Returns(clients);
            _host = new HostBuilder().ConfigureWebHost(webBuilder =>
            {
                webBuilder
                    .UseStartup<Startup>()
                    .UseTestServer()
                    .ConfigureServices(services =>
                    {
                        services.AddTransient<protos.GamesService.GamesServiceClient>(
                            _ => new GamesServiceClient(_gameServiceInvoker.Object)
                        );
                        services.AddTransient<IHubContext<LobbyHub>>(_ => _lobbyHub.Object);
                        services.AddTransient<ILobbyRepository>(_ => _lobbyRepo.Object);
                        services.AddTransient<IPlayerServiceClient>(_ => _players.Object);
                    });
            });
        }

        [Theory, AutoData]
        public async Task GetLobbyAsyncTest(Lobby expected)
        {
            // Arrange
            _lobbyRepo.Setup(r => r.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(expected)
                .Verifiable();

            _host.ConfigureServices(services =>
            {
                services.AddTransient<ILobbyRepository>(_ => _lobbyRepo.Object);
            });
            // Act
            using var server = await _host.StartAsync();
            var client = server.GetTestClient();
            var response = await client.GetAsync($"/{expected.Id}", CancellationToken.None);
            var result = await response.Content.ReadAsStringAsync();
            // Assert
            result.Should().Be(JsonSerializer.Serialize(expected));
            _lobbyRepo.Verify();
        }

        [Theory, AutoData]
        public async Task PostAsyncTest(Player player)
        {
            // Arrange
            _lobbyRepo.Setup(r => r.UpdateAsync(It.IsAny<string>(), It.IsAny<Lobby>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask)
                .Verifiable();
            _players.Setup(c => c.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(player)
                .Verifiable();
            _host.ConfigureServices(services =>
            {
                services.AddTransient<ILobbyRepository>(_ => _lobbyRepo.Object);
                services.AddTransient<IPlayerServiceClient>(_ => _players.Object);
            });
            // Act
            using var server = await _host.StartAsync();
            var client = server.GetTestClient();
            var request = new HttpRequestMessage(HttpMethod.Post, $"{client.BaseAddress}");
            request.Headers.Add("Cookie", $"player_id={player.Id};");
            var response = await client.SendAsync(request, CancellationToken.None);
            var result = response.Content.ReadAsStringAsync();
            // Assert
            result.Should().NotBeNull();
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            _lobbyRepo.Verify();
            _players.Verify();
        }
    }
}
