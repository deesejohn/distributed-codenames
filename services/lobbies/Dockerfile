FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /source

COPY src/genproto/ src/genproto/
RUN dotnet restore src/genproto/ -r linux-x64

COPY src/api/api.csproj src/api/api.csproj
RUN dotnet restore src/api/ -r linux-x64

COPY src/ src/
RUN dotnet publish src/api/ -c release -o /app -r linux-x64 \
    --self-contained false --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:6.0-bullseye-slim-amd64
WORKDIR /app
COPY --from=build /app ./
ENTRYPOINT ["./api", "--urls", "http://0.0.0.0:8080"]