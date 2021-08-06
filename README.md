# Distributed Codenames

A multiplayer, realtime application based on the rules of the board game Codenames. The project aims to follow a microservice based architecture and make use of cloud native technologies (see [CNCF Landscape](https://landscape.cncf.io/)).

## Contributing

If you find a bug please open an issue or pull request. This project is a way for me to experiment, evaluate and demo new technologies, so some design decisions may be over engineered, inefficient, etc. If you spot an optimization or something unidiomatic, please start an issue to discuss.

### Required tools

1. [Docker](https://www.docker.com/products/docker-desktop)
2. A local [Kubernetes](https://kubernetes.io/) environment (pick one)
   - [Minikube](https://minikube.sigs.k8s.io/docs/start/)
   - [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/)
   - [k3d](https://k3d.io/#quick-start)
   - Enable Kubernetes in "Docker for Desktop"
3. [Helm](https://helm.sh/docs/intro/quickstart/)
4. [Skaffold](https://skaffold.dev/docs/install/)
5. (Optional) Languages to run applications natively (see architecture table below)

### Architecture

![Architecture graph](/docs/img/distributed-codewords.png)

| Service                             | Language / Framework                                                                       | Notes                                                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| [Games](services/games)             | Go / [gRPC](https://grpc.io/)                                                              | Handles game logic, stores state in [Redis](https://redis.io/) and publishes updates to [NATS](https://nats.io/) |
| [Games BFF](services/games-bff)     | Typescript / [Express](https://expressjs.com/)                                             | [Node.js](https://nodejs.org), subscribes to NATS and streams game updates to players in real time with websockets |
| [Games SPA](services/games-spa)     | Typescript / [React](https://reactjs.org/)                                                 | Game frontend using [Material UI](https://material-ui.com/), [styled components](https://styled-components.com/), [formik](https://github.com/formium/formik), [axios](https://github.com/axios/axios), and hosted via [NGINX](https://www.nginx.com/) |
| [Lobbies](services/lobbies)         | C# / [ASP&#46;NET Core](https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-5.0) | Uses [SignalR](https://dotnet.microsoft.com/apps/aspnet/signalr) with a Redis backplane to stream updates to the SPA |
| [Lobbies SPA](services/lobbies-spa) | Typescript / [Angular](https://angular.io/)                                                | Built with [Angular Material](https://material.angular.io/) and [Flex Layout](https://github.com/angular/flex-layout), allows players to select their team |
| [Players](services/players)         | Python / [FastAPI](https://fastapi.tiangolo.com/)                                          | Handles player state with Redis, hosted via [uvicorn](https://www.uvicorn.org/)                                  |
| [Players SPA](services/players-spa) | Typescript / React                                                                         | Allows players to set and update their nickname, hosted via NGINX                                                |
| [Words](services/words)             | Go / gRPC                                                                                  | Provides different word lists to vary games                                                                      |

### Install Helm Dependencies

Current dependencies are:

1. [ingress-nginx](https://kubernetes.github.io/ingress-nginx/)
1. [NATS](https://nats.io/)
1. [Redis](https://redis.io/)

```sh
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add datawire https://www.getambassador.io
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo update
helm install ambassador --create-namespace --namespace ambassador datawire/ambassador --set enableAES=false
helm install my-nats nats/nats
helm install games-redis bitnami/redis --set cluster.enabled=false
helm install lobbies-redis bitnami/redis --set cluster.enabled=false
helm install players-redis bitnami/redis --set cluster.enabled=false
```

### Startup services

```sh
skaffold dev
```

### Debugging nats

```sh
kubectl exec -n default -it my-nats-box -- /bin/sh -l
nats-sub <subject>
```

## Potential improvements / technologies to evaluate

1. ✔️ Add CI with Github Actions
   1. 🚧 Automated tests (unit, integration, e2e, smoke, etc.)
   1. ⭕ Static Analysis ([SAST](https://owasp.org/www-community/Source_Code_Analysis_Tools), code coverage, quality gates, etc.)
   1. ✔️ Render manifests and commit to [GitOps repository](https://github.com/deesejohn/distributed-codenames-cluster)
1. ✔️ Add CD, evaluate [ArgoCD](https://argoproj.github.io/argo-cd/) and [Flux 2](https://github.com/fluxcd/flux2)
1. ✔️ Add formatting/linting configurations
1. ⭕ Remove the sync dependency for Lobby to Player service, potentially with a [JWT](https://jwt.io/)
1. ⭕ Use Java for a microservice, possibly with [Quarkus](https://quarkus.io/) on [GraalVM](https://www.graalvm.org/)
1. ⭕ Evaluate other options for state management beyond Redis, potentially [ArangoDB](https://www.arangodb.com/)
1. ⭕ Leverage microfrontend patterns
