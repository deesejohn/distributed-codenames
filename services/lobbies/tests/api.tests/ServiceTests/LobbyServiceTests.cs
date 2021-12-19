using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoFixture.Xunit2;
using FluentAssertions;
using Grpc.Core;
using lobbies.api.Hubs;
using lobbies.api.Models;
using lobbies.api.Services;
using Microsoft.AspNetCore.SignalR;
using Moq;
using Xunit;
using static protos.GamesService;

namespace api.tests.ServiceTests
{
    public class LobbyServiceTests
    {
        private readonly Mock<GamesServiceClient> _gameService;
        private readonly Mock<IHubContext<LobbyHub>> _lobbyHub;
        private readonly Mock<ILobbyRepository> _repo;

        public LobbyServiceTests()
        {
            _gameService = new Mock<GamesServiceClient>();
            _lobbyHub = new Mock<IHubContext<LobbyHub>>();
            _repo = new Mock<ILobbyRepository>();
        }

        [Theory, AutoData]
        public async Task GetAsyncTest(Lobby expected)
        {
            _repo.Setup(r => r.GetAsync(expected.Id, CancellationToken.None))
                .ReturnsAsync(expected);
            var result = await BuildService().GetAsync(expected.Id, CancellationToken.None);
            result.Should().Be(expected);
        }

        [Theory, AutoData]
        public async Task StartNewAsyncTest(Player host)
        {
            _repo
                .Setup(r => r.UpdateAsync(
                    It.IsAny<string>(),
                    It.Is<Lobby>(l => l.HostId == host.Id && l.BlueTeam.Contains(host)),
                    CancellationToken.None
                ))
                .Returns(Task.CompletedTask);
            SetupHubContext();
            var result = await BuildService().StartNewAsync(host, CancellationToken.None);
            result.Should().NotBeNullOrWhiteSpace();
        }

        private LobbyService BuildService()
        {
            return new LobbyService(
                _gameService.Object,
                _lobbyHub.Object,
                _repo.Object
            );
        }

        private void SetupHubContext()
        {
            var clientProxy = Mock.Of<IClientProxy>(
                p => p.SendCoreAsync(It.IsAny<string>(), It.IsAny<object[]>(), CancellationToken.None) == Task.CompletedTask
            );
            var clients = Mock.Of<IHubClients>(
                h => h.Group(It.IsAny<string>()) == clientProxy
            );
            _lobbyHub.Setup(h => h.Clients).Returns(clients);
        }
    }
}