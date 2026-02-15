# Script to create feedback page
$filePath = "c:\Users\User\Documents\dispatchums use this\frontend\app\dashboard\dispatcher\feedback\page.tsx"

# Read the template from dashboard and modify it
Copy-Item -Path "c:\Users\User\Documents\dispatchums use this\frontend\app\dashboard\page.tsx" -Destination $filePath

Write-Host "Feedback page created successfully"
