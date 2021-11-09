FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
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
COPY . .
RUN dotnet publish -c release -o out

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/out ./
ENTRYPOINT ["dotnet", "./api.dll"]