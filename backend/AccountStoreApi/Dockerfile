FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app


# Copy everything
COPY . ./
# Restore as distinct layers
RUN dotnet restore
# Build and publish a release
RUN dotnet publish -c Release -o published

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/published .

RUN mkdir -p /app/AccountsFiles
RUN mkdir -p /app/WorkingFiles

RUN chmod -R 777 /app/AccountsFiles
RUN chmod -R 777 /app/WorkingFiles

EXPOSE 8080

ENTRYPOINT ["dotnet", "AccountStoreApi.dll"]
