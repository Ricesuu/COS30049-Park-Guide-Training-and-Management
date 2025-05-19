# PowerShell script to apply database fix for Park Guide Training and Management
# This script helps import the fix script into MySQL/phpMyAdmin

# Configuration
$dbUser = "root"       # Default phpMyAdmin username
$dbPass = ""           # Default phpMyAdmin password (blank)
$dbName = "park_guide_management"
$sqlFixFile = "database_fix.sql"
$fullPath = Join-Path -Path $PSScriptRoot -ChildPath $sqlFixFile

Write-Host "===== Park Guide Database Fix Utility ====="
Write-Host "This script will help fix database issues in your Park Guide application."
Write-Host "Make sure your MySQL/XAMPP server is running before continuing."
Write-Host ""

# Check if file exists
if (-not (Test-Path $fullPath)) {
    Write-Host "Error: Fix script not found at path: $fullPath" -ForegroundColor Red
    Write-Host "Please make sure the database_fix.sql file is in the same directory as this script."
    exit 1
}

# Function to check if MySQL command is available
function Test-MySQL {
    try {
        $mysqlVersion = & mysql --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            return $true
        } 
        return $false
    } catch {
        return $false
    }
}

# Function to try different possible mysql paths
function Find-MySQLPath {
    $possiblePaths = @(
        "mysql",
        "C:\xampp\mysql\bin\mysql.exe",
        "C:\wamp64\bin\mysql\mysql5.7.31\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
        "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe"
    )

    foreach ($path in $possiblePaths) {
        try {
            $mysqlVersion = & $path --version 2>&1
            if ($LASTEXITCODE -eq 0) {
                return $path
            }
        } catch {
            # Skip to next path
        }
    }
    
    return $null
}

# Find MySQL
$mysqlPath = Find-MySQLPath
if ($null -eq $mysqlPath) {
    Write-Host "MySQL command not found in PATH or common installation locations." -ForegroundColor Red
    Write-Host "Please enter the full path to mysql.exe:"
    $mysqlPath = Read-Host
    
    if (-not (Test-Path $mysqlPath)) {
        Write-Host "Invalid path. Cannot continue." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Found MySQL at: $mysqlPath" -ForegroundColor Green

# Ask for database credentials if needed
Write-Host "Do you want to use custom database credentials? (Default: username='root', password='')"
$useCustomCredentials = Read-Host "Enter Y for custom credentials, any other key for defaults"

if ($useCustomCredentials -eq "Y" -or $useCustomCredentials -eq "y") {
    $dbUser = Read-Host "Enter MySQL username"
    $dbPass = Read-Host "Enter MySQL password" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPass)
    $dbPass = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    
    # Ask for database name
    $customDbName = Read-Host "Enter database name (default: park_guide_management)"
    if ($customDbName) {
        $dbName = $customDbName
    }
}

# Confirmation
Write-Host ""
Write-Host "Ready to apply database fixes:"
Write-Host "- Fix script: $fullPath"
Write-Host "- Database: $dbName"
Write-Host ""
Write-Host "Are you sure you want to proceed? This will modify your database."
$confirmation = Read-Host "Enter Y to continue, any other key to cancel"

if ($confirmation -ne "Y" -and $confirmation -ne "y") {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
    exit 0
}

# Apply the fix
try {
    Write-Host "Applying database fix..." -ForegroundColor Cyan
    
    # Build command
    $mysqlCmd = """$mysqlPath"" -u$dbUser"
    if ($dbPass) {
        $mysqlCmd += " -p""$dbPass"""
    }
    $mysqlCmd += " $dbName < ""$fullPath"""
    
    # Execute using Invoke-Expression
    $output = Invoke-Expression "cmd /c $mysqlCmd 2>&1"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database fix applied successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "You should now be able to use the 'Assign' button on the assign-course page."
        Write-Host "If you still experience issues, please contact support."
    } else {
        Write-Host "Error occurred during database fix:" -ForegroundColor Red
        Write-Host $output
    }
} catch {
    Write-Host "Error applying database fix:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    
    # Manual instructions
    Write-Host ""
    Write-Host "Manual Fix Instructions:" -ForegroundColor Yellow
    Write-Host "1. Open phpMyAdmin in your web browser (usually http://localhost/phpmyadmin/)"
    Write-Host "2. Select your 'park_guide_management' database"
    Write-Host "3. Click on the 'SQL' tab"
    Write-Host "4. Open the database_fix.sql file in a text editor"
    Write-Host "5. Copy all its contents and paste into the phpMyAdmin SQL window"
    Write-Host "6. Click 'Go' to execute the script"
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
