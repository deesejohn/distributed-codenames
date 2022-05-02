# Distributed Codenames

A multiplayer, realtime application based on the rules of the board game Codenames. The project aims to follow a microservice based architecture while maintaining vendor neutrality. It also makes use of cloud native technologies (see [CNCF Landscape](https://landscape.cncf.io/)).

## Contributing

This project is a way for me to experiment, evaluate, and demo new technologies. If you find a bug, spot an optimization, encounter a bad pratice, or simply want to point out something unidiomatic, please open an issue before raising a pull request.

### Required tools

1. [Docker](https://www.docker.com/products/docker-desktop)
1. A local [Kubernetes](https://kubernetes.io/) environment v1.23+ with feature flag [GRPCContainerProbe](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe)
   - (Recommended) [Minikube](https://minikube.sigs.k8s.io/docs/start/)
   - [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/)
1. [Helm](https://helm.sh/docs/intro/quickstart/)
1. [Skaffold](https://skaffold.dev/docs/install/)
1. [Pack](https://buildpacks.io/docs/tools/pack/) for [Cloud Native Buildpacks](https://buildpacks.io)
1. [ko](https://github.com/google/ko) for building Go containers without docker
1. (Optional) Languages to run applications natively (see architecture table below)

### Architecture

![Architecture graph](/docs/img/distributed-codewords.png)

| Service                             | Language / Framework                                                                       | Notes                                                                                                                                                                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Games](services/games)             | Go / [gRPC](https://grpc.io/)                                                              | Handles game logic, stores state in [Redis](https://redis.io/) and publishes updates to [NATS](https://nats.io/)                                                                                                                                       |
| [Games BFF](services/games-bff)     | Typescript / [Express](https://expressjs.com/)                                             | [Node.js](https://nodejs.org), subscribes to NATS and streams game updates to players in real time with websockets                                                                                                                                     |
| [Games SPA](services/games-spa)     | Typescript / [React](https://reactjs.org/)                                                 | Game frontend using [Material UI](https://material-ui.com/), [styled components](https://styled-components.com/), [formik](https://github.com/formium/formik), [axios](https://github.com/axios/axios), and hosted via [NGINX](https://www.nginx.com/) |
| [Lobbies](services/lobbies)         | C# / [ASP&#46;NET Core](https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-5.0) | Uses [SignalR](https://dotnet.microsoft.com/apps/aspnet/signalr) with a Redis backplane to stream updates to the SPA                                                                                                                                   |
| [Lobbies SPA](services/lobbies-spa) | Typescript / [Angular](https://angular.io/)                                                | Built with [Angular Material](https://material.angular.io/) and [Flex Layout](https://github.com/angular/flex-layout), allows players to select their team                                                                                             |
| [Players](services/players)         | Python / [FastAPI](https://fastapi.tiangolo.com/)                                          | Handles player state with Redis, hosted via [uvicorn](https://www.uvicorn.org/)                                                                                                                                                                        |
| [Players SPA](services/players-spa) | Typescript / React                                                                         | Allows players to set and update their nickname, hosted via NGINX                                                                                                                                                                                      |
| [Words](services/words)             | Go / gRPC                                                                                  | Provides different word lists to vary games                                                                                                                                                                                                            |

### Install Helm Dependencies

Current dependencies are:

1. [Emissary Ingress](https://github.com/emissary-ingress/emissary)
1. [NATS](https://nats.io/)
1. [Redis](https://redis.io/) *

\* Managed by Skaffold

```sh
helm repo add datawire https://app.getambassador.io
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo update
kubectl apply -f https://app.getambassador.io/yaml/emissary/2.2.2/emissary-crds.yaml
helm install -n emissary --create-namespace emissary-ingress datawire/emissary-ingress
helm install my-nats nats/nats
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

1. :heavy_check_mark: Add CI with Github Actions
   1. :construction: Automated tests (unit, integration, e2e, smoke, etc.)
   1. :o: Static Analysis ([SAST](https://owasp.org/www-community/Source_Code_Analysis_Tools), code coverage, quality gates, etc.)
   1. :heavy_check_mark: Render manifests and commit to [GitOps repository](https://github.com/deesejohn/distributed-codenames-cluster)
1. :heavy_check_mark: Add CD, evaluate [ArgoCD](https://argoproj.github.io/argo-cd/) and [Flux 2](https://github.com/fluxcd/flux2)
1. :heavy_check_mark: Add formatting/linting configurations
1. :o: Remove the sync dependency for Lobby to Player service, potentially with a [JWT](https://jwt.io/)
1. :o: Use Java for a microservice, possibly with [Quarkus](https://quarkus.io/) on [GraalVM](https://www.graalvm.org/)
1. :o: Evaluate other options for state management beyond Redis, potentially [ArangoDB](https://www.arangodb.com/)
1. :o: Leverage microfrontend patterns
