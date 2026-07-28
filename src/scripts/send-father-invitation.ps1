param(
  [Parameter(Mandatory = $true)]
  [string]$BaseUrl,

  [string]$Secret = "",

  [Parameter(Mandatory = $true)]
  [string]$Email,

  [string]$Name = "",

  [ValidateSet("en", "am")]
  [string]$Locale = "en"
)

if ([string]::IsNullOrWhiteSpace($Secret)) {
  $secureSecret = Read-Host "Enter ADMIN_INVITE_SECRET" -AsSecureString
  $secretPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR(
    $secureSecret
  )

  try {
    $Secret = [Runtime.InteropServices.Marshal]::PtrToStringBSTR(
      $secretPointer
    )
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($secretPointer)
  }
}

$normalizedBaseUrl = $BaseUrl.TrimEnd("/")
$headers = @{
  "x-admin-invite-secret" = $Secret
}

$payload = @{
  email = $Email
  locale = $Locale
}

if (-not [string]::IsNullOrWhiteSpace($Name)) {
  $payload.name = $Name
}

try {
  $response = Invoke-RestMethod `
    -Uri "$normalizedBaseUrl/api/admin/father-invitations" `
    -Method Post `
    -Headers $headers `
    -ContentType "application/json" `
    -Body ($payload | ConvertTo-Json)

  Write-Host "Invitation sent successfully." -ForegroundColor Green
  Write-Host "Email: $($response.email)"
  Write-Host "Expires: $($response.expiresAt)"
} catch {
  Write-Host "Invitation could not be sent." -ForegroundColor Red

  if ($_.ErrorDetails.Message) {
    Write-Host $_.ErrorDetails.Message
  } else {
    Write-Host $_.Exception.Message
  }

  exit 1
}
