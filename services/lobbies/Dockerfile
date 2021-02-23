FROM mcr.microsoft.com/dotnet/sdk:5.0 AS base
RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates
WORKDIR /app
COPY *.sln .
COPY src/*/*.csproj ./
RUN for file in $(ls *.csproj); \
    do mkdir -p src/${file%.*}/ && mv $file src/${file%.*}/; \
    done
COPY tests/*/*.csproj ./
RUN for file in $(ls *.csproj); \
    do mkdir -p tests/${file%.*}/ && mv $file tests/${file%.*}/; \
    done
RUN dotnet restore

FROM base AS test
WORKDIR /app
COPY . .
RUN dotnet test -c "Test" --collect:"XPlat Code Coverage"

FROM test AS build
WORKDIR /app
RUN dotnet publish -c release -o out --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=build /app/out ./
ENTRYPOINT ["dotnet", "./api.dll"]