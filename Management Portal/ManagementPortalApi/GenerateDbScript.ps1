# Create timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# Set folder to save files
$folder = "D:\New project\Management Portal\ManagementPortalApi\DatabasesBakup"
$dbName = "MPDatabase"
$sqlFile = "$folder\$dbName" + "_" + $timestamp + ".sql"
$zipFile = "$folder\$dbName" + "_" + $timestamp + ".zip"

# Create folder if not exists
if (!(Test-Path -Path $folder)) {
    New-Item -ItemType Directory -Path $folder | Out-Null
}

# Load SQL Server SMO Assemblies
Add-Type -AssemblyName "Microsoft.SqlServer.Smo"

# Connect to local SQL Server
$server = New-Object Microsoft.SqlServer.Management.Smo.Server "localhost"

# Get the database object
$db = $server.Databases[$dbName]

# Setup scripting options
$scripter = New-Object Microsoft.SqlServer.Management.Smo.Scripter ($server)
$scripter.Options.ScriptSchema = $true
$scripter.Options.ScriptData = $true
$scripter.Options.IncludeIfNotExists = $true
$scripter.Options.Encoding = [System.Text.Encoding]::UTF8
$scripter.Options.FileName = $sqlFile
$scripter.Options.AppendToFile = $true

# Script each user table
foreach ($table in $db.Tables) {
    if (!$table.IsSystemObject) {
        $scripter.Script($table)
    }
}

# Zip the .sql file
Compress-Archive -Path $sqlFile -DestinationPath $zipFile -Force

# Optional: Delete the original .sql file after zipping
Remove-Item $sqlFile -Force
