FROM mcr.microsoft.com/dotnet/sdk:5.0 AS base
WORKDIR /app
COPY *.csproj .
RUN dotnet restore

FROM base AS build
WORKDIR /app
COPY . .
RUN dotnet publish -c release -o out --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=build /app/out ./
ENTRYPOINT ["dotnet", "./api.dll"]