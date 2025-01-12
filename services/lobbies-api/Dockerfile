FROM mcr.microsoft.com/dotnet/sdk:8.0-jammy AS build
WORKDIR /source

COPY --link *.csproj .
RUN dotnet restore -r linux-x64

COPY --link . .
RUN dotnet publish -r linux-x64 --no-restore -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0-jammy-chiseled
WORKDIR /app
COPY --link --from=build /app .
ENTRYPOINT ["./lobbies-api", "--urls", "http://0.0.0.0:8080"]
