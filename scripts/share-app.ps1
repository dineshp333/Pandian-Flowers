# Share பாண்டியன் பிளவர்ஸ் Website - No WiFi Restriction
# Run this in PowerShell

$webserverPort = 8000
$workDir = $PSScriptRoot

# Start web server
Write-Host "Starting web server on port $webserverPort..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$workDir'; python -m http.server $webserverPort --directory 'public'`"" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "To generate a PUBLIC link for your friends:" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Open a new PowerShell window and run:" -ForegroundColor Yellow
Write-Host "`nssh -R 80:localhost:$webserverPort ssh.localhost.run`n" -ForegroundColor White

Write-Host "This will generate a public URL like: https://abc123.lhr.life" -ForegroundColor Green
Write-Host "Share that link with your friends - they can access it from anywhere!`n" -ForegroundColor Green

Write-Host "Website is running at: http://localhost:$webserverPort" -ForegroundColor Green
