# Menjalankan backend Flask (port 5000) di jendela PowerShell baru, lalu
# menjalankan frontend Next.js (port 3000) di jendela ini. Jalankan dari
# root proyek: ./start-dev.ps1
$root = $PSScriptRoot
Start-Process powershell -ArgumentList '-NoExit', '-Command', "cd '$root\backend'; .venv\Scripts\python.exe run.py"
Start-Sleep -Seconds 2
Set-Location "$root\nextjs-app"
npm run dev
