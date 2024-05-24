$xamppPath = "C:\xampp"

function Read-UserChoice {
  param (
    [string]$question,
    [string[]]$choices
  )
  $first = $true
  $userPrompt = "Inserisci il numero della tua scelta"
  while ($true) {
    if ($first) {
      $first = $false
      Clear-Host
    }
    Write-Host $question

    for ($i = 0; $i -lt $choices.Length; $i++) {
      Write-Host ("{0}. {1}" -f ($i + 1), $choices[$i])
    }
    $userInput = Read-Host $userPrompt

    [int]$choiceNumber = 0
    if ([int]::TryParse($userInput, [ref]$choiceNumber) -and $choiceNumber -gt 0 -and $choiceNumber -le $choices.Length) {
      return $choiceNumber
    }
    Clear-Host
    $userPrompt = "Inserisci il NUMERO della tua scelta"
  }
}

function Find-Software {
  param (
    [string]$promptIfNotFound,
    [string]$softwarePath,
    [scriptblock]$installAction = $null
  )
  if (-Not (Test-Path -Path $softwarePath)) {
    $autochoices = "Inserisci il percorso manualmente", "Auto install", "Annulla setup"
    $choice = Read-UserChoice -question $promptIfNotFound -choices $autochoices
  } else {
    
  }
  if ($choice -eq 1) {
    $newSoftwarePath = $null
    do {
      Clear-Host
      $newSoftwarePath = Read-Host -Prompt "Inserisci il percorso`n"
    } while(-Not (Test-Path -Path $newSoftwarePath))
  } elseif ($choice -eq 2) {
    if ($installAction -eq $null) {
      Clear-Host
      Write-Host "Auto install not available for this software :(`nscript will now exit"
    }
  } elseif ($choice -eq 3) {

  }
  return
}

Start-Process -FilePath Find-Software -promptIfNotFound "XAMPP not found, `nWat do?" -softwarePath "C:\xampp" -Wait
while($true){
    if ((Get-Process xampp-control -ErrorAction SilentlyContinue).Responding){
        Start-Process -FilePath "C:\xampp\htdocs\automatedImport.bat" -Wait
        exit
    }
    Start-Sleep -Seconds 10
}