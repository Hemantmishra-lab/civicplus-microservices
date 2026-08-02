$coreServices = @(
    "config-server",
    "discovery-server"
)

$gatewayService = @(
    "api-gateway"
)

$domainServices = @(
    "user-service",
    "auth-service",
    "complaint-service",
    "department-service",
    "media-service",
    "notification-service",
    "analytics-service"
)

New-Item -ItemType Directory -Force -Path .\logs | Out-Null

function Start-Microservice {
    param([string]$service, [int]$delaySeconds)
    Write-Host "Starting $service..." -ForegroundColor Cyan
    $jarPath = ".\$service\target\$service-1.0.0-SNAPSHOT.jar"
    if (Test-Path $jarPath) {
        # Added memory limits to prevent the VM from crashing when running 10+ services
        Start-Process java -ArgumentList "-Xmx256m -Xms64m -jar $jarPath" -WorkingDirectory $PWD.Path -RedirectStandardOutput ".\logs\$service.log" -RedirectStandardError ".\logs\$service-error.log" -WindowStyle Hidden
        if ($delaySeconds -gt 0) {
            Write-Host "Waiting $delaySeconds seconds for $service to initialize..." -ForegroundColor Yellow
            Start-Sleep -Seconds $delaySeconds
        }
    } else {
        Write-Host "JAR for $service not found at $jarPath" -ForegroundColor Red
    }
}

foreach ($service in $coreServices) {
    Start-Microservice -service $service -delaySeconds 45
}

foreach ($service in $gatewayService) {
    Start-Microservice -service $service -delaySeconds 30
}

foreach ($service in $domainServices) {
    Start-Microservice -service $service -delaySeconds 5
}

Write-Host "All services started in the background. Logs are in .\logs directory." -ForegroundColor Green
Write-Host "To stop them later, you can run: Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force" -ForegroundColor Green

Write-Host "Keeping script alive so background processes aren't terminated by the runner..."
while ($true) {
    Start-Sleep -Seconds 3600
}
