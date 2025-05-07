FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["AdPlatform/AdPlatform.csproj", "AdPlatform/"]
RUN dotnet restore "AdPlatform/AdPlatform.csproj"
COPY . .
WORKDIR "/src/AdPlatform"
RUN dotnet build "./AdPlatform.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./AdPlatform.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY ./AdPlatform/Data /app/Data
ENTRYPOINT ["dotnet", "AdPlatform.dll"]
