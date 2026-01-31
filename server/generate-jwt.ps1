# PowerShell script - Tạo JWT_SECRET an toàn cho production

Write-Host "🔐 Tạo JWT_SECRET mới (32 bytes = 256 bits)..." -ForegroundColor Green

$JWT_SECRET = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Write-Host ""
Write-Host "✅ JWT_SECRET mới đã được tạo:" -ForegroundColor Green
Write-Host "JWT_SECRET=$JWT_SECRET" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Cập nhật vào .env file:" -ForegroundColor Yellow
Write-Host "  Thêm dòng sau vào server/.env" -ForegroundColor White
Write-Host "  JWT_SECRET=$JWT_SECRET" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Hoặc chạy lệnh sau để copy:" -ForegroundColor Yellow
Write-Host "  Set-Clipboard -Value `"JWT_SECRET=$JWT_SECRET`"" -ForegroundColor White
