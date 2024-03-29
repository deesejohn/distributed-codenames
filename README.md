# Distributed Codenames

A multiplayer, realtime application based on the rules of the board game Codenames. The project aims to follow a microservice based architecture while maintaining vendor neutrality. It also makes use of cloud native technologies (see [CNCF Landscape](https://landscape.cncf.io/)).

## Contributing

This project is a way for me to experiment, evaluate, and demo new technologies. If you find a bug, spot an optimization, encounter a bad practice, or simply want to point out something unidiomatic, please open an issue before raising a pull request.

### Required tools

#### Running inside a [Development Container](https://containers.dev/) (see [.devcontainer](.devcontainer/))

1. [VSCode](https://code.visualstudio.com/) or the [Dev Container CLI](https://github.com/devcontainers/cli)
1. [Docker](https://docs.docker.com/engine/)

#### Running natively

1. [Docker](https://docs.docker.com/engine/)
2. A local [Kubernetes](https://kubernetes.io/) environment v1.27+ or v1.23+ with feature flag [GRPCContainerProbe](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe)
   - (Recommended) [Minikube](https://minikube.sigs.k8s.io/docs/start/)
   - [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/)
3. [Helm](https://helm.sh/docs/intro/quickstart/)
4. [Skaffold](https://skaffold.dev/docs/install/)
5. [ko](https://github.com/google/ko) for building Go containers without docker
6. (Optional) [Pack](https://buildpacks.io/docs/tools/pack/) for [Cloud Native Buildpacks](https://buildpacks.io)
7. (Optional) Languages to run applications natively (see architecture table below)

### Architecture

![Architecture graph](/docs/img/architecture.svg)

| Service                             | Language / Framework                              | Notes                                                                                                                                                                                                                                       |
| ----------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Games](services/games)             | Go / [gRPC](https://grpc.io/)                     | Handles game logic, stores state in [Redis](https://redis.io/) and publishes updates to [NATS](https://nats.io/)                                                                                                                            |
| [Games BFF](services/games-bff)     | TypeScript / [Express](https://expressjs.com/)    | [ts-rest](https://ts-rest.com/), [Node.js](https://nodejs.org), subscribes to NATS and streams game updates to players in real time with websockets                                                                                         |
| [Games SPA](services/games-spa)     | TypeScript / [React](https://reactjs.org/)        | Game frontend build with [Vite](https://vitejs.dev/), [Material UI](https://material-ui.com/), [React Hook Form](https://www.react-hook-form.com/), [axios](https://github.com/axios/axios), and hosted via [NGINX](https://www.nginx.com/) |
| [Lobbies](services/lobbies)         | C# / [ASP&#46;NET](https://dotnet.microsoft.com)  | Uses [SignalR](https://dotnet.microsoft.com/apps/aspnet/signalr) with a Redis backplane to stream updates to the SPA                                                                                                                        |
| [Lobbies SPA](services/lobbies-spa) | TypeScript / [Angular](https://angular.io/)       | Built with [Angular Material](https://material.angular.io/) and [tailwindcss](https://tailwindcss.com/), allows players to select their team                                                                                                |
| [Players](services/players)         | Python / [FastAPI](https://fastapi.tiangolo.com/) | Handles player state with Redis, hosted via [uvicorn](https://www.uvicorn.org/)                                                                                                                                                             |
| [Players SPA](services/players-spa) | TypeScript / React                                | Allows players to set and update their nickname, built with [formik](https://github.com/formium/formik) hosted via NGINX                                                                                                                    |
| [Words](services/words)             | Go / gRPC                                         | Provides different word lists to vary games                                                                                                                                                                                                 |

### Local development

#### Start minikube

```sh
minikube start
```

#### Install Helm Dependencies

Current dependencies are:

1. [Envoy Gateway](https://github.com/envoyproxy/gateway)
1. [NATS](https://nats.io/)
1. [Redis](https://redis.io/)

```sh
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo update
helm install envoy-gateway oci://docker.io/envoyproxy/gateway-helm --version v0.6.0 -n envoy-gateway-system --create-namespace
helm install nats nats/nats
helm install games-redis bitnami/redis --set architecture=standalone
helm install lobbies-redis bitnami/redis --set architecture=standalone
helm install players-redis bitnami/redis --set architecture=standalone
```

#### Startup services

```sh
skaffold dev
```

#### Debugging nats

```sh
kubectl exec -n default -it my-nats-box -- /bin/sh -l
nats-sub <subject>
```
