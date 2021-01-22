# Distributed Codenames

A multiplayer, realtime application based on the rules of the board game Codenames. The project aims follow a microservice based architecture and make use of cloud native technologies (see [CNCF Landscape](https://landscape.cncf.io/)).

## Contributing

This project is a way for me to experiment, evaluate and demo new technologies, so some design decisions may be over engineered, inefficient, etc.

### Required tools

1. [Docker](https://www.docker.com/products/docker-desktop)
2. A local [Kubernetes](https://kubernetes.io/) environment (pick one)
    - Enable Kubernetes in "Docker for Desktop"
    - [Minikube](https://minikube.sigs.k8s.io/docs/start/)
    - [k3s](https://rancher.com/docs/k3s/latest/en/quick-start/)
3. [Helm](https://helm.sh/docs/intro/quickstart/)
4. [Skaffold](https://skaffold.dev/docs/install/)
5. (Optional) Languages to run applications natively (see architecture table below)

### Architecture

![Architecture graph](/docs/img/architecture.png)

| Service | Language / Framework | Notes |
| - | - | - |
| Games | Go / [gRPC](https://grpc.io/) | Handles game logic, stores state in [Redis](https://redis.io/) and publishes updates to [NATS](https://nats.io/) |
| Games BFF | Typescript / [Express](https://expressjs.com/) | Streams game session updates to clients in real time with websockets, subscribes to NATS |
| Games SPA | Typescript / [React](https://reactjs.org/) | Game frontend using [Material UI](https://material-ui.com/) components |
| Lobbies | C# / [ASP&#46;NET Core](https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-5.0) | Handles updating teams and game settings |
| Lobbies SPA | Typescript / [Angular](https://angular.io/) | Allows players to select their team, allows host to change game settings |
| Players | Python / [FastAPI](https://fastapi.tiangolo.com/) | Handles player state with redis |
| Players SPA | Typescript / React | Allows players to set their nickname |
| Words | Go / gRPC | Provides different word lists to vary games |

### Install Helm Dependencies

```sh
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx
helm install my-nats nats/nats
helm install games-redis bitnami/redis --set cluster.enabled=false
helm install lobbies-redis bitnami/redis --set cluster.enabled=false
helm install players-redis bitnami/redis --set cluster.enabled=false
```

### Startup services

```sh
# from the root directory
skaffold dev
```

### Debugging nats

```sh
kubectl exec -n default -it my-nats-box -- /bin/sh -l
nats-sub <subject>
```

## Potential improvements / technologies to evaluate

1. Remove the async call from Lobby -> Player service, potentially with a [jwt](https://jwt.io/)
2. Use Java for a microservice, possibly with [Quarkus](https://quarkus.io/) on [GraalVM](https://www.graalvm.org/)
3. AuthZ with [OPA](https://www.openpolicyagent.org/)
4. Evaluate other options for state management beyond Redis
