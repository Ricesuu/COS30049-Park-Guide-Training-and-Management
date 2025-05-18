# Setup script for Park Guide Training and Management Backend (PowerShell)
Write-Host "Setting up Park Guide Training and Management Backend..." -ForegroundColor Green

# Navigate to the backend-api directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$scriptPath\backend-api"

# Install dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install

# Run database setup (requires MySQL credentials)
Write-Host "Setting up database..." -ForegroundColor Yellow
Write-Host "Please enter your MySQL credentials:"
$mysqlUser = Read-Host "MySQL username"
$mysqlPassword = Read-Host "MySQL password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPassword)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
$mysqlDb = Read-Host "MySQL database name (default: parkguide)"
if ([string]::IsNullOrWhiteSpace($mysqlDb)) {
    $mysqlDb = "parkguide"
}

# Run SQL setup scripts
Write-Host "Running SQL setup scripts..." -ForegroundColor Yellow
$sqlCommand = "mysql -u `"$mysqlUser`" -p`"$plainPassword`" `"$mysqlDb`" < `"$scriptPath\backend\setup_all.sql`""
Invoke-Expression $sqlCommand

# Create environment file if it doesn't exist
if (-not (Test-Path ".env.local")) {
    Write-Host "Creating .env.local file..." -ForegroundColor Yellow
    @"
# Database Configuration
DB_HOST=localhost
DB_USER=$mysqlUser
DB_PASSWORD=$plainPassword
DB_NAME=$mysqlDb

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3001

# Firebase configuration (replace with your own values)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email
"@ | Out-File -FilePath ".env.local" -Encoding utf8
    Write-Host ".env.local file created. Please update Firebase configuration manually." -ForegroundColor Cyan
}

# Start the backend server
Write-Host "Starting backend server..." -ForegroundColor Green
npm run dev

Write-Host "Setup complete!" -ForegroundColor Green
